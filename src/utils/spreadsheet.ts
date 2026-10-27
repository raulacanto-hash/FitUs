import {
  BodyMeasurementEntry,
  BodyMeasurementKey,
  ExerciseDefinition,
  MuscleCategory,
  RoutineTemplate,
  UserProfile,
  WeightLogEntry,
  WorkoutSession,
  WorkoutSet
} from '../types/workout';
import { getLocalDateString } from './dates';
import { sortWorkoutsByDateDesc } from './workoutStats';

export interface ExportData {
  history: WorkoutSession[];
  routineTemplates: RoutineTemplate[];
  customExercises: ExerciseDefinition[];
  weightLogs: WeightLogEntry[];
  bodyMeasurements: BodyMeasurementEntry[];
  userProfile: UserProfile;
}

export interface ImportedData {
  history?: WorkoutSession[];
  routineTemplates?: RoutineTemplate[];
  customExercises?: ExerciseDefinition[];
  weightLogs?: WeightLogEntry[];
  bodyMeasurements?: BodyMeasurementEntry[];
  userProfile?: UserProfile;
}

const WORKOUT_HEADERS = [
  'ID Entrenamiento',
  'Fecha',
  'Rutina',
  'Duración (min)',
  'ID Ejercicio',
  'Ejercicio',
  'Categoría',
  'Serie',
  'Peso (kg)',
  'Repeticiones',
  'Completada',
  'Calentamiento',
  'RPE',
  'Notas'
];

const ROUTINE_HEADERS = [
  'ID Rutina',
  'Rutina',
  'Categoría',
  'Subtítulo',
  'Minutos estimados',
  'Personalizada',
  'ID Ejercicio',
  'Ejercicio',
  'Categoría muscular',
  'Series objetivo',
  'Repeticiones',
  'Peso (kg)',
  'Rango reps',
  'Rango peso'
];

const CUSTOM_EXERCISE_HEADERS = ['ID', 'Nombre', 'Categoría', 'Equipo'];

const WEIGHT_HEADERS = ['ID', 'Fecha', 'Peso (kg)', 'Grasa (%)', 'Notas'];

const MEASUREMENT_HEADERS = [
  'ID',
  'Fecha',
  'Pecho',
  'Cintura',
  'Cadera',
  'Brazo izquierdo',
  'Brazo derecho',
  'Muslo izquierdo',
  'Muslo derecho',
  'Gemelos',
  'Hombros',
  'Cuello',
  'Notas'
];

const PROFILE_HEADERS = ['Nombre', 'Objetivo semanal', 'Peso objetivo (kg)'];

const MUSCLE_CATEGORIES: MuscleCategory[] = [
  'Pecho',
  'Espalda',
  'Hombros',
  'Bíceps',
  'Tríceps',
  'Antebrazos',
  'Cuádriceps',
  'Isquiotibiales',
  'Glúteos',
  'Gemelos',
  'Aductores',
  'Abdomen'
];

const MEASUREMENT_COLUMNS: Array<[string, BodyMeasurementKey]> = [
  ['Pecho', 'chest'],
  ['Cintura', 'waist'],
  ['Cadera', 'hips'],
  ['Brazo izquierdo', 'leftArm'],
  ['Brazo derecho', 'rightArm'],
  ['Muslo izquierdo', 'leftThigh'],
  ['Muslo derecho', 'rightThigh'],
  ['Gemelos', 'calves'],
  ['Hombros', 'shoulders'],
  ['Cuello', 'neck']
];

type CellValue = string | number | boolean | Date | null | undefined;

const normalize = (value: unknown): string =>
  String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');

const textValue = (value: unknown): string => String(value ?? '').trim();

