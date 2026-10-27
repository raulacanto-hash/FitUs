import React from 'react';
import { Dumbbell } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface CloudSplashProps {
  message?: string;
}

export const CloudSplash: React.FC<CloudSplashProps> = ({
  message = 'Cargando tu historial...'
}) => {
  const { accent, isDark } = useTheme();

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center gap-5 ${
        isDark ? 'bg-zinc-950 text-zinc-100' : 'bg-zinc-50 text-zinc-900'
      }`}
    >
      <div
        className="w-14 h-14 rounded-2xl border flex items-center justify-center"
        style={{ backgroundColor: `${accent.hex}14`, borderColor: `${accent.hex}35` }}
      >
        <Dumbbell className="w-7 h-7" style={{ color: accent.hex }} />
      </div>
      <div className="flex items-center gap-2">
        <span
          className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: accent.hex, borderTopColor: 'transparent' }}
        />
        <p className="text-xs font-bold text-zinc-400">{message}</p>
      </div>
    </div>
  );
};
