import React, { useState } from 'react';
import { ActiveTab } from './types/workout';
import { useRestTimer } from './hooks/useRestTimer';
import { useWorkoutManager } from './hooks/useWorkoutManager';
import { Header } from './components/layout/Header';
import { BottomNav } from './components/layout/BottomNav';
import { ActiveWorkoutView } from './components/active/ActiveWorkoutView';
import { HistoryView } from './components/history/HistoryView';
import { StatsView } from './components/stats/StatsView';
import { SettingsView } from './components/settings/SettingsView';
import { ExerciseSelectorModal } from './components/modals/ExerciseSelectorModal';
import { EditWorkoutModal } from './components/modals/EditWorkoutModal';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('active');
  const [isExerciseModalOpen, setIsExerciseModalOpen] = useState(false);

  const timer = useRestTimer();
  const manager = useWorkoutManager();

  // Al completar una serie, iniciar automáticamente el descanso configurado
  const handleToggleSetWithTimer = (exerciseId: string, setId: string) => {
    manager.handleToggleSet(exerciseId, setId, () => {
      timer.startTimer(timer.initialDuration || 90);
    });
  };

  const handleFinishWorkout = () => {
    const success = manager.handleFinishWorkout();
    if (success) {
      setActiveTab('history');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans pb-24 antialiased selection:bg-emerald-500 selection:text-zinc-950">
      {/* Header Superior con Glassmorphism y Temporizador */}
      <Header timer={timer} />

      {/* Contenedor Principal */}
      <main className="flex-1 max-w-lg w-full mx-auto px-4 pt-4">
        {activeTab === 'active' && (
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
          />
        )}

        {activeTab === 'history' && (
          <HistoryView
            history={manager.history}
            onEditWorkout={manager.handleStartEditWorkout}
            onDeleteWorkout={manager.handleDeleteWorkout}
          />
        )}

        {activeTab === 'stats' && (
          <StatsView
            history={manager.history}
            allUsedExerciseNames={manager.allUsedExerciseNames}
          />
        )}

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

      {/* Barra de Navegación Inferior Móvil */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default App;