const numberValue = (value: unknown): number | undefined => {
  if (value === '' || value === null || value === undefined) return undefined;
  if (typeof value === 'number') return Number.isFinite(value) ? value : undefined;

  const normalized = String(value)
    .replace(/\s/g, '')
    .replace(/\.(?=\d{3}(?:\D|$))/g, '')
    .replace(',', '.')
    .replace(/[^\d.-]/g, '');

  if (normalized === '' || normalized === '-' || normalized === '.') return undefined;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const numberOrEmpty = (value: unknown): number | '' => {
  const parsed = numberValue(value);
  return parsed === undefined ? '' : parsed;
};

const booleanValue = (value: unknown, fallback = false): boolean => {
  if (value === '' || value === null || value === undefined) return fallback;
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value !== 0;

  const normalized = normalize(value);
  if (['si', 'true', '1', 'x', 'completada', 'completado', 'yes'].includes(normalized)) return true;
  if (['no', 'false', '0', 'sincompletar', 'pendiente'].includes(normalized)) return false;
  return fallback;
};

const dateValue = (value: unknown): string => {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return getLocalDateString(value);
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    // Fecha serial de Excel
    const date = new Date(Date.UTC(1899, 11, 30) + value * 86400000);
    if (!Number.isNaN(date.getTime())) {
      const year = date.getUTCFullYear();
      const month = String(date.getUTCMonth() + 1).padStart(2, '0');
      const day = String(date.getUTCDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
  }

  const text = textValue(value);
  if (!text) return '';

  let match = text.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
  if (match) {
    return `${match[1]}-${String(match[2]).padStart(2, '0')}-${String(match[3]).padStart(2, '0')}`;
  }

  match = text.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
  if (match) {
    return `${match[3]}-${String(match[2]).padStart(2, '0')}-${String(match[1]).padStart(2, '0')}`;
  }

  const parsed = new Date(text);
  return Number.isNaN(parsed.getTime()) ? '' : getLocalDateString(parsed);
};

const slug = (value: string): string => {
  const normalized = normalize(value).slice(0, 32);
  return normalized || 'registro';
};

const muscleCategoryValue = (value: unknown): MuscleCategory => {
  const normalized = normalize(value);
  return (
    MUSCLE_CATEGORIES.find((category) => normalize(category) === normalized) ?? 'Pecho'
  );
};

const downloadBlob = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
};

const exportFileName = (prefix: string, extension: string): string =>
  `${prefix}_${getLocalDateString()}.${extension}`;

function workoutRows(history: WorkoutSession[]): CellValue[][] {
  const rows: CellValue[][] = [];

  history.forEach((workout) => {
    const base = [
      workout.id,
      workout.date,
      workout.routineName,
      workout.durationMinutes ?? 45
    ];

    if (!workout.exercises || workout.exercises.length === 0) {
      rows.push([...base, '', '', '', '', '', '', '', '', '', '', '']);
      return;
    }

    workout.exercises.forEach((exercise) => {
      if (!exercise.sets || exercise.sets.length === 0) {
        rows.push([
          ...base,
          exercise.id,
          exercise.name,
          exercise.category,
          '',
          '',
          '',
          '',
          '',
          '',
          exercise.notes
        ]);
        return;
      }

      exercise.sets.forEach((set, index) => {
        rows.push([
          ...base,
          exercise.id,
          exercise.name,
          exercise.category,
          index + 1,
          set.weight === '' ? '' : set.weight,
          set.reps === '' ? '' : set.reps,
          set.completed ? 'Sí' : 'No',
          set.isWarmup ? 'Sí' : '',
          set.rpe ?? '',
          exercise.notes
        ]);
      });
    });
  });

  return rows;
}

function routineRows(routines: RoutineTemplate[]): CellValue[][] {
  const rows: CellValue[][] = [];

  routines.forEach((routine) => {
    if (routine.exercises.length === 0) {
      rows.push([
        routine.id,
        routine.name,
        routine.category,
        routine.subtitle,
        routine.estimatedMinutes,
        routine.isCustom ? 'Sí' : 'No',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        ''
      ]);
      return;
    }

    routine.exercises.forEach((exercise) => {
      rows.push([
        routine.id,
        routine.name,
        routine.category,
        routine.subtitle,
        routine.estimatedMinutes,
        routine.isCustom ? 'Sí' : 'No',
        '',
        exercise.name,
        exercise.category,
        exercise.targetSets,
        exercise.defaultReps,
        exercise.defaultWeight,
        exercise.repsRange ?? '',
        exercise.weightRange ?? ''
      ]);
    });
  });

  return rows;
}

function customExerciseRows(exercises: ExerciseDefinition[]): CellValue[][] {
  return exercises.map((exercise) => [
    exercise.id,
    exercise.name,
    exercise.category,
    exercise.equipment ?? ''
  ]);
}

function weightRows(logs: WeightLogEntry[]): CellValue[][] {
  return logs.map((entry) => [
    entry.id,
    entry.date,
    entry.weight,
    entry.bodyFat ?? '',
    entry.notes ?? ''
  ]);
}

function measurementRows(entries: BodyMeasurementEntry[]): CellValue[][] {
  return entries.map((entry) => [
    entry.id,
    entry.date,
    ...MEASUREMENT_COLUMNS.map(([, key]) => entry[key] ?? ''),
    entry.notes ?? ''
  ]);
}

function profileRows(profile: UserProfile): CellValue[][] {
  return [[profile.name, profile.weeklyGoal, profile.targetWeight ?? '']];
}

export async function exportToExcel(data: ExportData): Promise<void> {
  const XLSX = await import('xlsx');
  const workbook = XLSX.utils.book_new();

  const addSheet = (name: string, headers: string[], rows: CellValue[][], widths: number[]) => {
    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    worksheet['!cols'] = widths.map((width) => ({ wch: width }));
    XLSX.utils.book_append_sheet(workbook, worksheet, name);
  };

  addSheet(
    'Entrenamientos',
    WORKOUT_HEADERS,
    workoutRows(sortWorkoutsByDateDesc(data.history)),
    [22, 12, 28, 14, 18, 34, 14, 8, 11, 13, 12, 14, 7, 30]
  );
  addSheet('Rutinas', ROUTINE_HEADERS, routineRows(data.routineTemplates), [
    22, 28, 18, 34, 16, 13, 18, 34, 16, 15, 13, 11, 13, 13
  ]);
  addSheet(
    'Ejercicios personalizados',
    CUSTOM_EXERCISE_HEADERS,
    customExerciseRows(data.customExercises),
    [22, 34, 16, 18]
  );
  addSheet('Pesajes', WEIGHT_HEADERS, weightRows(data.weightLogs), [22, 12, 12, 12, 30]);
  addSheet(
    'Medidas',
    MEASUREMENT_HEADERS,
    measurementRows(data.bodyMeasurements),
    [22, 12, 10, 10, 10, 15, 15, 15, 15, 11, 11, 10, 30]
  );
  addSheet('Perfil', PROFILE_HEADERS, profileRows(data.userProfile), [28, 17, 20]);

  const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' }) as ArrayBuffer;
  downloadBlob(
    new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    }),
    exportFileName('fitus_datos', 'xlsx')
  );
}

