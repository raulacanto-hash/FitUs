import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowDownCircle,
  Ban,
  Bandage,
  BarChart2,
  Bell,
  CalendarCheck,
  CalendarDays,
  Calculator,
  ChevronRight,
  Check,
  Crosshair,
  Dumbbell,
  Flame,
  Layers,
  ListChecks,
  ListOrdered,
  PersonStanding,
  Repeat,
  Search,
  Shuffle,
  Sparkles,
  Target,
  Timer,
  TrendingDown,
  TrendingUp,
  Type,
  X
} from 'lucide-react';
import {
  FontScaleOption,
  MuscleCategory,
  RoutineTemplate,
  UserProfile,
  WorkoutSettings
} from '../../types/workout';
import {
  DELOAD_OPTIONS,
  DURATION_OPTIONS,
  EXPERIENCE_OPTIONS,
  FONT_SCALE_LABELS,
  FONT_SCALE_OPTIONS,
  GOAL_OPTIONS,
  REP_RANGE_OPTIONS,
  SET_RANGE_OPTIONS,
  VARIETY_OPTIONS
} from '../../data/workoutSettingsDefaults';
import { playRestTimerBeep } from '../../utils/audio';
import { useTheme } from '../../context/ThemeContext';
import { formatDuration } from '../../utils/duration';

interface WorkoutSettingsViewProps {
  settings: WorkoutSettings;
  profile: UserProfile;
  routines: RoutineTemplate[];
  onUpdateSettings: (updates: Partial<WorkoutSettings>) => void;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
  onBack: () => void;
}

interface PickerOption {
  label: string;
  value: string;
}

interface PickerConfig {
  title: string;
  options: PickerOption[];
  selected: string;
  onSelect: (value: string) => void;
}

