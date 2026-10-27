import React, { useRef } from 'react';
import { Settings, Download, Upload, AlertTriangle, Moon, Sun, Palette, Check } from 'lucide-react';
import { useTheme, ACCENT_PALETTES, AccentColor } from '../../context/ThemeContext';
import { CloudAccountCard } from './CloudAccountCard';

interface SettingsViewProps {
  onExportData: () => void;
  onImportData: (file: File) => void;
  onResetAllData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  onExportData,
  onImportData,
  onResetAllData
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { themeMode, setThemeMode, accentColor, setAccentColor, accent, isDark } = useTheme();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportData(file);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const accentList = Object.values(ACCENT_PALETTES);

  return (
    <div className={`space-y-4 animate-in fade-in duration-200 ${isDark ? 'text-zinc-100' : 'text-zinc-900'}`}>
      <h2 className="text-lg font-black flex items-center gap-2 mb-1">
        <Settings className="w-5 h-5" style={{ color: accent.hex }} />
        Ajustes y Personalización
      </h2>

      {/* SECCIÓN 0: CUENTA Y SINCRONIZACIÓN EN LA NUBE */}
      <CloudAccountCard />

      {/* SECCIÓN 1: PERSONALIZACIÓN DE TEMA Y COLORES */}
      <div className={`rounded-2xl p-4 space-y-4 border ${
        isDark ? 'bg-zinc-900/80 border-zinc-800/80 backdrop-blur-md' : 'bg-white border-zinc-200 shadow-sm'
      }`}>
        <div className="flex items-center gap-2 border-b pb-2.5" style={{ borderColor: isDark ? '#27272a' : '#e4e4e7' }}>
          <Palette className="w-4 h-4" style={{ color: accent.hex }} />
          <h3 className="text-xs font-black uppercase tracking-wider">Apariencia y Colores</h3>
        </div>

        {/* Modo Oscuro / Modo Claro */}
        <div className="space-y-2">
          <label className={`text-xs font-bold block ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
            Modo de Interfaz
          </label>
          <div className={`flex rounded-2xl p-1 border ${
            isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-100 border-zinc-200'
          }`}>
            <button
              type="button"
              onClick={() => setThemeMode('dark')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                themeMode === 'dark'
                  ? 'bg-zinc-800 text-white shadow-md'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <Moon className="w-4 h-4 text-indigo-400" />
              <span>Modo Oscuro</span>
            </button>
            <button
              type="button"
              onClick={() => setThemeMode('light')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                themeMode === 'light'
                  ? 'bg-white text-zinc-950 shadow-md font-black'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <Sun className="w-4 h-4 text-amber-500" />
              <span>Modo Claro</span>
            </button>
          </div>
        </div>

        {/* Color de Botones y Acentos */}
        <div className="space-y-2.5 pt-1">
          <label className={`text-xs font-bold block ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
            Color de Botones y Elementos Activos
          </label>

          <div className="grid grid-cols-2 gap-2">
            {accentList.map((item) => {
              const isSelected = accentColor === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setAccentColor(item.id as AccentColor)}
                  className={`p-3 rounded-2xl border transition-all flex items-center gap-2.5 text-left ${
                    isSelected
                      ? isDark ? 'bg-zinc-950 border-zinc-700 shadow-md' : 'bg-zinc-50 border-zinc-400 shadow-sm'
                      : isDark ? 'bg-zinc-950/40 border-zinc-800/80 hover:bg-zinc-950' : 'bg-white border-zinc-200 hover:bg-zinc-50'
                  }`}
                  style={isSelected ? { borderColor: item.hex } : undefined}
                >
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center shadow-sm flex-shrink-0"
                    style={{ backgroundColor: item.hex }}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" style={{ color: item.contrastText === 'text-white' ? '#fff' : '#000' }} />}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-bold truncate leading-tight">{item.name}</p>
                    <span className="text-[10px] text-zinc-500 font-mono">{item.hex}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Vista previa en vivo del botón */}
          <div className={`p-3 rounded-2xl border flex items-center justify-between gap-3 ${
            isDark ? 'bg-zinc-950/60 border-zinc-800' : 'bg-zinc-100 border-zinc-200'
          }`}>
            <span className="text-xs text-zinc-400 font-medium">Previsualización del botón:</span>
            <button
              type="button"
              style={{ backgroundColor: accent.hex }}
              className={`px-4 py-2 rounded-xl text-xs font-black shadow-md ${accent.contrastText}`}
            >
              Botón de Ejemplo
            </button>
          </div>
        </div>
      </div>

      {/* SECCIÓN 2: COPIAS DE SEGURIDAD Y RESPALDOS */}
      <div className={`rounded-2xl p-4 space-y-4 border ${
        isDark ? 'bg-zinc-900/80 border-zinc-800/80 backdrop-blur-md' : 'bg-white border-zinc-200 shadow-sm'
      }`}>
        <div>
          <h3 className="text-xs font-black uppercase tracking-wider mb-1">Copia de Seguridad y Restauración</h3>
          <p className={`text-xs mb-3 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
            Guarda tus rutinas, pesajes e historial en un archivo JSON local o expórtalo a otro dispositivo.
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onExportData}
              className={`flex-1 font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-2 border transition-colors active:scale-95 ${
                isDark 
                  ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-700/60' 
                  : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border-zinc-300'
              }`}
            >
              <Download className="w-3.5 h-3.5" style={{ color: accent.hex }} /> Exportar Copia
            </button>
            <label className={`flex-1 font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-2 border cursor-pointer transition-colors active:scale-95 ${
              isDark 
                ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-700/60' 
                : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border-zinc-300'
            }`}>
              <Upload className="w-3.5 h-3.5 text-teal-400" /> Importar Copia
              <input 
                ref={fileInputRef}
                type="file" 
                accept=".json" 
                onChange={handleFileChange} 
                className="hidden" 
              />
            </label>
          </div>
        </div>

        {/* Zona de Peligro */}
        <div className="pt-3 border-t" style={{ borderColor: isDark ? '#27272a' : '#e4e4e7' }}>
          <div className="flex items-center gap-2 text-red-500 mb-1">
            <AlertTriangle className="w-4 h-4" />
            <h3 className="text-xs font-black uppercase tracking-wider">Zona de Peligro</h3>
          </div>
          <p className={`text-xs mb-3 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
            Elimina todo el historial, los entrenamientos registrados y las medidas. Si la
            sincronización está activa, también se borrarán de la nube.
          </p>
          <button
            type="button"
            onClick={onResetAllData}
            className="w-full bg-red-950/30 hover:bg-red-900/40 text-red-400 font-bold py-2.5 rounded-xl text-xs border border-red-900/40 transition-colors active:scale-95"
          >
            Borrar Todo el Historial y Datos
          </button>
        </div>
      </div>
    </div>
  );
};