export async function exportWorkoutsCsv(history: WorkoutSession[]): Promise<void> {
  const XLSX = await import('xlsx');
  const worksheet = XLSX.utils.aoa_to_sheet([
    WORKOUT_HEADERS,
    ...workoutRows(sortWorkoutsByDateDesc(history))
  ]);
  const csv = XLSX.utils.sheet_to_csv(worksheet);
  downloadBlob(
    new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' }),
    exportFileName('fitus_entrenamientos', 'csv')
  );
}

function normalizeRow(row: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  Object.entries(row).forEach(([key, value]) => {
    result[normalize(key)] = value;
  });
  return result;
}

const getCell = (row: Record<string, unknown>, ...keys: string[]): unknown => {
  for (const key of keys) {
    const value = row[normalize(key)];
    if (value !== '' && value !== null && value !== undefined) return value;
  }
  return '';
};

function parseWorkouts(rows: Record<string, unknown>[]): WorkoutSession[] {
  const workouts = new Map<string, WorkoutSession>();
  let anonymousIndex = 0;

  rows.forEach((rawRow) => {
    const row = normalizeRow(rawRow);
    const exerciseName = textValue(getCell(row, 'Ejercicio', 'Exercise'));
    const routineName =
      textValue(getCell(row, 'Rutina', 'Routine', 'Entrenamiento')) || 'Entrenamiento importado';
    const date = dateValue(getCell(row, 'Fecha', 'Date')) || getLocalDateString();
    const suppliedId = textValue(getCell(row, 'ID Entrenamiento', 'ID', 'Workout ID'));
    if (!exerciseName && !suppliedId && !textValue(getCell(row, 'Rutina'))) return;

    const key = suppliedId || `anon-${date}-${slug(routineName)}`;
    let workout = workouts.get(key);

    if (!workout) {
      workout = {
        id: suppliedId || `import-${date}-${slug(routineName)}-${anonymousIndex++}`,
        routineName,
        date,
        durationMinutes:
          numberValue(getCell(row, 'Duración (min)', 'Duración', 'Duration')) ?? 45,
        exercises: [],
        updatedAt: Date.now()
      };
      workouts.set(key, workout);
    }

    if (!exerciseName) return;

    const category = muscleCategoryValue(getCell(row, 'Categoría', 'Categoría muscular'));
    const exerciseId =
      textValue(getCell(row, 'ID Ejercicio', 'Exercise ID')) ||
      `${workout.id}-ex-${workout.exercises.length}`;
    let exercise = workout.exercises.find(
      (item) => item.id === exerciseId || item.name === exerciseName
    );

    if (!exercise) {
      exercise = {
        id: exerciseId,
        name: exerciseName,
        category,
        notes: textValue(getCell(row, 'Notas', 'Notes')),
        sets: []
      };
      workout.exercises.push(exercise);
    }

    if (!exercise.notes) {
      const notes = textValue(getCell(row, 'Notas', 'Notes'));
      if (notes) exercise.notes = notes;
    }

    const weightRaw = getCell(row, 'Peso (kg)', 'Peso', 'Weight');
    const repsRaw = getCell(row, 'Repeticiones', 'Reps');
    const setNumber = numberValue(getCell(row, 'Serie', 'Set'));

    if (weightRaw !== '' || repsRaw !== '' || setNumber !== undefined) {
      const set: WorkoutSet = {
        id: `import-set-${workout.id}-${exercise.sets.length}`,
        weight: numberOrEmpty(weightRaw),
        reps: numberOrEmpty(repsRaw),
        completed: booleanValue(getCell(row, 'Completada', 'Completed'), true),
        isWarmup: booleanValue(getCell(row, 'Calentamiento', 'Warmup'), false) || undefined,
        rpe: numberValue(getCell(row, 'RPE'))
      };
      exercise.sets.push(set);
    }
  });

  return sortWorkoutsByDateDesc(Array.from(workouts.values()));
}

