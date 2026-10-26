import React, { useRef } from 'react';
import { Settings, Download, Upload, AlertTriangle } from 'lucide-react';

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportData(file);
      // Limpiar input para permitir seleccionar el mismo archivo de nuevo
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-1">
        <Settings className="w-5 h-5 text-emerald-400" />
        Ajustes
      </h2>

      <div className="bg-zinc-900/80 border border-zinc-800/80 rounded-2xl p-4 space-y-4 backdrop-blur-md">
        <div>
          <h3 className="text-xs font-semibold text-white mb-1">Copia de Seguridad y Restauración</h3>
          <p className="text-xs text-zinc-400 mb-3">
            Guarda tus entrenamientos en un archivo JSON local o expórtalo a otro dispositivo para no perder tu historial.
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onExportData}
              className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-2 border border-zinc-700/60 transition-colors active:scale-95"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" /> Exportar Copia
            </button>
            <label className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-2 border border-zinc-700/60 cursor-pointer transition-colors active:scale-95">
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

        <div className="pt-3 border-t border-zinc-800">
          <div className="flex items-center gap-2 text-red-400 mb-1">
            <AlertTriangle className="w-4 h-4" />
            <h3 className="text-xs font-semibold text-white">Zona de Peligro</h3>
          </div>
          <p className="text-xs text-zinc-400 mb-3">
            Elimina todo el historial, los ejercicios creados y la sesión activa en este navegador.
          </p>
          <button
            type="button"
            onClick={onResetAllData}
            className="w-full bg-red-950/30 hover:bg-red-900/40 text-red-400 font-medium py-2.5 rounded-xl text-xs border border-red-900/40 transition-colors active:scale-95"
          >
            Borrar Todo el Historial y Datos
          </button>
        </div>
      </div>
    </div>
  );
};
