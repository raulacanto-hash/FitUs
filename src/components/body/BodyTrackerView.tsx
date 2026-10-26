import React, { useState, useMemo } from 'react';
import { 
  Scale, 
  Ruler, 
  Plus, 
  Trash2, 
  TrendingDown, 
  TrendingUp, 
  Calendar, 
  X,
  FileText
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  ReferenceLine 
} from 'recharts';
import { 
  useBodyMetrics, 
  MEASUREMENT_LABELS 
} from '../../hooks/useBodyMetrics';
import { BodyMeasurementKey } from '../../types/workout';
import { formatDisplayDate, getLocalDateString } from '../../utils/dates';
import { useTheme } from '../../context/ThemeContext';

export const BodyTrackerView: React.FC = () => {
  const { accent, isDark } = useTheme();
  const {
    profile,
    weightLogs,
    addWeightEntry,
    deleteWeightEntry,
    weightStats,
    measurements,
    addMeasurementEntry,
    deleteMeasurementEntry,
    latestMeasurementComparison
  } = useBodyMetrics();

  const [activeSubTab, setActiveSubTab] = useState<'weight' | 'measurements'>('weight');
  const [selectedBodyPart, setSelectedBodyPart] = useState<BodyMeasurementKey>('waist');

  // Modales
  const [isWeightModalOpen, setIsWeightModalOpen] = useState(false);
  const [isMeasurementModalOpen, setIsMeasurementModalOpen] = useState(false);

  // Estados de formulario de Peso
  const [inputWeight, setInputWeight] = useState('');
  const [inputBodyFat, setInputBodyFat] = useState('');
  const [inputWeightDate, setInputWeightDate] = useState(getLocalDateString());
  const [inputWeightNotes, setInputWeightNotes] = useState('');

  // Estados de formulario de Medidas
  const [inputMeasDate, setInputMeasDate] = useState(getLocalDateString());
  const [inputMeasNotes, setInputMeasNotes] = useState('');
  const [measValues, setMeasValues] = useState<Partial<Record<BodyMeasurementKey, string>>>({});

  // Datos ordenados para gráfica de peso
  const weightChartData = useMemo(() => {
    return [...weightLogs]
      .sort((a, b) => a.date.localeCompare(b.date))
      .map(entry => {
        const parts = entry.date.split('-');
        const shortDate = parts.length === 3 ? `${parts[2]}/${parts[1]}` : entry.date;
        return {
          date: shortDate,
          fullDate: entry.date,
          weight: entry.weight,
          bodyFat: entry.bodyFat,
          notes: entry.notes
        };
      });
  }, [weightLogs]);

  // Datos ordenados para gráfica de medida seleccionada
  const measurementChartData = useMemo(() => {
    return [...measurements]
      .sort((a, b) => a.date.localeCompare(b.date))
      .map(entry => {
        const val = entry[selectedBodyPart];
        if (val === undefined || val === null) return null;
        const parts = entry.date.split('-');
        const shortDate = parts.length === 3 ? `${parts[2]}/${parts[1]}` : entry.date;
        return {
          date: shortDate,
          fullDate: entry.date,
          val: Number(val),
          notes: entry.notes
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);
  }, [measurements, selectedBodyPart]);

  // Submit de Peso
  const handleWeightSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const wNum = parseFloat(inputWeight);
    if (isNaN(wNum) || wNum <= 0) {
      alert('Ingresa un peso válido.');
      return;
    }
    const bfNum = inputBodyFat ? parseFloat(inputBodyFat) : undefined;
    addWeightEntry(wNum, bfNum, inputWeightNotes.trim(), inputWeightDate);
    setInputWeight('');
    setInputBodyFat('');
    setInputWeightNotes('');
    setIsWeightModalOpen(false);
  };

  // Submit de Medidas
  const handleMeasurementSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed: Partial<Record<BodyMeasurementKey, number>> = {};
    let hasAny = false;

    (Object.keys(measValues) as BodyMeasurementKey[]).forEach(k => {
      const valStr = measValues[k];
      if (valStr && valStr.trim() !== '') {
        const num = parseFloat(valStr);
        if (!isNaN(num) && num > 0) {
          parsed[k] = num;
          hasAny = true;
        }
      }
    });

    if (!hasAny) {
      alert('Ingresa al menos una medida corporal.');
      return;
    }

    addMeasurementEntry({
      date: inputMeasDate,
      notes: inputMeasNotes.trim(),
      ...parsed
    });

    setMeasValues({});
    setInputMeasNotes('');
    setIsMeasurementModalOpen(false);
  };

  return (
    <div className={`space-y-4 animate-in fade-in duration-200 ${isDark ? 'text-zinc-100' : 'text-zinc-900'}`}>
      {/* Selector Superior Segmentado */}
      <div className={`flex rounded-2xl p-1 border ${
        isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'
      }`}>
        <button
          type="button"
          onClick={() => setActiveSubTab('weight')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeSubTab === 'weight'
              ? 'shadow-md font-black'
              : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-white'
          }`}
          style={activeSubTab === 'weight' ? { backgroundColor: accent.hex, color: accent.contrastText === 'text-white' ? '#fff' : '#000' } : undefined}
        >
          <Scale className="w-4 h-4" /> Peso Corporal
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('measurements')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeSubTab === 'measurements'
              ? 'shadow-md font-black'
              : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-white'
          }`}
          style={activeSubTab === 'measurements' ? { backgroundColor: accent.hex, color: accent.contrastText === 'text-white' ? '#fff' : '#000' } : undefined}
        >
          <Ruler className="w-4 h-4" /> Medidas Corporales
        </button>
      </div>

      {/* SUB-VISTA 1: PESO CORPORAL */}
      {activeSubTab === 'weight' && (
        <div className="space-y-4">
          {/* Tarjetas KPI de Resumen */}
          <div className="grid grid-cols-3 gap-2">
            <div className={`rounded-2xl p-3 text-center border ${
              isDark ? 'bg-zinc-900/80 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'
            }`}>
              <span className="text-[10px] uppercase font-bold text-zinc-400 block mb-0.5">Peso Actual</span>
              <span className="text-lg font-black font-mono">
                {weightStats.currentWeight ? `${weightStats.currentWeight} kg` : '--'}
              </span>
              {weightStats.latestBodyFat && (
                <span className="text-[10px] text-zinc-500 block font-mono">
                  {weightStats.latestBodyFat}% grasa
                </span>
              )}
            </div>

            <div className={`rounded-2xl p-3 text-center border ${
              isDark ? 'bg-zinc-900/80 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'
            }`}>
              <span className="text-[10px] uppercase font-bold text-zinc-400 block mb-0.5">Cambio Total</span>
              <div className="flex items-center justify-center gap-0.5">
                {weightStats.totalChange < 0 ? (
                  <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
                ) : weightStats.totalChange > 0 ? (
                  <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                ) : null}
                <span className={`text-lg font-black font-mono ${
                  weightStats.totalChange <= 0 ? 'text-emerald-400' : 'text-amber-400'
                }`}>
                  {weightStats.totalChange > 0 ? `+${weightStats.totalChange.toFixed(1)}` : weightStats.totalChange.toFixed(1)} kg
                </span>
              </div>
            </div>

            <div className={`rounded-2xl p-3 text-center border ${
              isDark ? 'bg-zinc-900/80 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'
            }`}>
              <span className="text-[10px] uppercase font-bold text-zinc-400 block mb-0.5">Meta</span>
              <span className="text-lg font-black font-mono" style={{ color: accent.hex }}>
                {profile.targetWeight ? `${profile.targetWeight} kg` : '--'}
              </span>
              {weightStats.targetDiff !== null && (
                <span className="text-[10px] text-zinc-500 block font-mono">
                  {weightStats.targetDiff > 0 ? `-${weightStats.targetDiff.toFixed(1)} kg` : '¡Alcanzada!'}
                </span>
              )}
            </div>
          </div>

          {/* Gráfica de Progreso de Peso */}
          <div className={`p-4 rounded-3xl border space-y-3 transition-all ${
            isDark ? 'bg-zinc-900/80 border-zinc-800 backdrop-blur-md' : 'bg-white border-zinc-200 shadow-sm'
          }`}>
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5" style={{ color: accent.hex }} /> Evolución del Peso Corporal (KG)
              </h3>
              <button
                type="button"
                onClick={() => setIsWeightModalOpen(true)}
                style={{ backgroundColor: accent.hex }}
                className={`font-black px-3 py-1.5 rounded-xl text-xs flex items-center gap-1 active:scale-95 transition-all shadow-md ${accent.contrastText}`}
              >
                <Plus className="w-3.5 h-3.5" /> Registrar Peso
              </button>
            </div>

            <div className="h-48 w-full pt-2">
              {weightChartData.length === 0 ? (
                <div className={`h-full flex items-center justify-center text-xs border border-dashed rounded-2xl ${
                  isDark ? 'text-zinc-500 border-zinc-800' : 'text-zinc-400 border-zinc-300'
                }`}>
                  Aún no hay registros de peso corporal
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weightChartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#27272a" : "#e4e4e7"} />
                    <XAxis dataKey="date" stroke="#71717a" fontSize={10} tickLine={false} />
                    <YAxis stroke="#71717a" fontSize={10} tickLine={false} domain={['dataMin - 1', 'dataMax + 1']} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: isDark ? '#18181b' : '#ffffff', 
                        borderColor: isDark ? '#27272a' : '#e4e4e7', 
                        borderRadius: '0.75rem', 
                        fontSize: '11px',
                        color: isDark ? '#ffffff' : '#09090b',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }}
                      itemStyle={{ color: accent.hex, fontWeight: 'bold' }}
                      formatter={(val: number) => [`${val} kg`, 'Peso']}
                      labelFormatter={(label, payload) => payload?.[0]?.payload?.fullDate || label}
                    />
                    {profile.targetWeight && (
                      <ReferenceLine y={profile.targetWeight} stroke={accent.hex} strokeDasharray="3 3" label={{ value: 'Meta', fill: accent.hex, fontSize: 10 }} />
                    )}
                    <Line 
                      type="monotone" 
                      dataKey="weight" 
                      stroke={accent.hex} 
                      strokeWidth={2.5} 
                      dot={{ fill: accent.hex, r: 4 }} 
                      activeDot={{ r: 6, fill: accent.hex }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Historial de Pesajes */}
          <div className={`p-4 rounded-3xl border space-y-3 transition-all ${
            isDark ? 'bg-zinc-900/80 border-zinc-800 backdrop-blur-md' : 'bg-white border-zinc-200 shadow-sm'
          }`}>
            <h4 className="text-xs font-bold text-zinc-400">Historial de Pesajes</h4>
            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {weightLogs.map(entry => (
                <div key={entry.id} className={`flex items-center justify-between p-2.5 rounded-xl border text-xs ${
                  isDark ? 'bg-zinc-950/60 border-zinc-800/80' : 'bg-zinc-50 border-zinc-200'
                }`}>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                    <span className="font-mono">{formatDisplayDate(entry.date)}</span>
                    {entry.bodyFat && (
                      <span className="text-[10px] text-zinc-500 font-mono">({entry.bodyFat}% grasa)</span>
                    )}
                    {entry.notes && (
                      <span className="text-[10px] text-zinc-400 italic truncate max-w-[120px]">- {entry.notes}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold font-mono">{entry.weight} kg</span>
                    <button 
                      type="button"
                      onClick={() => deleteWeightEntry(entry.id)}
                      className="text-zinc-500 hover:text-red-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-VISTA 2: MEDIDAS CORPORALES */}
      {activeSubTab === 'measurements' && (
        <div className="space-y-4">
          {/* Selector horizontal de medida anatómica */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold">Métrica Corporal:</span>
              <button
                type="button"
                onClick={() => setIsMeasurementModalOpen(true)}
                style={{ backgroundColor: accent.hex }}
                className={`font-black px-3 py-1.5 rounded-xl text-xs flex items-center gap-1 active:scale-95 transition-all shadow-md ${accent.contrastText}`}
              >
                <Plus className="w-3.5 h-3.5" /> Registrar Medidas
              </button>
            </div>

            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
              {(Object.keys(MEASUREMENT_LABELS) as BodyMeasurementKey[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedBodyPart(key)}
                  className={`px-3 py-1.5 rounded-xl text-xs whitespace-nowrap transition-all font-bold ${
                    selectedBodyPart === key
                      ? 'shadow-md'
                      : isDark ? 'bg-zinc-800/80 text-zinc-400 hover:text-zinc-200 border border-zinc-700/40' : 'bg-zinc-100 text-zinc-600 border border-zinc-200'
                  }`}
                  style={selectedBodyPart === key ? { backgroundColor: accent.hex, color: accent.contrastText === 'text-white' ? '#fff' : '#000' } : undefined}
                >
                  {MEASUREMENT_LABELS[key]}
                </button>
              ))}
            </div>
          </div>

          {/* Tarjeta de Comparativa de la medida seleccionada */}
          {latestMeasurementComparison.latest && (
            <div className={`p-4 rounded-3xl border flex items-center justify-between transition-all ${
              isDark ? 'bg-zinc-900/80 border-zinc-800 backdrop-blur-md' : 'bg-white border-zinc-200 shadow-sm'
            }`}>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider" style={{ color: accent.hex }}>
                  {MEASUREMENT_LABELS[selectedBodyPart]}
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-2xl font-black font-mono">
                    {latestMeasurementComparison.latest[selectedBodyPart] ?? '--'} <span className="text-xs text-zinc-400 font-sans">cm</span>
                  </span>
                  {latestMeasurementComparison.diffs[selectedBodyPart] !== undefined && (
                    <span className={`text-xs font-mono font-bold ${
                      latestMeasurementComparison.diffs[selectedBodyPart]! > 0 
                        ? 'text-emerald-400' 
                        : latestMeasurementComparison.diffs[selectedBodyPart]! < 0 
                        ? 'text-amber-400' 
                        : 'text-zinc-400'
                    }`}>
                      {latestMeasurementComparison.diffs[selectedBodyPart]! > 0 ? '+' : ''}
                      {latestMeasurementComparison.diffs[selectedBodyPart]} cm vs anterior
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right text-[11px] text-zinc-500 font-mono">
                Última medición: {formatDisplayDate(latestMeasurementComparison.latest.date)}
              </div>
            </div>
          )}

          {/* Gráfica de Medición en el Tiempo */}
          <div className={`p-4 rounded-3xl border space-y-3 transition-all ${
            isDark ? 'bg-zinc-900/80 border-zinc-800 backdrop-blur-md' : 'bg-white border-zinc-200 shadow-sm'
          }`}>
            <h3 className="text-xs font-bold flex items-center gap-1.5">
              <Ruler className="w-3.5 h-3.5" style={{ color: accent.hex }} /> Histórico de {MEASUREMENT_LABELS[selectedBodyPart]} (CM)
            </h3>

            <div className="h-44 w-full pt-1">
              {measurementChartData.length === 0 ? (
                <div className={`h-full flex items-center justify-center text-xs border border-dashed rounded-2xl ${
                  isDark ? 'text-zinc-500 border-zinc-800' : 'text-zinc-400 border-zinc-300'
                }`}>
                  No hay datos registrados aún para {MEASUREMENT_LABELS[selectedBodyPart]}
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={measurementChartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#27272a" : "#e4e4e7"} />
                    <XAxis dataKey="date" stroke="#71717a" fontSize={10} tickLine={false} />
                    <YAxis stroke="#71717a" fontSize={10} tickLine={false} domain={['dataMin - 1', 'dataMax + 1']} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: isDark ? '#18181b' : '#ffffff', 
                        borderColor: isDark ? '#27272a' : '#e4e4e7', 
                        borderRadius: '0.75rem', 
                        fontSize: '11px',
                        color: isDark ? '#ffffff' : '#09090b',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }}
                      itemStyle={{ color: accent.hex, fontWeight: 'bold' }}
                      formatter={(val: number) => [`${val} cm`, MEASUREMENT_LABELS[selectedBodyPart]]}
                      labelFormatter={(label, payload) => payload?.[0]?.payload?.fullDate || label}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="val" 
                      stroke={accent.hex} 
                      strokeWidth={2.5} 
                      dot={{ fill: accent.hex, r: 4 }} 
                      activeDot={{ r: 6, fill: accent.hex }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Listado de todas las mediciones pasadas */}
          <div className={`p-4 rounded-3xl border space-y-3 transition-all ${
            isDark ? 'bg-zinc-900/80 border-zinc-800 backdrop-blur-md' : 'bg-white border-zinc-200 shadow-sm'
          }`}>
            <h4 className="text-xs font-bold text-zinc-400">Todas las Sesiones de Medición</h4>
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {measurements.map(m => (
                <div key={m.id} className={`p-3 rounded-2xl border space-y-1.5 text-xs ${
                  isDark ? 'bg-zinc-950/60 border-zinc-800/80' : 'bg-zinc-50 border-zinc-200'
                }`}>
                  <div className="flex justify-between items-center border-b pb-1" style={{ borderColor: isDark ? '#27272a' : '#e4e4e7' }}>
                    <span className="font-mono font-bold" style={{ color: accent.hex }}>{formatDisplayDate(m.date)}</span>
                    <button 
                      type="button" 
                      onClick={() => deleteMeasurementEntry(m.id)}
                      className="text-zinc-500 hover:text-red-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 text-[11px] font-mono text-zinc-400">
                    {m.waist && <div>Cintura: <strong className={isDark ? "text-white" : "text-zinc-900"}>{m.waist}cm</strong></div>}
                    {m.chest && <div>Pecho: <strong className={isDark ? "text-white" : "text-zinc-900"}>{m.chest}cm</strong></div>}
                    {m.hips && <div>Cadera: <strong className={isDark ? "text-white" : "text-zinc-900"}>{m.hips}cm</strong></div>}
                    {m.rightArm && <div>Brazo D: <strong className={isDark ? "text-white" : "text-zinc-900"}>{m.rightArm}cm</strong></div>}
                    {m.leftArm && <div>Brazo I: <strong className={isDark ? "text-white" : "text-zinc-900"}>{m.leftArm}cm</strong></div>}
                    {m.rightThigh && <div>Muslo D: <strong className={isDark ? "text-white" : "text-zinc-900"}>{m.rightThigh}cm</strong></div>}
                  </div>
                  {m.notes && (
                    <p className="text-[10px] text-zinc-500 italic mt-1 flex items-center gap-1">
                      <FileText className="w-3 h-3" /> {m.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL PARA REGISTRAR NUEVO PESO */}
      {isWeightModalOpen && (
        <div className="fixed inset-0 z-50 bg-zinc-950/80 backdrop-blur-md flex items-center justify-center p-3 animate-in fade-in duration-200">
          <div className={`rounded-3xl max-w-sm w-full p-4 space-y-3 shadow-2xl border ${
            isDark ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-zinc-200 text-zinc-900'
          }`}>
            <div className="flex justify-between items-center border-b pb-2" style={{ borderColor: isDark ? '#27272a' : '#e4e4e7' }}>
              <h3 className="font-bold text-sm flex items-center gap-1.5">
                <Scale className="w-4 h-4" style={{ color: accent.hex }} /> Registrar Pesaje
              </h3>
              <button type="button" onClick={() => setIsWeightModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleWeightSubmit} className="space-y-3">
              <div>
                <label className="text-[10px] text-zinc-400 block mb-1">Peso Corporal (KG) *</label>
                <input
                  type="number"
                  step="0.1"
                  inputMode="decimal"
                  value={inputWeight}
                  onChange={(e) => setInputWeight(e.target.value)}
                  placeholder="Ej. 79.5"
                  className={`w-full rounded-xl p-2.5 text-xs font-bold border focus:outline-none ${
                    isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
                  }`}
                  style={{ borderColor: inputWeight ? accent.hex : undefined }}
                  autoFocus
                  required
                />
              </div>

              <div>
                <label className="text-[10px] text-zinc-400 block mb-1">Porcentaje de Grasa (%) (Opcional)</label>
                <input
                  type="number"
                  step="0.1"
                  inputMode="decimal"
                  value={inputBodyFat}
                  onChange={(e) => setInputBodyFat(e.target.value)}
                  placeholder="Ej. 17.5"
                  className={`w-full rounded-xl p-2.5 text-xs font-bold border focus:outline-none ${
                    isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
                  }`}
                />
              </div>

              <div>
                <label className="text-[10px] text-zinc-400 block mb-1">Fecha</label>
                <input
                  type="date"
                  value={inputWeightDate}
                  onChange={(e) => setInputWeightDate(e.target.value)}
                  className={`w-full rounded-xl p-2 text-xs font-bold border focus:outline-none ${
                    isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
                  }`}
                />
              </div>

              <div>
                <label className="text-[10px] text-zinc-400 block mb-1">Notas (Opcional)</label>
                <input
                  type="text"
                  value={inputWeightNotes}
                  onChange={(e) => setInputWeightNotes(e.target.value)}
                  placeholder="Ej. En ayunas post-cardio"
                  className={`w-full rounded-xl p-2.5 text-xs border focus:outline-none ${
                    isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
                  }`}
                />
              </div>

              <div className="flex gap-2 pt-2 border-t" style={{ borderColor: isDark ? '#27272a' : '#e4e4e7' }}>
                <button
                  type="button"
                  onClick={() => setIsWeightModalOpen(false)}
                  className={`flex-1 py-2 rounded-xl text-xs font-medium ${
                    isDark ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300' : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
                  }`}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{ backgroundColor: accent.hex }}
                  className={`flex-1 font-black py-2 rounded-xl text-xs active:scale-95 transition-all ${accent.contrastText}`}
                >
                  Guardar Peso
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL PARA REGISTRAR MEDIDAS CORPORALES */}
      {isMeasurementModalOpen && (
        <div className="fixed inset-0 z-50 bg-zinc-950/80 backdrop-blur-md flex items-center justify-center p-3 animate-in fade-in duration-200">
          <div className={`rounded-3xl max-w-md w-full max-h-[85vh] flex flex-col p-4 space-y-3 shadow-2xl border ${
            isDark ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-zinc-200 text-zinc-900'
          }`}>
            <div className="flex justify-between items-center border-b pb-2" style={{ borderColor: isDark ? '#27272a' : '#e4e4e7' }}>
              <h3 className="font-bold text-sm flex items-center gap-1.5">
                <Ruler className="w-4 h-4" style={{ color: accent.hex }} /> Registrar Medidas Corporales (CM)
              </h3>
              <button type="button" onClick={() => setIsMeasurementModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleMeasurementSubmit} className="flex-1 overflow-y-auto space-y-3 pr-1">
              <div>
                <label className="text-[10px] text-zinc-400 block mb-1">Fecha de Medición</label>
                <input
                  type="date"
                  value={inputMeasDate}
                  onChange={(e) => setInputMeasDate(e.target.value)}
                  className={`w-full rounded-xl p-2 text-xs font-bold border focus:outline-none ${
                    isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {(Object.keys(MEASUREMENT_LABELS) as BodyMeasurementKey[]).map(key => (
                  <div key={key}>
                    <label className="text-[10px] text-zinc-400 block mb-0.5">{MEASUREMENT_LABELS[key]}</label>
                    <input
                      type="number"
                      step="0.5"
                      inputMode="decimal"
                      value={measValues[key] || ''}
                      onChange={(e) => setMeasValues(prev => ({ ...prev, [key]: e.target.value }))}
                      placeholder="0.0 cm"
                      className={`w-full rounded-xl p-2 text-xs font-bold border focus:outline-none ${
                        isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
                      }`}
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="text-[10px] text-zinc-400 block mb-1">Notas</label>
                <input
                  type="text"
                  value={inputMeasNotes}
                  onChange={(e) => setInputMeasNotes(e.target.value)}
                  placeholder="Ej. Medición con cinta métrica flexible"
                  className={`w-full rounded-xl p-2 text-xs border focus:outline-none ${
                    isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
                  }`}
                />
              </div>

              <div className="flex gap-2 pt-2 border-t" style={{ borderColor: isDark ? '#27272a' : '#e4e4e7' }}>
                <button
                  type="button"
                  onClick={() => setIsMeasurementModalOpen(false)}
                  className={`flex-1 py-2 rounded-xl text-xs font-medium ${
                    isDark ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300' : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
                  }`}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{ backgroundColor: accent.hex }}
                  className={`flex-1 font-black py-2 rounded-xl text-xs active:scale-95 transition-all ${accent.contrastText}`}
                >
                  Guardar Medidas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