function parseRoutines(rows: Record<string, unknown>[]): RoutineTemplate[] {
  const routines = new Map<string, RoutineTemplate>();
  let anonymousIndex = 0;

  rows.forEach((rawRow) => {
    const row = normalizeRow(rawRow);
    const routineName = textValue(getCell(row, 'Rutina', 'Routine', 'Nombre'));
    const suppliedId = textValue(getCell(row, 'ID Rutina', 'Routine ID'));
    if (!routineName && !suppliedId) return;

    const key = suppliedId || `anon-${slug(routineName)}`;
    let routine = routines.get(key);

    if (!routine) {
      routine = {
        id: suppliedId || `import-routine-${slug(routineName)}-${anonymousIndex++}`,
        name: routineName || 'Rutina importada',
        subtitle: textValue(getCell(row, 'Subtítulo', 'Subtitle')) || 'Rutina importada',
        category: textValue(getCell(row, 'Categoría', 'Category')).toUpperCase() || 'PERSONALIZADO',
        estimatedMinutes: numberValue(getCell(row, 'Minutos estimados', 'Estimated minutes')) ?? 60,
        isCustom: booleanValue(getCell(row, 'Personalizada', 'Custom'), false),
        exercises: []
      };
      routines.set(key, routine);
    }

    const exerciseName = textValue(getCell(row, 'Ejercicio', 'Exercise'));
    if (!exerciseName) return;

    routine.exercises.push({
      name: exerciseName,
      category: muscleCategoryValue(getCell(row, 'Categoría muscular', 'Categoría')),
      targetSets: Math.max(1, numberValue(getCell(row, 'Series objetivo', 'Sets')) ?? 3),
      defaultReps: numberValue(getCell(row, 'Repeticiones', 'Reps')) ?? 10,
      defaultWeight: numberValue(getCell(row, 'Peso (kg)', 'Peso', 'Weight')) ?? 20,
      repsRange: textValue(getCell(row, 'Rango reps', 'Reps range')) || undefined,
      weightRange: textValue(getCell(row, 'Rango peso', 'Weight range')) || undefined
    });
  });

  return Array.from(routines.values());
}

