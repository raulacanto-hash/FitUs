import React, { useState } from 'react';
import { ActiveTab, RoutineTemplate, WorkoutExercise } from './types/workout';
import { useRestTimer } from './hooks/useRestTimer';
import { useWorkoutManager } from './hooks/useWorkoutManager';
import { useBodyMetrics } from './hooks/useBodyMetrics';
import { ThemeProvider, useTheme } from './context/ThemeContext';
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
import { ExerciseSelectorModal } from './components/modals/ExerciseSelectorModal';
import { CreateRoutineModal } from './components/modals/CreateRoutineModal';
import { EditWorkoutModal } from './components/modals/EditWorkoutModal';
import { Dumbbell, Sparkles } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('train');
  const [trainViewMode, setTrainViewMode] = useState<'routines' | 'detail' | 'active'>('routines');
  const [selectedRoutineForDetail, setSelectedRoutineForDetail] = useState<RoutineTemplate | null>(null);

  // Modal de detalle de ejercicio individual
  const [selectedExerciseForModal, setSelectedExerciseForModal] = useState<WorkoutExercise | null>(null);

  const [isExerciseModalOpen, setIsExerciseModalOpen] = useState(false);
  const [isCreateRoutineModalOpen, setIsCreateRoutineModalOpen] = useState(false);

  const timer = useRestTimer();
  const manager = useWorkoutManager();
  const { profile } = useBodyMetrics();
  const { isDark, accent } = useTheme();

  // Al completar una serie, iniciar automáticamente el descanso configurado
  const handleToggleSetWithTimer = (exerciseId: string, setId: string) => {
    manager.handleToggleSet(exerciseId, setId, () => {
      timer.startTimer(timer.initialDuration || 90);
    });
  };

  const handleStartRoutine = (routine: RoutineTemplate) => {
    manager.handleStartRoutine(routine);
    setSelectedRoutineForDetail(null);
    setTrainViewMode('active');
  };

  const handleViewRoutineDetails = (routine: RoutineTemplate) => {
    setSelectedRoutineForDetail(routine);
    setTrainViewMode('detail');
  };

  const handleStartFreeWorkout = () => {
    setTrainViewMode('active');
  };

  const handleViewAllHistory = () => {
    setActiveTab('history');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFinishWorkout = () => {
    const success = manager.handleFinishWorkout();
    if (success) {
      setTrainViewMode('routines');
      setActiveTab('history');
    }
  };

  const hasActiveSession = manager.currentWorkout.exercises.length > 0;

  return (
    <div className={`min-h-screen flex flex-col font-sans pb-24 antialiased transition-colors duration-200 ${
      isDark ? 'bg-zinc-950 text-zinc-100' : 'bg-zinc-50 text-zinc-900'
    }`}>
      {/* Header Superior con Glassmorphism, Timer y botón de tema */}
      <Header timer={timer} />

      {/* Contenedor Principal */}
      <main className="flex-1 max-w-lg w-full mx-auto px-4 pt-3">
        
        {/* PESTAÑA 1: TRAIN (ENTRENAR) */}
        {activeTab === 'train' && (
          <div className="space-y-3">
            {/* Banner de retorno a sesión activa si existe */}
            {hasActiveSession && trainViewMode !== 'active' && (
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
            {trainViewMode !== 'detail' && (
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
                onViewAllHistory={handleViewAllHistory}
                onStartRoutine={handleStartRoutine}
                onViewRoutineDetails={handleViewRoutineDetails}
                onStartFreeWorkout={handleStartFreeWorkout}
                onOpenCreateRoutine={() => setIsCreateRoutineModalOpen(true)}
                onDeleteRoutine={manager.handleDeleteRoutineTemplate}
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
          />
        )}

        {/* PESTAÑA 6: AJUSTES & PERSONALIZACIÓN */}
        {activeTab === 'settings' && (
          <SettingsView
            onExportData={manager.handleExportData}
            onImportData={manager.handleImportData}
            onResetAllData={manager.handleResetAllData}
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
        onClose={() => manager.setEditingWorkout(null)}
        onSave={manager.handleSaveEditWorkout}
        onUpdateWorkout={(updater) => {
          manager.setEditingWorkout((prev) => (prev ? updater(prev) : null));
        }}
        onOpenAddExercise={() => setIsExerciseModalOpen(true)}
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
      <BottomNav 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        hasActiveWorkoutSession={hasActiveSession}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <MainAppContent />
    </ThemeProvider>
  );
};

export default App;