const MUSCLE_OPTIONS: MuscleCategory[] = [
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

const boolLabel = (value: boolean) => (value ? 'Habilitado' : 'Deshabilitado');

const boolOptions: PickerOption[] = [
  { label: 'Habilitado', value: 'true' },
  { label: 'Deshabilitado', value: 'false' }
];

const SettingsRow: React.FC<{
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  label: string;
  value?: string;
  onClick: () => void;
}> = ({ icon: Icon, label, value, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-zinc-800/20 active:bg-zinc-800/30"
  >
    <Icon className="w-4 h-4 text-zinc-400 flex-shrink-0" />
    <span className="flex-1 text-sm font-medium leading-snug">{label}</span>
    {value && (
      <span className="text-xs text-zinc-500 max-w-[46%] truncate text-right">{value}</span>
    )}
    <ChevronRight className="w-4 h-4 text-zinc-600 flex-shrink-0" />
  </button>
);

const PickerSheet: React.FC<{
  config: PickerConfig;
  onClose: () => void;
}> = ({ config, onClose }) => {
  const { accent, isDark } = useTheme();

  return (
    <div
      className="fixed inset-0 z-50 bg-zinc-950/80 backdrop-blur-md flex items-end sm:items-center justify-center p-3 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className={`w-full max-w-sm rounded-3xl border shadow-2xl overflow-hidden ${
          isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900'
        }`}
      >
        <div className={`flex items-center justify-between px-4 py-3 border-b ${isDark ? 'border-zinc-800' : 'border-zinc-200'}`}>
          <h3 className="text-sm font-black">{config.title}</h3>
          <button
            type="button"
            onClick={onClose}
            className={`p-1 rounded-lg transition-colors ${
              isDark ? 'text-zinc-400 hover:text-white hover:bg-zinc-800' : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100'
            }`}
            aria-label="Cerrar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {config.options.map((option) => {
            const selected = option.value === config.selected;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  config.onSelect(option.value);
                  onClose();
                }}
                className={`w-full flex items-center justify-between gap-3 px-3 py-3 rounded-xl text-left text-xs font-semibold transition-colors ${
                  selected
                    ? isDark
                      ? 'bg-zinc-800 text-white'
                      : 'bg-zinc-100 text-zinc-900'
                    : isDark
                      ? 'text-zinc-300 hover:bg-zinc-800/60'
                      : 'text-zinc-700 hover:bg-zinc-100'
                }`}
              >
                <span>{option.label}</span>
                {selected && <Check className="w-4 h-4" style={{ color: accent.hex }} />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const MuscleSheet: React.FC<{
  title: string;
  selected: MuscleCategory[];
  onSave: (muscles: MuscleCategory[]) => void;
  onClose: () => void;
}> = ({ title, selected, onSave, onClose }) => {
  const { accent, isDark } = useTheme();
  const [draft, setDraft] = useState<MuscleCategory[]>(selected);

  const toggleMuscle = (muscle: MuscleCategory) => {
    setDraft((prev) =>
      prev.includes(muscle) ? prev.filter((item) => item !== muscle) : [...prev, muscle]
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950/80 backdrop-blur-md flex items-end sm:items-center justify-center p-3 animate-in fade-in duration-200">
      <div className={`w-full max-w-sm rounded-3xl border shadow-2xl overflow-hidden ${
        isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900'
      }`}>
        <div className={`flex items-center justify-between px-4 py-3 border-b ${isDark ? 'border-zinc-800' : 'border-zinc-200'}`}>
          <h3 className="text-sm font-black">{title}</h3>
          <button type="button" onClick={onClose} className="p-1 text-zinc-400 hover:text-white" aria-label="Cerrar">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-3 grid grid-cols-2 gap-2 max-h-[55vh] overflow-y-auto">
          {MUSCLE_OPTIONS.map((muscle) => {
            const active = draft.includes(muscle);
            return (
              <button
                key={muscle}
                type="button"
                onClick={() => toggleMuscle(muscle)}
                className={`px-3 py-2 rounded-xl border text-xs font-semibold transition-colors ${
                  active
                    ? isDark
                      ? 'bg-zinc-800 border-zinc-600 text-white'
                      : 'bg-zinc-100 border-zinc-400 text-zinc-900'
                    : isDark
                      ? 'bg-zinc-950/60 border-zinc-800 text-zinc-400'
                      : 'bg-zinc-50 border-zinc-200 text-zinc-600'
                }`}
                style={active ? { borderColor: accent.hex } : undefined}
              >
                {muscle}
              </button>
            );
          })}
        </div>
        <div className={`flex gap-2 p-3 border-t ${isDark ? 'border-zinc-800' : 'border-zinc-200'}`}>
          <button
            type="button"
            onClick={onClose}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold ${
              isDark ? 'bg-zinc-800 text-zinc-300' : 'bg-zinc-100 text-zinc-700'
            }`}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => {
              onSave(draft);
              onClose();
            }}
            style={{ backgroundColor: accent.hex }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-black ${accent.contrastText}`}
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

const InjurySheet: React.FC<{
  value: string;
  onSave: (value: string) => void;
  onClose: () => void;
}> = ({ value, onSave, onClose }) => {
  const { accent, isDark } = useTheme();
  const [draft, setDraft] = useState(value);

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950/80 backdrop-blur-md flex items-end sm:items-center justify-center p-3 animate-in fade-in duration-200">
      <div className={`w-full max-w-sm rounded-3xl border shadow-2xl p-4 space-y-3 ${
        isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900'
      }`}>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black">Lesiones o limitaciones</h3>
          <button type="button" onClick={onClose} className="p-1 text-zinc-400 hover:text-white" aria-label="Cerrar">
            <X className="w-4 h-4" />
          </button>
        </div>
        <textarea
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          rows={4}
          maxLength={200}
          placeholder="Ej. Molestia en el hombro derecho al press militar"
          className={`w-full rounded-xl p-3 text-xs border focus:outline-none resize-none ${
            isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
          }`}
          style={{ borderColor: draft ? accent.hex : undefined }}
        />
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold ${
              isDark ? 'bg-zinc-800 text-zinc-300' : 'bg-zinc-100 text-zinc-700'
            }`}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => {
              onSave(draft.trim());
              onClose();
            }}
            style={{ backgroundColor: accent.hex }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-black ${accent.contrastText}`}
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export const WorkoutSettingsView: React.FC<WorkoutSettingsViewProps> = ({
  settings,
  profile,
  routines,
  onUpdateSettings,
  onUpdateProfile,
  onBack
}) => {
  const { accent, isDark } = useTheme();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [picker, setPicker] = useState<PickerConfig | null>(null);
  const [musclePicker, setMusclePicker] = useState<'focused' | 'excluded' | null>(null);
  const [injuryOpen, setInjuryOpen] = useState(false);

  const normalizedQuery = query.trim().toLowerCase();
  const matches = (label: string) =>
    normalizedQuery.length === 0 || label.toLowerCase().includes(normalizedQuery);
  const sectionVisible = (labels: string[]) => labels.some(matches);

  const cardClass = isDark
    ? 'bg-zinc-900/70 border-zinc-800 divide-zinc-800/70'
    : 'bg-white border-zinc-200 shadow-sm divide-zinc-200';

  const sectionTitleClass = 'text-[11px] font-bold text-zinc-500 px-1';

  const activeRoutine = useMemo(
    () => routines.find((routine) => routine.id === settings.activeRoutineId) ?? routines[0],
    [routines, settings.activeRoutineId]
  );

  const openBooleanPicker = (
    title: string,
    value: boolean,
    onSelect: (value: boolean) => void
  ) => {
    setPicker({
      title,
      options: boolOptions,
      selected: String(value),
      onSelect: (selectedValue) => onSelect(selectedValue === 'true')
    });
  };

  const openStringPicker = (
    title: string,
    options: string[],
    value: string,
    onSelect: (value: string) => void
  ) => {
    setPicker({
      title,
      options: options.map((option) => ({ label: option, value: option })),
      selected: value,
      onSelect
    });
  };

  const muscleValue = (muscles: MuscleCategory[]) =>
    muscles.length === 0 ? 'Ninguno' : `${muscles.length} seleccionados`;

  const openFontScalePicker = (
    title: string,
    value: FontScaleOption,
    onSelect: (value: FontScaleOption) => void
  ) => {
    setPicker({
      title,
      options: FONT_SCALE_OPTIONS.map((option) => ({
        label: option.label,
        value: option.value
      })),
      selected: value,
      onSelect: (selected) => onSelect(selected as FontScaleOption)
    });
  };

  return (
    <div className={`space-y-4 animate-in fade-in duration-200 pt-[max(0.75rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))] ${isDark ? 'text-zinc-100' : 'text-zinc-900'}`}>
      <div className="flex items-center gap-2 pt-1">
        <button
          type="button"
          onClick={onBack}
          className={`p-1.5 rounded-xl transition-colors ${
            isDark ? 'hover:bg-zinc-900 text-zinc-300' : 'hover:bg-zinc-100 text-zinc-700'
          }`}
          aria-label="Volver"
        >
          <ArrowLeft className="w-5 h-5" style={{ color: accent.hex }} />
        </button>
        <h2 className="flex-1 text-center text-base font-black tracking-tight">
          Ajustes del entrenamiento
        </h2>
        <button
          type="button"
          onClick={() => {
            setSearchOpen((prev) => !prev);
            setQuery('');
          }}
          className={`p-1.5 rounded-xl transition-colors ${
            isDark ? 'hover:bg-zinc-900 text-zinc-300' : 'hover:bg-zinc-100 text-zinc-700'
          }`}
          aria-label="Buscar ajustes"
        >
          {searchOpen ? <X className="w-5 h-5" style={{ color: accent.hex }} /> : <Search className="w-5 h-5" style={{ color: accent.hex }} />}
        </button>
      </div>

      {searchOpen && (
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar ajuste..."
          autoFocus
          className={`w-full rounded-2xl p-2.5 text-xs border focus:outline-none ${
            isDark ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-zinc-200 text-zinc-900'
          }`}
          style={{ borderColor: accent.hex }}
        />
      )}

      {sectionVisible(['Rutina']) && (
        <section className="space-y-2">
          <h3 className={sectionTitleClass}>Rutina</h3>
          <div className={`rounded-3xl border overflow-hidden divide-y ${cardClass}`}>
            {matches('Rutina') && (
              <SettingsRow
                icon={Dumbbell}
                label="Rutina"
                value={activeRoutine?.name ?? 'Ninguna'}
                onClick={() =>
                  setPicker({
                    title: 'Selecciona tu rutina',
                    options: routines.map((routine) => ({ label: routine.name, value: routine.id })),
                    selected: activeRoutine?.id ?? '',
                    onSelect: (value) => onUpdateSettings({ activeRoutineId: value })
                  })
                }
              />
            )}
          </div>
        </section>
      )}

      {sectionVisible(['Objetivo', 'Objetivo Semanal']) && (
        <section className="space-y-2">
          <h3 className={sectionTitleClass}>Metas</h3>
          <div className={`rounded-3xl border overflow-hidden divide-y ${cardClass}`}>
            {matches('Objetivo') && (
              <SettingsRow
                icon={Target}
                label="Objetivo"
                value={settings.goal}
                onClick={() => openStringPicker('Objetivo', GOAL_OPTIONS, settings.goal, (value) => onUpdateSettings({ goal: value }))}
              />
            )}
            {matches('Objetivo Semanal') && (
              <SettingsRow
                icon={CalendarDays}
                label="Objetivo Semanal"
                value={`${profile.weeklyGoal || 3}`}
                onClick={() =>
                  setPicker({
                    title: 'Días de entrenamiento por semana',
                    options: Array.from({ length: 7 }, (_, index) => ({
                      label: `${index + 1} ${index === 0 ? 'día' : 'días'}`,
                      value: String(index + 1)
                    })),
                    selected: String(profile.weeklyGoal || 3),
                    onSelect: (value) => onUpdateProfile({ weeklyGoal: Number(value) })
                  })
                }
              />
            )}
          </div>
        </section>
      )}

      {sectionVisible(['Experiencia', 'Nivel de Variedad']) && (
        <section className="space-y-2">
          <h3 className={sectionTitleClass}>Estilo de entrenamiento</h3>
          <div className={`rounded-3xl border overflow-hidden divide-y ${cardClass}`}>
            {matches('Experiencia') && (
              <SettingsRow
                icon={BarChart2}
                label="Experiencia"
                value={settings.experience}
                onClick={() => openStringPicker('Experiencia', EXPERIENCE_OPTIONS, settings.experience, (value) => onUpdateSettings({ experience: value }))}
              />
            )}
            {matches('Nivel de Variedad') && (
              <SettingsRow
                icon={Shuffle}
                label="Nivel de Variedad"
                value={settings.variety}
                onClick={() => openStringPicker('Nivel de Variedad', VARIETY_OPTIONS, settings.variety, (value) => onUpdateSettings({ variety: value }))}
              />
            )}
          </div>
        </section>
      )}

      {sectionVisible([
        'Duración',
        'Número de Series',
        'Rangos de Repeticiones',
        'Progresión de repeticiones',
        'Períodos de Descarga',
        'Cambios en entrenamientos guardados',
        'Próximos Entrenamientos',
        'Ejercicios en cola'
      ]) && (
        <section className="space-y-2">
          <h3 className={sectionTitleClass}>Estructura</h3>
          <div className={`rounded-3xl border overflow-hidden divide-y ${cardClass}`}>
            {matches('Duración') && (
              <SettingsRow
                icon={Timer}
                label="Duración"
                value={formatDuration(settings.durationMinutes)}
                onClick={() =>
                  setPicker({
                    title: 'Duración del entrenamiento',
                    options: DURATION_OPTIONS.map((minutes) => ({
                      label: formatDuration(minutes),
                      value: String(minutes)
                    })),
                    selected: String(settings.durationMinutes),
                    onSelect: (value) => onUpdateSettings({ durationMinutes: Number(value) })
                  })
                }
              />
            )}
            {matches('Número de Series') && (
              <SettingsRow
                icon={Layers}
                label="Número de Series"
                value={settings.setRange}
                onClick={() => openStringPicker('Número de Series', SET_RANGE_OPTIONS, settings.setRange, (value) => onUpdateSettings({ setRange: value }))}
              />
            )}
            {matches('Rangos de Repeticiones') && (
              <SettingsRow
                icon={ListOrdered}
                label="Rangos de Repeticiones"
                value={settings.repRange}
                onClick={() => openStringPicker('Rangos de Repeticiones', REP_RANGE_OPTIONS, settings.repRange, (value) => onUpdateSettings({ repRange: value }))}
              />
            )}
            {matches('Progresión de repeticiones') && (
              <SettingsRow
                icon={TrendingUp}
                label="Progresión de repeticiones"
                value={boolLabel(settings.repProgression)}
                onClick={() => openBooleanPicker('Progresión de repeticiones', settings.repProgression, (value) => onUpdateSettings({ repProgression: value }))}
              />
            )}
            {matches('Períodos de Descarga') && (
              <SettingsRow
                icon={TrendingDown}
                label="Períodos de Descarga"
                value={settings.deload}
                onClick={() => openStringPicker('Períodos de Descarga', DELOAD_OPTIONS, settings.deload, (value) => onUpdateSettings({ deload: value }))}
              />
            )}
            {matches('Cambios en entrenamientos guardados') && (
              <SettingsRow
                icon={Sparkles}
                label="Cambios en entrenamientos guardados"
                value={boolLabel(settings.updateSavedWorkouts)}
                onClick={() => openBooleanPicker('Cambios en entrenamientos guardados', settings.updateSavedWorkouts, (value) => onUpdateSettings({ updateSavedWorkouts: value }))}
              />
            )}
            {matches('Próximos Entrenamientos') && (
              <SettingsRow
                icon={CalendarCheck}
                label="Próximos Entrenamientos"
                value={boolLabel(settings.upcomingWorkouts)}
                onClick={() => openBooleanPicker('Próximos Entrenamientos', settings.upcomingWorkouts, (value) => onUpdateSettings({ upcomingWorkouts: value }))}
              />
            )}
            {matches('Ejercicios en cola') && (
              <SettingsRow
                icon={ListChecks}
                label="Ejercicios en cola"
                value={boolLabel(settings.queueEnabled)}
                onClick={() => openBooleanPicker('Ejercicios en cola', settings.queueEnabled, (value) => onUpdateSettings({ queueEnabled: value }))}
              />
            )}
          </div>
        </section>
      )}

      {sectionVisible(['Músculos Enfocados', 'Músculos Excluidos', 'Lesiones']) && (
        <section className="space-y-2">
          <h3 className={sectionTitleClass}>Músculos</h3>
          <div className={`rounded-3xl border overflow-hidden divide-y ${cardClass}`}>
            {matches('Músculos Enfocados') && (
              <SettingsRow
                icon={Crosshair}
                label="Músculos Enfocados"
                value={muscleValue(settings.focusedMuscles)}
                onClick={() => setMusclePicker('focused')}
              />
            )}
            {matches('Músculos Excluidos') && (
              <SettingsRow
                icon={Ban}
                label="Músculos Excluidos"
                value={muscleValue(settings.excludedMuscles)}
                onClick={() => setMusclePicker('excluded')}
              />
            )}
            {matches('Lesiones') && (
              <SettingsRow
                icon={Bandage}
                label="Lesiones"
                value={settings.injuries || 'Ninguna'}
                onClick={() => setInjuryOpen(true)}
              />
            )}
          </div>
        </section>
      )}

      {sectionVisible(['Calentamiento', 'Estiramiento', 'Superseries', 'Dropsets', 'Sets de calentamiento']) && (
        <section className="space-y-2">
          <h3 className={sectionTitleClass}>Opcional</h3>
          <div className={`rounded-3xl border overflow-hidden divide-y ${cardClass}`}>
            {matches('Calentamiento') && (
              <SettingsRow
                icon={Flame}
                label="Calentamiento"
                value={boolLabel(settings.warmup)}
                onClick={() => openBooleanPicker('Calentamiento', settings.warmup, (value) => onUpdateSettings({ warmup: value }))}
              />
            )}
            {matches('Estiramiento') && (
              <SettingsRow
                icon={PersonStanding}
                label="Estiramiento"
                value={boolLabel(settings.stretching)}
                onClick={() => openBooleanPicker('Estiramiento', settings.stretching, (value) => onUpdateSettings({ stretching: value }))}
              />
            )}
            {matches('Superseries') && (
              <SettingsRow
                icon={Repeat}
                label="Superseries"
                value={boolLabel(settings.supersets)}
                onClick={() => openBooleanPicker('Superseries', settings.supersets, (value) => onUpdateSettings({ supersets: value }))}
              />
            )}
            {matches('Dropsets') && (
              <SettingsRow
                icon={ArrowDownCircle}
                label="Dropsets"
                value={boolLabel(settings.dropsets)}
                onClick={() => openBooleanPicker('Dropsets', settings.dropsets, (value) => onUpdateSettings({ dropsets: value }))}
              />
            )}
            {matches('Sets de calentamiento') && (
              <SettingsRow
                icon={Flame}
                label="Sets de calentamiento"
                value={boolLabel(settings.warmupSets)}
                onClick={() => openBooleanPicker('Sets de calentamiento', settings.warmupSets, (value) => onUpdateSettings({ warmupSets: value }))}
              />
            )}
          </div>
        </section>
      )}

      {sectionVisible([
        'Tamaño de letra de carga y reps',
        'Tamaño del temporizador de descanso',
        'Probar campana de descanso'
      ]) && (
        <section className="space-y-2">
          <h3 className={sectionTitleClass}>Pantalla de ejercicio</h3>
          <div className={`rounded-3xl border overflow-hidden divide-y ${cardClass}`}>
            {matches('Tamaño de letra de carga y reps') && (
              <SettingsRow
                icon={Type}
                label="Tamaño de letra de carga y reps"
                value={FONT_SCALE_LABELS[settings.inputFontScale]}
                onClick={() =>
                  openFontScalePicker(
                    'Tamaño de letra de carga y reps',
                    settings.inputFontScale,
                    (value) => onUpdateSettings({ inputFontScale: value })
                  )
                }
              />
            )}
            {matches('Tamaño del temporizador de descanso') && (
              <SettingsRow
                icon={Timer}
                label="Tamaño del temporizador de descanso"
                value={FONT_SCALE_LABELS[settings.restTimerFontScale]}
                onClick={() =>
                  openFontScalePicker(
                    'Tamaño del temporizador de descanso',
                    settings.restTimerFontScale,
                    (value) => onUpdateSettings({ restTimerFontScale: value })
                  )
                }
              />
            )}
            {matches('Probar campana de descanso') && (
              <SettingsRow
                icon={Bell}
                label="Probar campana de descanso"
                value="Reproducir"
                onClick={playRestTimerBeep}
              />
            )}
          </div>
        </section>
      )}

      {sectionVisible(['Tiempo de descanso', 'Calculadora de discos']) && (
        <section className="space-y-2">
          <h3 className={sectionTitleClass}>Herramientas</h3>
          <div className={`rounded-3xl border overflow-hidden divide-y ${cardClass}`}>
            {matches('Tiempo de descanso') && (
              <SettingsRow
                icon={Timer}
                label="Tiempo de descanso"
                value={boolLabel(settings.restTimer)}
                onClick={() => openBooleanPicker('Tiempo de descanso', settings.restTimer, (value) => onUpdateSettings({ restTimer: value }))}
              />
            )}
            {matches('Calculadora de discos') && (
              <SettingsRow
                icon={Calculator}
                label="Calculadora de discos"
                value={boolLabel(settings.plateCalculator)}
                onClick={() => openBooleanPicker('Calculadora de discos', settings.plateCalculator, (value) => onUpdateSettings({ plateCalculator: value }))}
              />
            )}
          </div>
        </section>
      )}

      {normalizedQuery.length > 0 &&
        !sectionVisible([
          'Rutina',
          'Objetivo',
          'Objetivo Semanal',
          'Experiencia',
          'Nivel de Variedad',
          'Duración',
          'Número de Series',
          'Rangos de Repeticiones',
          'Progresión de repeticiones',
          'Períodos de Descarga',
          'Cambios en entrenamientos guardados',
          'Próximos Entrenamientos',
          'Ejercicios en cola',
          'Músculos Enfocados',
          'Músculos Excluidos',
          'Lesiones',
          'Calentamiento',
          'Estiramiento',
          'Superseries',
          'Dropsets',
          'Sets de calentamiento',
          'Tamaño de letra de carga y reps',
          'Tamaño del temporizador de descanso',
          'Probar campana de descanso',
          'Tiempo de descanso',
          'Calculadora de discos'
        ]) && (
          <div className={`text-center py-10 px-4 border border-dashed rounded-3xl ${
            isDark ? 'border-zinc-800 text-zinc-500' : 'border-zinc-300 text-zinc-400'
          }`}>
            <p className="text-xs font-bold">Sin ajustes que coincidan</p>
            <p className="text-[10px] mt-1">Prueba con otra palabra.</p>
          </div>
        )}

      {picker && <PickerSheet config={picker} onClose={() => setPicker(null)} />}

      {musclePicker && (
        <MuscleSheet
          title={musclePicker === 'focused' ? 'Músculos Enfocados' : 'Músculos Excluidos'}
          selected={musclePicker === 'focused' ? settings.focusedMuscles : settings.excludedMuscles}
          onSave={(muscles) =>
            onUpdateSettings(
              musclePicker === 'focused'
                ? { focusedMuscles: muscles }
                : { excludedMuscles: muscles }
            )
          }
          onClose={() => setMusclePicker(null)}
        />
      )}

      {injuryOpen && (
        <InjurySheet
          value={settings.injuries}
          onSave={(value) => onUpdateSettings({ injuries: value })}
          onClose={() => setInjuryOpen(false)}
        />
      )}
    </div>
  );
};