function parseCustomExercises(rows: Record<string, unknown>[]): ExerciseDefinition[] {
  const result: ExerciseDefinition[] = [];

  rows.forEach((rawRow, index) => {
    const row = normalizeRow(rawRow);
    const name = textValue(getCell(row, 'Nombre', 'Name'));
    if (!name) return;

    result.push({
      id: textValue(getCell(row, 'ID')) || `import-custom-${slug(name)}-${index}`,
      name,
      category: muscleCategoryValue(getCell(row, 'Categoría', 'Category')),
      equipment: textValue(getCell(row, 'Equipo', 'Equipment')) || 'Personalizado',
      isCustom: true
    });
  });

  return result;
}

function parseWeightLogs(rows: Record<string, unknown>[]): WeightLogEntry[] {
  const result: WeightLogEntry[] = [];

  rows.forEach((rawRow, index) => {
    const row = normalizeRow(rawRow);
    const weight = numberValue(getCell(row, 'Peso (kg)', 'Peso', 'Weight'));
    const date = dateValue(getCell(row, 'Fecha', 'Date'));
    if (weight === undefined || !date) return;

    result.push({
      id: textValue(getCell(row, 'ID')) || `import-weight-${date}-${index}`,
      date,
      weight,
      bodyFat: numberValue(getCell(row, 'Grasa (%)', 'Grasa', 'Body fat')),
      notes: textValue(getCell(row, 'Notas', 'Notes')) || undefined
    });
  });

  return result.sort((a, b) => b.date.localeCompare(a.date));
}

function parseMeasurements(rows: Record<string, unknown>[]): BodyMeasurementEntry[] {
  return rows
    .map((rawRow, index) => {
      const row = normalizeRow(rawRow);
      const date = dateValue(getCell(row, 'Fecha', 'Date'));
      if (!date) return null;

      const entry: BodyMeasurementEntry = {
        id: textValue(getCell(row, 'ID')) || `import-measure-${date}-${index}`,
        date,
        notes: textValue(getCell(row, 'Notas', 'Notes')) || undefined
      };

      MEASUREMENT_COLUMNS.forEach(([label, key]) => {
        const value = numberValue(getCell(row, label, key));
        if (value !== undefined) entry[key] = value;
      });

      return entry;
    })
    .filter((entry): entry is BodyMeasurementEntry => entry !== null)
    .sort((a, b) => b.date.localeCompare(a.date));
}

function parseProfile(rows: Record<string, unknown>[]): UserProfile | undefined {
  if (rows.length === 0) return undefined;
  const row = normalizeRow(rows[0]);
  const name = textValue(getCell(row, 'Nombre', 'Name'));
  if (!name) return undefined;

  return {
    name,
    weeklyGoal: Math.max(1, numberValue(getCell(row, 'Objetivo semanal', 'Weekly goal')) ?? 3),
    targetWeight: numberValue(getCell(row, 'Peso objetivo (kg)', 'Peso objetivo', 'Target weight'))
  };
}

function findSheet(
  sheetNames: string[],
  ...aliases: string[]
): string | undefined {
  return sheetNames.find((name) =>
    aliases.some((alias) => normalize(name) === normalize(alias) || normalize(name).includes(normalize(alias)))
  );
}

function rowsFromSheet(XLSX: typeof import('xlsx'), sheet: import('xlsx').WorkSheet): Record<string, unknown>[] {
  return XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
    defval: '',
    raw: true
  });
}

function looksLikeWorkoutSheet(rows: Record<string, unknown>[]): boolean {
  if (rows.length === 0) return false;
  const keys = new Set(Object.keys(rows[0]).map(normalize));
  return (
    (keys.has('ejercicio') || keys.has('exercise')) &&
    (keys.has('fecha') || keys.has('date'))
  );
}

function parseLegacyJson(raw: unknown): ImportedData {
  const data = raw as Record<string, unknown>;

  if (Array.isArray(raw)) {
    return { history: sortWorkoutsByDateDesc(raw as WorkoutSession[]) };
  }

  const result: ImportedData = {};

  if (Array.isArray(data.history)) {
    result.history = sortWorkoutsByDateDesc(data.history as WorkoutSession[]);
  }
  if (Array.isArray(data.customExercises)) {
    result.customExercises = data.customExercises as ExerciseDefinition[];
  }
  if (Array.isArray(data.routineTemplates)) {
    result.routineTemplates = data.routineTemplates as RoutineTemplate[];
  }
  if (Array.isArray(data.weightLogs)) {
    result.weightLogs = data.weightLogs as WeightLogEntry[];
  }
  if (Array.isArray(data.bodyMeasurements)) {
    result.bodyMeasurements = data.bodyMeasurements as BodyMeasurementEntry[];
  }
  if (data.userProfile && typeof data.userProfile === 'object') {
    result.userProfile = data.userProfile as UserProfile;
  }

  return result;
}

