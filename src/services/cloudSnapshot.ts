import {
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
  writeBatch,
  type DocumentReference
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { AppSnapshot } from '../utils/appData';
import {
  BodyMeasurementEntry,
  ExerciseDefinition,
  RoutineTemplate,
  UserProfile,
  WeightLogEntry,
  WorkoutSession
} from '../types/workout';

interface CloudMainDocument {
  schemaVersion: number;
  profile: UserProfile | null;
  currentWorkout: WorkoutSession | null;
  customExercises: ExerciseDefinition[];
  routineTemplates: RoutineTemplate[];
  weightLogs: WeightLogEntry[];
  bodyMeasurements: BodyMeasurementEntry[];
}

export interface LoadedCloudSnapshot {
  exists: boolean;
  snapshot: AppSnapshot;
}

type HistoryOperation =
  | { type: 'set'; id: string; data: WorkoutSession }
  | { type: 'delete'; id: string };

const sanitize = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

// Los IDs de documento de Firestore no pueden contener "/"
const encodeDocumentId = (id: string): string => id.replace(/\//g, '_');

function requireFirestore() {
  if (!db) {
    throw new Error('Firestore no está configurado. Revisa las variables de entorno de Firebase.');
  }
  return db;
}

export async function loadCloudSnapshot(uid: string): Promise<LoadedCloudSnapshot> {
  const firestore = requireFirestore();
  const mainRef = doc(firestore, 'users', uid);
  const workoutsRef = collection(firestore, 'users', uid, 'workouts');

  const [mainSnapshot, workoutsSnapshot] = await Promise.all([
    getDoc(mainRef),
    getDocs(workoutsRef)
  ]);

  const main = mainSnapshot.exists()
    ? (mainSnapshot.data() as Partial<CloudMainDocument>)
    : null;

  const history = workoutsSnapshot.docs.map((entry) => {
    const data = entry.data() as WorkoutSession;
    return { ...data, id: data.id || entry.id };
  });

  return {
    exists: mainSnapshot.exists() || workoutsSnapshot.size > 0,
    snapshot: {
      history,
      customExercises: main?.customExercises ?? [],
      currentWorkout: main?.currentWorkout ?? null,
      routineTemplates: main?.routineTemplates ?? [],
      weightLogs: main?.weightLogs ?? [],
      bodyMeasurements: main?.bodyMeasurements ?? [],
      userProfile: main?.profile ?? null
    }
  };
}

/**
 * Guarda el estado completo en Firestore. Mantiene huellas de lo último
 * sincronizado para escribir únicamente los entrenamientos que cambiaron.
 */
export class CloudSyncEngine {
  private readonly uid: string;
  private mainFingerprint = '';
  private readonly historyFingerprints = new Map<string, string>();
  private historyIds = new Set<string>();
  private queue: Promise<void> = Promise.resolve();

  constructor(uid: string) {
    this.uid = uid;
  }

  save(snapshot: AppSnapshot, force = false): Promise<void> {
    const task = this.queue.then(() => this.saveInternal(snapshot, force));
    this.queue = task.catch(() => undefined);
    return task;
  }

  private async saveInternal(snapshot: AppSnapshot, force: boolean): Promise<void> {
    const firestore = requireFirestore();

    const mainData: CloudMainDocument = sanitize({
      schemaVersion: 1,
      profile: snapshot.userProfile,
      currentWorkout: snapshot.currentWorkout,
      customExercises: snapshot.customExercises,
      routineTemplates: snapshot.routineTemplates,
      weightLogs: snapshot.weightLogs,
      bodyMeasurements: snapshot.bodyMeasurements
    });

    const mainFingerprint = JSON.stringify(mainData);

    if (force || mainFingerprint !== this.mainFingerprint) {
      await setDoc(doc(firestore, 'users', this.uid), {
        ...mainData,
        updatedAt: serverTimestamp()
      });
      this.mainFingerprint = mainFingerprint;
    }

    const operations: HistoryOperation[] = [];
    const nextHistoryIds = new Set<string>();
    const nextHistoryFingerprints = new Map<string, string>();

    snapshot.history.forEach((workout) => {
      const data = sanitize(workout);
      const fingerprint = JSON.stringify(data);
      nextHistoryIds.add(workout.id);
      nextHistoryFingerprints.set(workout.id, fingerprint);

      if (force || this.historyFingerprints.get(workout.id) !== fingerprint) {
        operations.push({ type: 'set', id: workout.id, data });
      }
    });

    this.historyIds.forEach((id) => {
      if (!nextHistoryIds.has(id)) {
        operations.push({ type: 'delete', id });
      }
    });

    const chunkSize = 400;
    for (let index = 0; index < operations.length; index += chunkSize) {
      const batch = writeBatch(firestore);
      operations.slice(index, index + chunkSize).forEach((operation) => {
        const reference: DocumentReference = doc(
          firestore,
          'users',
          this.uid,
          'workouts',
          encodeDocumentId(operation.id)
        );

        if (operation.type === 'set') {
          batch.set(reference, operation.data);
        } else {
          batch.delete(reference);
        }
      });
      await batch.commit();
    }

    this.historyIds = nextHistoryIds;
    this.historyFingerprints.clear();
    nextHistoryFingerprints.forEach((value, key) => this.historyFingerprints.set(key, value));
  }
}
