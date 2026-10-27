import React, { useEffect, useRef, useState } from 'react';
import { ActiveTab, RoutineTemplate, WorkoutExercise } from './types/workout';
import { useRestTimer } from './hooks/useRestTimer';
import { useWorkoutManager } from './hooks/useWorkoutManager';
import { useBodyMetrics } from './hooks/useBodyMetrics';
import { useWorkoutSettings } from './hooks/useWorkoutSettings';
import { INITIAL_USER_PROFILE } from './data/initialBodyData';
import { exportToExcel, exportWorkoutsCsv, parseImportFile } from './utils/spreadsheet';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { CloudSyncProvider, useCloudSync } from './context/CloudSyncContext';
import { CloudGate } from './components/cloud/CloudGate';
import { Header } from './components/layout/Header';
import { BottomNav } from './components/layout/BottomNav';
import { RoutinesHub } from './components/routines/RoutinesHub';
import { RoutineDetailView } from './components/routines/RoutineDetailView';
import { LibraryView } from './components/library/LibraryView';
import { ActiveWorkoutView } from './components/active/ActiveWorkoutView';
import { ExerciseDetailModal } from './components/active/ExerciseDetailModal';
import { HistoryView } from './components/history/HistoryView';
import { StatsView } from './components/stats/StatsView';
import { BodyTrackerView } from './components/body/BodyTrackerView';
import { SettingsView } from './components/settings/SettingsView';
import { WorkoutSettingsView } from './components/workout-settings/WorkoutSettingsView';
import { ProfileModal } from './components/profile/ProfileModal';
import { ExerciseSelectorModal } from './components/modals/ExerciseSelectorModal';
import { CreateRoutineModal } from './components/modals/CreateRoutineModal';
import { EditWorkoutModal } from './components/modals/EditWorkoutModal';
import { Dumbbell, Sparkles, CloudOff } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('train');
  const [trainViewMode, setTrainViewMode] = useState<'routines' | 'detail' | 'active' | 'workoutSettings'>('routines');
  const [selectedRoutineForDetail, setSelectedRoutineForDetail] = useState<RoutineTemplate | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Modal de detalle de ejercicio individual
  const [selectedExerciseForModal, setSelectedExerciseForModal] = useState<WorkoutExercise | null>(null);

  const [isExerciseModalOpen, setIsExerciseModalOpen] = useState(false);
  const [isCreateRoutineModalOpen, setIsCreateRoutineModalOpen] = useState(false);

  const timer = useRestTimer();
  const manager = useWorkoutManager();
  const body = useBodyMetrics();
  const workoutSettings = useWorkoutSettings();
  const { profile } = body;
  const { isDark, accent } = useTheme();
  const cloud = useCloudSync();
  const prefilledProfileUidRef = useRef<string | null>(null);

  // Al completar una serie, iniciar automáticamente el descanso configurado
  const handleToggleSetWithTimer = (exerciseId: string, setId: string) => {
    manager.handleToggleSet(exerciseId, setId, () => {
      if (workoutSettings.settings.restTimer) {
        timer.startTimer(timer.initialDuration || 90);
      }
    });
  };

  // Si el perfil sigue con el nombre de ejemplo, usar el nombre de Google
  useEffect(() => {
    const googleName = cloud.user?.displayName?.trim();
    if (!googleName || !cloud.user) return;
    if (prefilledProfileUidRef.current === cloud.user.uid) return;
    if (profile.name.trim() === '' || profile.name === INITIAL_USER_PROFILE.name) {
      prefilledProfileUidRef.current = cloud.user.uid;
      body.updateProfile({ name: googleName });
    }
  }, [body, cloud.user, profile.name]);

  const handleStartRoutine = (routine: RoutineTemplate) => {
    if (workoutSettings.settings.activeRoutineId !== routine.id) {
      workoutSettings.updateSettings({ activeRoutineId: routine.id });
    }
    manager.handleStartRoutine(routine);
    setSelectedRoutineForDetail(null);
    setTrainViewMode('active');
  };

  const handleViewRoutineDetails = (routine: RoutineTemplate) => {
    setSelectedRoutineForDetail(routine);
    setTrainViewMode('detail');
  };

  const handleStartFreeWorkout = () => {
    if (!manager.currentWorkout.startTime && manager.currentWorkout.exercises.length === 0) {
      manager.handleStartEmptyWorkout();
    }
    setTrainViewMode('active');
  };

  const handleViewAllHistory = () => {
    setActiveTab('history');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetAllData = () => {
    if (manager.handleResetAllData()) {
      body.resetBodyMetrics();
    }
  };

  const buildExportData = () => ({
    history: manager.history,
    routineTemplates: manager.routineTemplates,
    customExercises: manager.customExercises,
    weightLogs: body.weightLogs,
    bodyMeasurements: body.measurements,
    userProfile: profile
  });

  const handleExportExcel = async () => {
    try {
      await exportToExcel(buildExportData());
    } catch (error) {
      console.error('Error al exportar a Excel:', error);
      alert('No se pudo generar el archivo Excel. Inténtalo de nuevo.');
    }
  };

  const handleExportCsv = async () => {
    try {
      await exportWorkoutsCsv(manager.history);
    } catch (error) {
      console.error('Error al exportar a CSV:', error);
      alert('No se pudo generar el archivo CSV. Inténtalo de nuevo.');
    }
  };

  const handleImportData = async (file: File) => {
    try {
      const imported = await parseImportFile(file);
      manager.mergeImportedWorkoutData(imported);
      body.mergeImportedBodyData(imported);

      const parts: string[] = [];
      const countLabel = (count: number, singular: string, plural: string) =>
        `${count} ${count === 1 ? singular : plural}`;

      if (imported.history?.length) {
        parts.push(countLabel(imported.history.length, 'entrenamiento', 'entrenamientos'));
      }
      if (imported.routineTemplates?.length) {
        parts.push(countLabel(imported.routineTemplates.length, 'rutina', 'rutinas'));
      }
      if (imported.customExercises?.length) {
        parts.push(
          countLabel(
            imported.customExercises.length,
            'ejercicio personalizado',
            'ejercicios personalizados'
          )
        );
      }
      if (imported.weightLogs?.length) {
        parts.push(countLabel(imported.weightLogs.length, 'pesaje', 'pesajes'));
      }
      if (imported.bodyMeasurements?.length) {
        parts.push(countLabel(imported.bodyMeasurements.length, 'medida', 'medidas'));
      }
      if (imported.userProfile) {
        parts.push('perfil');
      }

      alert(
        parts.length > 0
          ? `Importación completada: ${parts.join(', ')}. Los datos se combinaron con los existentes.`
          : 'El archivo no tenía datos nuevos para importar.'
      );
    } catch (error) {
      console.error('Error al importar la copia:', error);
      alert(
        error instanceof Error
          ? error.message
          : 'No se pudo importar el archivo. Revisa que sea una copia válida de FitUs.'
      );
    }
  };

  const handleFinishWorkout = () => {
    const success = manager.handleFinishWorkout();
    if (success) {
      setTrainViewMode('routines');
      setActiveTab('history');
    }
  };

  const hasActiveSession =
    Boolean(manager.currentWorkout.startTime) ||
    manager.currentWorkout.exercises.some((exercise) =>
      exercise.sets.some((set) => set.completed)
    );

  const isNewWorkout = Boolean(
    manager.editingWorkout &&
      !manager.history.some((workout) => workout.id === manager.editingWorkout?.id)
  );

  const isWorkoutSettingsView =
    activeTab === 'train' && trainViewMode === 'workoutSettings';

  return (
    <div className={`min-h-screen flex flex-col font-sans antialiased transition-colors duration-200 ${
      isWorkoutSettingsView ? 'pb-6' : 'pb-24'
    } ${isDark ? 'bg-zinc-950 text-zinc-100' : 'bg-zinc-50 text-zinc-900'}`}>
      {/* Header Superior con Glassmorphism, Timer y botón de tema */}
      {!isWorkoutSettingsView && <Header timer={timer} />}

      {/* Contenedor Principal */}
      <main className="flex-1 max-w-lg w-full mx-auto px-4 pt-3">
        {cloud.configured && !cloud.user && (
          <div className={`mb-3 p-2.5 rounded-2xl border flex items-center justify-between gap-2 ${
            isDark
              ? 'bg-amber-950/20 border-amber-500/25'
              : 'bg-amber-50 border-amber-300'
          }`}>
            <div className="flex items-center gap-2 min-w-0">
              <CloudOff className="w-4 h-4 text-amber-500 flex-shrink-0" />
              <p className={`text-[10px] leading-snug ${isDark ? 'text-amber-200/80' : 'text-amber-800'}`}>
                Modo local: tu historial solo está en este navegador.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('settings')}
              className="text-[10px] font-black px-2.5 py-1.5 rounded-xl bg-amber-500/15 text-amber-500 hover:bg-amber-500/25 transition-colors flex-shrink-0"
            >
              Activar respaldo
            </button>
          </div>
        )}

        {cloud.user && cloud.status === 'error' && (
          <div className={`mb-3 p-2.5 rounded-2xl border flex items-center justify-between gap-2 ${
            isDark
              ? 'bg-red-950/20 border-red-500/25'
              : 'bg-red-50 border-red-300'
          }`}>
            <div className="flex items-center gap-2 min-w-0">
              <CloudOff className="w-4 h-4 text-red-500 flex-shrink-0" />
              <p className={`text-[10px] leading-snug ${isDark ? 'text-red-200/80' : 'text-red-800'}`}>
                No se pudo sincronizar. Tus cambios siguen guardados en este dispositivo.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('settings')}
              className="text-[10px] font-black px-2.5 py-1.5 rounded-xl bg-red-500/15 text-red-500 hover:bg-red-500/25 transition-colors flex-shrink-0"
            >
              Ver estado
            </button>
          </div>
        )}

        {/* PESTAÑA 1: TRAIN (ENTRENAR) */}
        {activeTab === 'train' && (
          <div className="space-y-3">
            {/* Banner de retorno a sesión activa si existe */}
            {hasActiveSession && trainViewMode !== 'active' && trainViewMode !== 'workoutSettings' && (
              <div 
                className={`p-3 rounded-2xl border flex items-center justify-between shadow-lg ${
                  isDark ? 'bg-zinc-900/90 border-zinc-800' : 'bg-white border-zinc-200'
                }`}
                style={{ borderColor: `${accent.hex}40` }}
              >
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full animate-ping" style={{ backgroundColor: accent.hex }} />
                  <span className="text-xs font-bold truncate max-w-[200px]">
                    En curso: {manager.currentWorkout.routineName}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setTrainViewMode('active')}
                  style={{ backgroundColor: accent.hex }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1 active:scale-95 transition-all ${accent.contrastText}`}
                >
                  <Dumbbell className="w-3.5 h-3.5" /> Continuar
                </button>
              </div>
            )}

            {/* Alternador de Vista si estamos en Rutinas o Activo */}
            {(trainViewMode === 'routines' || trainViewMode === 'active') && (
              <div className={`flex rounded-2xl p-1 mb-2 border ${
                isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'
              }`}>
                <button
                  type="button"
                  onClick={() => setTrainViewMode('routines')}
                  className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    trainViewMode === 'routines'
                      ? isDark ? 'bg-zinc-800 text-white shadow-sm' : 'bg-zinc-100 text-zinc-900 shadow-sm font-black'
                      : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-white'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" style={{ color: accent.hex }} /> Rutinas
                </button>
                <button
                  type="button"
                  onClick={() => setTrainViewMode('active')}
                  className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    trainViewMode === 'active'
                      ? isDark ? 'bg-zinc-800 text-white shadow-sm' : 'bg-zinc-100 text-zinc-900 shadow-sm font-black'
                      : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-white'
                  }`}
                >
                  <Dumbbell className="w-3.5 h-3.5" style={{ color: accent.hex }} /> Sesión Activa
                </button>
              </div>
            )}

            {/* Vista 1A: Hub de Rutinas */}
            {trainViewMode === 'routines' && (
              <RoutinesHub
                profile={profile}
                completedThisWeek={manager.completedThisWeek}
                routines={manager.routineTemplates}
                recentWorkouts={manager.history}
                activeRoutineId={workoutSettings.settings.activeRoutineId}
                onViewAllHistory={handleViewAllHistory}
                onStartRoutine={handleStartRoutine}
                onViewRoutineDetails={handleViewRoutineDetails}
                onStartFreeWorkout={handleStartFreeWorkout}
                onOpenCreateRoutine={() => setIsCreateRoutineModalOpen(true)}
                onDeleteRoutine={manager.handleDeleteRoutineTemplate}
                onOpenProfile={() => setIsProfileModalOpen(true)}
                onOpenWorkoutSettings={() => setTrainViewMode('workoutSettings')}
              />
            )}

            {/* Vista 1B: Detalle de Rutina (Screenshot 1) */}
            {trainViewMode === 'detail' && selectedRoutineForDetail && (
              <RoutineDetailView
                routine={selectedRoutineForDetail}
                onBack={() => setTrainViewMode('routines')}
                onStartRoutine={handleStartRoutine}
                onAddExerciseClick={() => setIsExerciseModalOpen(true)}
              />
            )}

            {/* Vista 1C: Sesión de Entrenamiento Activa */}
            {trainViewMode === 'active' && (
              <ActiveWorkoutView
                currentWorkout={manager.currentWorkout}
                timer={timer}
                onUpdateRoutineName={manager.handleUpdateRoutineName}
                onToggleSet={handleToggleSetWithTimer}
                onUpdateSet={manager.handleUpdateSet}
                onAddSet={manager.handleAddSet}
                onRemoveSet={manager.handleRemoveSet}
                onRemoveExercise={manager.handleRemoveExercise}
                onUpdateNotes={manager.handleUpdateNotes}
                onOpenExerciseModal={() => setIsExerciseModalOpen(true)}
                onFinishWorkout={handleFinishWorkout}
                onSaveAsRoutine={manager.handleSaveCurrentAsRoutine}
                onBackToRoutines={() => setTrainViewMode('routines')}
                onDiscardWorkout={manager.handleDiscardWorkout}
              />
            )}

            {/* Vista 1D: Ajustes del entrenamiento */}
            {trainViewMode === 'workoutSettings' && (
              <WorkoutSettingsView
                settings={workoutSettings.settings}
                profile={profile}
                routines={manager.routineTemplates}
                onUpdateSettings={workoutSettings.updateSettings}
                onUpdateProfile={body.updateProfile}
                onBack={() => setTrainViewMode('routines')}
              />
            )}
          </div>
        )}

        {/* PESTAÑA 2: BIBLIOTECA (Screenshot 2) */}
        {activeTab === 'library' && (
          <LibraryView
            routines={manager.routineTemplates}
            exerciseList={manager.fullExerciseList}
            onSelectRoutine={(routine) => {
              setSelectedRoutineForDetail(routine);
              setActiveTab('train');
              setTrainViewMode('detail');
            }}
            onOpenCreateRoutine={() => setIsCreateRoutineModalOpen(true)}
            onOpenExerciseModal={() => setIsExerciseModalOpen(true)}
          />
        )}

        {/* PESTAÑA 3: MÉTRICAS DE FUERZA Y VOLUMEN */}
        {activeTab === 'progress' && (
          <StatsView history={manager.history} />
        )}

        {/* PESTAÑA 4: SEGUIMIENTO DE PESO Y MEDIDAS CORPORALES */}
        {activeTab === 'body' && (
          <BodyTrackerView />
        )}

        {/* PESTAÑA 5: HISTORIAL DE ENTRENAMIENTOS PASADOS */}
        {activeTab === 'history' && (
          <HistoryView
            history={manager.history}
            onEditWorkout={manager.handleStartEditWorkout}
            onDeleteWorkout={manager.handleDeleteWorkout}
            onAddPastWorkout={manager.handleStartNewPastWorkout}
          />
        )}

        {/* PESTAÑA 6: AJUSTES & PERSONALIZACIÓN */}
        {activeTab === 'settings' && (
          <SettingsView
            profile={profile}
            onOpenProfile={() => setIsProfileModalOpen(true)}
            onExportExcel={handleExportExcel}
            onExportCsv={handleExportCsv}
            onImportData={handleImportData}
            onResetAllData={handleResetAllData}
          />
        )}
      </main>

      {/* Modal de Catálogo y Creación de Ejercicios */}
      <ExerciseSelectorModal
        isOpen={isExerciseModalOpen}
        onClose={() => setIsExerciseModalOpen(false)}
        exerciseList={manager.fullExerciseList}
        onSelectExercise={manager.handleSelectExerciseFromDb}
        onCreateCustomExercise={manager.handleCreateCustomExercise}
      />

      {/* Modal para Diseñar Nueva Plantilla de Rutina */}
      <CreateRoutineModal
        isOpen={isCreateRoutineModalOpen}
        onClose={() => setIsCreateRoutineModalOpen(false)}
        exerciseList={manager.fullExerciseList}
        onSaveRoutine={manager.handleCreateRoutineTemplate}
      />

      {/* Modal de Edición del Historial */}
      <EditWorkoutModal
        editingWorkout={manager.editingWorkout}
        isNewWorkout={isNewWorkout}
        onClose={() => manager.setEditingWorkout(null)}
        onSave={manager.handleSaveEditWorkout}
        onUpdateWorkout={(updater) => {
          manager.setEditingWorkout((prev) => (prev ? updater(prev) : null));
        }}
        onOpenAddExercise={() => setIsExerciseModalOpen(true)}
      />

      {/* Modal de perfil de usuario */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        profile={profile}
        onClose={() => setIsProfileModalOpen(false)}
        onSave={body.updateProfile}
      />

      {/* Modal de Registro Detallado de Ejercicio (Screenshot 3) */}
      <ExerciseDetailModal
        exercise={selectedExerciseForModal}
        onClose={() => setSelectedExerciseForModal(null)}
        onUpdateExercise={(updated) => {
          setSelectedExerciseForModal(updated);
          manager.handleUpdateNotes(updated.id, updated.notes);
        }}
        onStartOrSave={() => setSelectedExerciseForModal(null)}
      />

      {/* Barra de Navegación Inferior Móvil */}
      {!isWorkoutSettingsView && (
        <BottomNav 
          activeTab={activeTab} 
          onTabChange={setActiveTab}
          hasActiveWorkoutSession={hasActiveSession}
        />
      )}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <CloudSyncProvider>
        <CloudGate>
          <MainAppContent />
        </CloudGate>
      </CloudSyncProvider>
    </ThemeProvider>
  );
};

export default App;