export async function parseImportFile(file: File): Promise<ImportedData> {
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('El archivo es demasiado grande. El límite es de 10 MB.');
  }

  const lowerName = file.name.toLowerCase();

  if (lowerName.endsWith('.json') || file.type === 'application/json') {
    const parsed = JSON.parse(await file.text()) as unknown;
    const result = parseLegacyJson(parsed);
    if (
      !result.history &&
      !result.routineTemplates &&
      !result.customExercises &&
      !result.weightLogs &&
      !result.bodyMeasurements &&
      !result.userProfile
    ) {
      throw new Error('El archivo JSON no contiene datos reconocibles de FitUs.');
    }
    return result;
  }

  const XLSX = await import('xlsx');
  const isCsv = lowerName.endsWith('.csv') || file.type.includes('csv');

  let workbook: import('xlsx').WorkBook;
  if (isCsv) {
    // Leer el CSV como texto UTF-8 evita que SheetJS interprete mal los acentos
    const buffer = await file.arrayBuffer();
    let csvText: string;
    try {
      csvText = new TextDecoder('utf-8', { fatal: true }).decode(buffer);
    } catch {
      csvText = new TextDecoder('windows-1252').decode(buffer);
    }
    workbook = XLSX.read(csvText, { type: 'string', cellDates: true });
  } else {
    const buffer = await file.arrayBuffer();
    workbook = XLSX.read(buffer, { type: 'array', cellDates: true });
  }

  const sheetNames = workbook.SheetNames;

  const workoutsSheet = findSheet(sheetNames, 'Entrenamientos', 'Workouts');
  const routinesSheet = findSheet(sheetNames, 'Rutinas', 'Routines');
  const customSheet = findSheet(
    sheetNames,
    'Ejercicios personalizados',
    'Custom exercises',
    'Ejercicios'
  );
  const weightsSheet = findSheet(sheetNames, 'Pesajes', 'Peso', 'Weight logs');
  const measurementsSheet = findSheet(sheetNames, 'Medidas', 'Measurements');
  const profileSheet = findSheet(sheetNames, 'Perfil', 'Profile');

  const imported: ImportedData = {};

  if (workoutsSheet) {
    imported.history = parseWorkouts(rowsFromSheet(XLSX, workbook.Sheets[workoutsSheet]));
  }

  if (!workoutsSheet && sheetNames.length === 1) {
    const candidateRows = rowsFromSheet(XLSX, workbook.Sheets[sheetNames[0]]);
    if (looksLikeWorkoutSheet(candidateRows)) {
      imported.history = parseWorkouts(candidateRows);
    }
  }

  if (routinesSheet) {
    imported.routineTemplates = parseRoutines(rowsFromSheet(XLSX, workbook.Sheets[routinesSheet]));
  }
  if (customSheet) {
    imported.customExercises = parseCustomExercises(
      rowsFromSheet(XLSX, workbook.Sheets[customSheet])
    );
  }
  if (weightsSheet) {
    imported.weightLogs = parseWeightLogs(rowsFromSheet(XLSX, workbook.Sheets[weightsSheet]));
  }
  if (measurementsSheet) {
    imported.bodyMeasurements = parseMeasurements(
      rowsFromSheet(XLSX, workbook.Sheets[measurementsSheet])
    );
  }
  if (profileSheet) {
    imported.userProfile = parseProfile(rowsFromSheet(XLSX, workbook.Sheets[profileSheet]));
  }

  if (
    !imported.history &&
    !imported.routineTemplates &&
    !imported.customExercises &&
    !imported.weightLogs &&
    !imported.bodyMeasurements &&
    !imported.userProfile
  ) {
    throw new Error(
      'No se encontraron hojas o columnas reconocibles. Usa una plantilla exportada desde FitUs.'
    );
  }

  return imported;
}
