import React, { useEffect, useState } from 'react';
import { Check, Minus, Plus, Target, User, X } from 'lucide-react';
import { UserProfile } from '../../types/workout';
import { useTheme } from '../../context/ThemeContext';

interface ProfileModalProps {
  isOpen: boolean;
  profile: UserProfile;
  onClose: () => void;
  onSave: (updates: Partial<UserProfile>) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  profile,
  onClose,
  onSave
}) => {
  const { accent, isDark } = useTheme();
  const [name, setName] = useState(profile.name);
  const [weeklyGoal, setWeeklyGoal] = useState(profile.weeklyGoal || 3);
  const [targetWeight, setTargetWeight] = useState(
    profile.targetWeight !== undefined ? String(profile.targetWeight) : ''
  );

  useEffect(() => {
    if (!isOpen) return;
    setName(profile.name);
    setWeeklyGoal(profile.weeklyGoal || 3);
    setTargetWeight(profile.targetWeight !== undefined ? String(profile.targetWeight) : '');
  }, [isOpen, profile]);

  if (!isOpen) return null;

  const trimmedName = name.trim();
  const initial = trimmedName.charAt(0).toUpperCase() || '?';

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!trimmedName) return;

    const parsedTarget = targetWeight.trim() === '' ? undefined : Number(targetWeight);
    onSave({
      name: trimmedName,
      weeklyGoal,
      targetWeight:
        parsedTarget === undefined || Number.isNaN(parsedTarget) ? undefined : parsedTarget
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950/80 backdrop-blur-md flex items-center justify-center p-3 animate-in fade-in duration-200">
      <form
        onSubmit={handleSubmit}
        className={`border rounded-3xl max-w-sm w-full max-h-[90vh] flex flex-col shadow-2xl p-4 space-y-4 ${
          isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900'
        }`}
      >
        <div className={`flex justify-between items-center border-b pb-2.5 ${isDark ? 'border-zinc-800' : 'border-zinc-200'}`}>
          <h3 className="font-bold text-sm flex items-center gap-2">
            <User className="w-4 h-4" style={{ color: accent.hex }} />
            Perfil de usuario
          </h3>
          <button
            type="button"
            onClick={onClose}
            className={`p-1 rounded-lg transition-colors ${
              isDark ? 'text-zinc-400 hover:text-white hover:bg-zinc-800' : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100'
            }`}
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-purple-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-purple-600/30 flex-shrink-0">
            {initial}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-black truncate">{trimmedName || 'Tu nombre'}</p>
            <p className="text-[10px] text-zinc-500">
              Así te verás en la pantalla de entrenamiento.
            </p>
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="profile-name" className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
            Nombre de perfil
          </label>
          <input
            id="profile-name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={40}
            required
            autoFocus
            placeholder="Ej. Raúl Canto"
            className={`w-full rounded-xl p-2.5 text-sm border focus:outline-none ${
              isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
            }`}
            style={{ borderColor: trimmedName ? accent.hex : undefined }}
          />
        </div>

        <div className="space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
            Objetivo semanal
          </span>
          <div className={`flex items-center justify-between rounded-xl border p-1.5 ${
            isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
          }`}>
            <button
              type="button"
              onClick={() => setWeeklyGoal((value) => Math.max(1, value - 1))}
              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                isDark ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200' : 'bg-white hover:bg-zinc-100 text-zinc-700 border border-zinc-200'
              }`}
              aria-label="Menos días"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-sm font-black">
              {weeklyGoal} <span className="text-[10px] font-medium text-zinc-500">días / semana</span>
            </span>
            <button
              type="button"
              onClick={() => setWeeklyGoal((value) => Math.min(7, value + 1))}
              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                isDark ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200' : 'bg-white hover:bg-zinc-100 text-zinc-700 border border-zinc-200'
              }`}
              aria-label="Más días"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="profile-target" className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1">
            <Target className="w-3 h-3" style={{ color: accent.hex }} />
            Peso objetivo (opcional)
          </label>
          <div className="relative">
            <input
              id="profile-target"
              type="number"
              step="0.1"
              min="0"
              value={targetWeight}
              onChange={(event) => setTargetWeight(event.target.value)}
              placeholder="Ej. 75.0"
              className={`w-full rounded-xl p-2.5 pr-10 text-sm border focus:outline-none ${
                isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
              }`}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-zinc-500 font-mono">
              kg
            </span>
          </div>
        </div>

        <div className={`flex gap-2 pt-2 border-t ${isDark ? 'border-zinc-800' : 'border-zinc-200'}`}>
          <button
            type="button"
            onClick={onClose}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-colors ${
              isDark ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300' : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
            }`}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={!trimmedName}
            style={{ backgroundColor: accent.hex }}
            className={`flex-1 font-black py-2.5 rounded-xl text-xs transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-1.5 ${accent.contrastText}`}
          >
            <Check className="w-3.5 h-3.5" /> Guardar perfil
          </button>
        </div>
      </form>
    </div>
  );
};
