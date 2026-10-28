import { ExerciseDefinition, MuscleFilter } from '../types/workout';

export const MUSCLE_GROUPS: MuscleFilter[] = [
  'Todos',
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

export const EXERCISE_DATABASE: ExerciseDefinition[] = [
  // ==========================================
  // 1. PECTORAL (PECHO)
  // ==========================================
  // Máquinas y Poleas
  { id: 'ch-1', name: 'Press de pecho sentado en máquina (Chest Press)', category: 'Pecho', equipment: 'Máquina' },
  { id: 'ch-2', name: 'Press inclinado en máquina (Incline Chest Press)', category: 'Pecho', equipment: 'Máquina' },
  { id: 'ch-3', name: 'Press declinado en máquina', category: 'Pecho', equipment: 'Máquina' },
  { id: 'ch-4', name: 'Chest Press convergente (Palanca/Discos)', category: 'Pecho', equipment: 'Máquina' },
  { id: 'ch-5', name: 'Press en máquina Smith / Multipower plano', category: 'Pecho', equipment: 'Máquina' },
  { id: 'ch-6', name: 'Press en máquina Smith / Multipower inclinado', category: 'Pecho', equipment: 'Máquina' },
  { id: 'ch-7', name: 'Cruce de poleas altas a bajas (Pecho inferior)', category: 'Pecho', equipment: 'Polea' },
  { id: 'ch-8', name: 'Cruce de poleas medias (Aperturas en polea)', category: 'Pecho', equipment: 'Polea' },
  { id: 'ch-9', name: 'Cruce de poleas bajas a altas (Pecho superior)', category: 'Pecho', equipment: 'Polea' },
  { id: 'ch-10', name: 'Press con poleas desde banco plano', category: 'Pecho', equipment: 'Polea' },
  { id: 'ch-11', name: 'Press con poleas desde banco inclinado', category: 'Pecho', equipment: 'Polea' },
  { id: 'ch-12', name: 'Peck Deck / Contractor (Mariposa en máquina)', category: 'Pecho', equipment: 'Máquina' },
  // Peso Libre (Gimnasio)
  { id: 'ch-13', name: 'Press de banca plano con barra', category: 'Pecho', equipment: 'Barra' },
  { id: 'ch-14', name: 'Press de banca inclinado con barra (30° - 45°)', category: 'Pecho', equipment: 'Barra' },
  { id: 'ch-15', name: 'Press de banca declinado con barra', category: 'Pecho', equipment: 'Barra' },
  { id: 'ch-16', name: 'Press Guillotina con barra al cuello', category: 'Pecho', equipment: 'Barra' },
  { id: 'ch-17', name: 'Press de banca agarre cerrado con barra', category: 'Pecho', equipment: 'Barra' },
  { id: 'ch-18', name: 'Press plano con mancuernas', category: 'Pecho', equipment: 'Mancuernas' },
  { id: 'ch-19', name: 'Press inclinado con mancuernas', category: 'Pecho', equipment: 'Mancuernas' },
  { id: 'ch-20', name: 'Press declinado con mancuernas', category: 'Pecho', equipment: 'Mancuernas' },
  { id: 'ch-21', name: 'Press neutro con mancuernas (Palmas enfrentadas)', category: 'Pecho', equipment: 'Mancuernas' },
  { id: 'ch-22', name: 'Press Hex con mancuernas pegadas', category: 'Pecho', equipment: 'Mancuernas' },
  { id: 'ch-23', name: 'Aperturas (Flyes) en banco plano con mancuernas', category: 'Pecho', equipment: 'Mancuernas' },
  { id: 'ch-24', name: 'Aperturas en banco inclinado con mancuernas', category: 'Pecho', equipment: 'Mancuernas' },
  { id: 'ch-25', name: 'Pullover con mancuerna', category: 'Pecho', equipment: 'Mancuernas' },
  { id: 'ch-26', name: 'Landmine Press de pie con barra en esquina', category: 'Pecho', equipment: 'Barra' },
  { id: 'ch-27', name: 'Fondos en paralelas para pecho (Dips con inclinación)', category: 'Pecho', equipment: 'Corporal' },
  // Casa (Corporal, Mancuernas y Bandas)
  { id: 'ch-28', name: 'Flexiones de pecho estándar (Push-ups)', category: 'Pecho', equipment: 'Corporal' },
  { id: 'ch-29', name: 'Flexiones inclinadas (Manos elevadas en silla/banco)', category: 'Pecho', equipment: 'Corporal' },
  { id: 'ch-30', name: 'Flexiones declinadas (Pies elevados)', category: 'Pecho', equipment: 'Corporal' },
  { id: 'ch-31', name: 'Flexiones diamante (Enfoque tríceps y centro)', category: 'Pecho', equipment: 'Corporal' },
  { id: 'ch-32', name: 'Flexiones abiertas', category: 'Pecho', equipment: 'Corporal' },
  { id: 'ch-33', name: 'Flexiones arqueras (Archer push-ups)', category: 'Pecho', equipment: 'Corporal' },
  { id: 'ch-34', name: 'Flexiones pliométricas (Con despegue/palmada)', category: 'Pecho', equipment: 'Corporal' },
  { id: 'ch-35', name: 'Flexiones con banda de resistencia en espalda', category: 'Pecho', equipment: 'Bandas' },
  { id: 'ch-36', name: 'Floor Press con mancuernas en piso', category: 'Pecho', equipment: 'Mancuernas' },
  { id: 'ch-37', name: 'Aperturas en el piso con mancuernas', category: 'Pecho', equipment: 'Mancuernas' },
  { id: 'ch-38', name: 'Press con banda elástica anclada a puerta', category: 'Pecho', equipment: 'Bandas' },

  // ==========================================
  // 2. ESPALDA (DORSAL, TRAPECIO, ROMBOIDES, LUMBAR)
  // ==========================================
  // Poleas y Máquinas
  { id: 'bk-1', name: 'Jalón al pecho agarre abierto (Lat Pulldown)', category: 'Espalda', equipment: 'Polea' },
  { id: 'bk-2', name: 'Jalón al pecho agarre neutro cerrado (Mag / V)', category: 'Espalda', equipment: 'Polea' },
  { id: 'bk-3', name: 'Jalón al pecho agarre supino', category: 'Espalda', equipment: 'Polea' },
  { id: 'bk-4', name: 'Jalón unilateral en polea alta', category: 'Espalda', equipment: 'Polea' },
  { id: 'bk-5', name: 'Remo sentado en polea baja (Cable Row) agarre V', category: 'Espalda', equipment: 'Polea' },
  { id: 'bk-6', name: 'Remo sentado en polea baja agarre ancho', category: 'Espalda', equipment: 'Polea' },
  { id: 'bk-7', name: 'Remo en máquina de palanca / discos', category: 'Espalda', equipment: 'Máquina' },
  { id: 'bk-8', name: 'Remo T en máquina con apoyo en pecho (Chest-supported)', category: 'Espalda', equipment: 'Máquina' },
  { id: 'bk-9', name: 'Pullover en polea alta con brazos rectos', category: 'Espalda', equipment: 'Polea' },
  { id: 'bk-10', name: 'Hiperextensiones lumbares en banco a 45°', category: 'Espalda', equipment: 'Corporal' },
  // Peso Libre (Gimnasio)
  { id: 'bk-11', name: 'Dominadas pronas (Pull-ups)', category: 'Espalda', equipment: 'Corporal' },
  { id: 'bk-12', name: 'Dominadas supinas (Chin-ups)', category: 'Espalda', equipment: 'Corporal' },
  { id: 'bk-13', name: 'Dominadas agarre neutro', category: 'Espalda', equipment: 'Corporal' },
  { id: 'bk-14', name: 'Remo con barra prono (Overhand)', category: 'Espalda', equipment: 'Barra' },
  { id: 'bk-15', name: 'Remo con barra supino (Yates Row)', category: 'Espalda', equipment: 'Barra' },
  { id: 'bk-16', name: 'Remo Pendlay (Desde el suelo)', category: 'Espalda', equipment: 'Barra' },
  { id: 'bk-17', name: 'Remo unilateral con mancuerna (Apoyo en banco)', category: 'Espalda', equipment: 'Mancuernas' },
  { id: 'bk-18', name: 'Remo Seal (Boca abajo en banco horizontal)', category: 'Espalda', equipment: 'Barra' },
  { id: 'bk-19', name: 'Remo con barra T libre', category: 'Espalda', equipment: 'Barra' },
  { id: 'bk-20', name: 'Remo Meadows unilateral en Landmine', category: 'Espalda', equipment: 'Barra' },
  { id: 'bk-21', name: 'Peso muerto convencional con barra', category: 'Espalda', equipment: 'Barra' },
  { id: 'bk-22', name: 'Peso muerto Sumo con barra', category: 'Espalda', equipment: 'Barra' },
  { id: 'bk-23', name: 'Encogimientos de hombros con barra (Shrugs)', category: 'Espalda', equipment: 'Barra' },
  { id: 'bk-24', name: 'Encogimientos con mancuernas (Trapecio)', category: 'Espalda', equipment: 'Mancuernas' },
  // Casa (Corporal, Mancuernas y Bandas)
  { id: 'bk-25', name: 'Dominadas en marco de puerta / parque', category: 'Espalda', equipment: 'Corporal' },
  { id: 'bk-26', name: 'Remo invertido bajo mesa o sábanas (Inverted Row)', category: 'Espalda', equipment: 'Corporal' },
  { id: 'bk-27', name: 'Supermanes en el piso (Erectores lumbares)', category: 'Espalda', equipment: 'Corporal' },
  { id: 'bk-28', name: 'Inverted Snow Angels en el piso', category: 'Espalda', equipment: 'Corporal' },
  { id: 'bk-29', name: 'Remo con mancuernas inclinado a 2 manos', category: 'Espalda', equipment: 'Mancuernas' },
  { id: 'bk-30', name: 'Remo unilateral apoyado en silla', category: 'Espalda', equipment: 'Mancuernas' },
  { id: 'bk-31', name: 'Pullover con mancuerna en el piso', category: 'Espalda', equipment: 'Mancuernas' },
  { id: 'bk-32', name: 'Remo sentado con banda pisada en los pies', category: 'Espalda', equipment: 'Bandas' },
  { id: 'bk-33', name: 'Jalón dorsal con banda elástica anclada arriba', category: 'Espalda', equipment: 'Bandas' },

  // ==========================================
  // 3. HOMBROS (DELTOIDES ANTERIOR, LATERAL, POSTERIOR)
  // ==========================================
  // Máquinas y Poleas
  { id: 'sh-1', name: 'Press militar de hombros en máquina (Shoulder Press)', category: 'Hombros', equipment: 'Máquina' },
  { id: 'sh-2', name: 'Press militar en máquina Smith / Multipower', category: 'Hombros', equipment: 'Máquina' },
  { id: 'sh-3', name: 'Elevaciones laterales en polea baja por detrás', category: 'Hombros', equipment: 'Polea' },
  { id: 'sh-4', name: 'Elevaciones laterales en polea baja por delante', category: 'Hombros', equipment: 'Polea' },
  { id: 'sh-5', name: 'Elevaciones egipcias en polea (Inclinado)', category: 'Hombros', equipment: 'Polea' },
  { id: 'sh-6', name: 'Pájaros en polea cruzada (Deltoides posterior)', category: 'Hombros', equipment: 'Polea' },
  { id: 'sh-7', name: 'Pájaros en máquina Contractor invertido (Rear Delt)', category: 'Hombros', equipment: 'Máquina' },
  { id: 'sh-8', name: 'Face Pulls en polea alta con cuerda', category: 'Hombros', equipment: 'Polea' },
  { id: 'sh-9', name: 'Elevación frontal en polea baja con barra/cuerda', category: 'Hombros', equipment: 'Polea' },
  { id: 'sh-10', name: 'Rotaciones externas con polea (Manguito rotador)', category: 'Hombros', equipment: 'Polea' },
  // Peso Libre (Gimnasio)
  { id: 'sh-11', name: 'Press militar de pie con barra (OHP)', category: 'Hombros', equipment: 'Barra' },
  { id: 'sh-12', name: 'Press militar sentado con mancuernas', category: 'Hombros', equipment: 'Mancuernas' },
  { id: 'sh-13', name: 'Press Arnold con mancuernas', category: 'Hombros', equipment: 'Mancuernas' },
  { id: 'sh-14', name: 'Push Press con barra (Impulso de piernas)', category: 'Hombros', equipment: 'Barra' },
  { id: 'sh-15', name: 'Elevaciones laterales de pie con mancuernas', category: 'Hombros', equipment: 'Mancuernas' },
  { id: 'sh-16', name: 'Elevaciones laterales sentado con mancuernas', category: 'Hombros', equipment: 'Mancuernas' },
  { id: 'sh-17', name: 'Elevaciones laterales recostado en banco inclinado', category: 'Hombros', equipment: 'Mancuernas' },
  { id: 'sh-18', name: 'Lu Raises (Elevaciones laterales completas)', category: 'Hombros', equipment: 'Mancuernas' },
  { id: 'sh-19', name: 'Elevaciones frontales con mancuernas alternas', category: 'Hombros', equipment: 'Mancuernas' },
  { id: 'sh-20', name: 'Elevación frontal con disco a dos manos', category: 'Hombros', equipment: 'Mancuernas' },
  { id: 'sh-21', name: 'Pájaros con mancuernas (Inclinado hacia adelante)', category: 'Hombros', equipment: 'Mancuernas' },
  { id: 'sh-22', name: 'Remo al mentón con barra o polea (Upright Row)', category: 'Hombros', equipment: 'Barra' },
  // Casa (Corporal, Mancuernas y Bandas)
  { id: 'sh-23', name: 'Flexiones en Pica (Pike Push-ups)', category: 'Hombros', equipment: 'Corporal' },
  { id: 'sh-24', name: 'Flexiones en Pino contra la pared (Handstand Push-ups)', category: 'Hombros', equipment: 'Corporal' },
  { id: 'sh-25', name: 'Complejo Y-T-W en el piso (Estabilidad escapular)', category: 'Hombros', equipment: 'Corporal' },
  { id: 'sh-26', name: 'Press de hombros con mancuernas o botellas', category: 'Hombros', equipment: 'Mancuernas' },
  { id: 'sh-27', name: 'Elevaciones laterales con banda de resistencia', category: 'Hombros', equipment: 'Bandas' },
  { id: 'sh-28', name: 'Elevaciones frontales con banda elástica', category: 'Hombros', equipment: 'Bandas' },
  { id: 'sh-29', name: 'Face pulls con banda anclada en puerta', category: 'Hombros', equipment: 'Bandas' },
  { id: 'sh-30', name: 'Pájaros posteriores con mancuernas ligeras/botellas', category: 'Hombros', equipment: 'Mancuernas' },

  // ==========================================
  // 4. BRAZOS (BÍCEPS, TRÍCEPS Y ANTEBRAZOS)
  // ==========================================
  // Bíceps - Gimnasio y Peso Libre
  { id: 'bi-1', name: 'Curl de bíceps en banco Scott en máquina', category: 'Bíceps', equipment: 'Máquina' },
  { id: 'bi-2', name: 'Curl de bíceps en polea baja con barra recta', category: 'Bíceps', equipment: 'Polea' },
  { id: 'bi-3', name: 'Curl de bíceps en polea baja con cuerda', category: 'Bíceps', equipment: 'Polea' },
  { id: 'bi-4', name: 'Curl bayonesa / Overhead en doble polea alta', category: 'Bíceps', equipment: 'Polea' },
  { id: 'bi-5', name: 'Curl de bíceps con barra recta', category: 'Bíceps', equipment: 'Barra' },
  { id: 'bi-6', name: 'Curl de bíceps con barra Z', category: 'Bíceps', equipment: 'Barra' },
  { id: 'bi-7', name: 'Curl de bíceps 21s con barra Z', category: 'Bíceps', equipment: 'Barra' },
  { id: 'bi-8', name: 'Curl con mancuernas de pie alternado', category: 'Bíceps', equipment: 'Mancuernas' },
  { id: 'bi-9', name: 'Curl con mancuernas sentado', category: 'Bíceps', equipment: 'Mancuernas' },
  { id: 'bi-10', name: 'Curl Martillo con mancuernas (Braquial)', category: 'Bíceps', equipment: 'Mancuernas' },
  { id: 'bi-11', name: 'Curl en banco inclinado con mancuernas (Cabeza larga)', category: 'Bíceps', equipment: 'Mancuernas' },
  { id: 'bi-12', name: 'Curl concentrado apoyado en el muslo', category: 'Bíceps', equipment: 'Mancuernas' },
  { id: 'bi-13', name: 'Curl Araña en banco inclinado (Spider Curl)', category: 'Bíceps', equipment: 'Mancuernas' },
  { id: 'bi-14', name: 'Curl Zottman con giro en pronación', category: 'Bíceps', equipment: 'Mancuernas' },
  { id: 'bi-15', name: 'Curl de bíceps en banco predicador con barra Z', category: 'Bíceps', equipment: 'Barra' },
  // Bíceps - Casa
  { id: 'bi-16', name: 'Curl de bíceps pisando banda elástica', category: 'Bíceps', equipment: 'Bandas' },
  { id: 'bi-17', name: 'Curl martillo con banda de resistencia', category: 'Bíceps', equipment: 'Bandas' },

  // Tríceps - Gimnasio y Peso Libre
  { id: 'tr-1', name: 'Extensión de tríceps en polea con cuerda', category: 'Tríceps', equipment: 'Polea' },
  { id: 'tr-2', name: 'Extensión de tríceps en polea con barra recta', category: 'Tríceps', equipment: 'Polea' },
  { id: 'tr-3', name: 'Extensión de tríceps en polea con barra V', category: 'Tríceps', equipment: 'Polea' },
  { id: 'tr-4', name: 'Extensión de tríceps sobre la cabeza en polea baja', category: 'Tríceps', equipment: 'Polea' },
  { id: 'tr-5', name: 'Extensión Katana unilateral cruzada en polea', category: 'Tríceps', equipment: 'Polea' },
  { id: 'tr-6', name: 'Máquina de fondos para tríceps (Dip Machine)', category: 'Tríceps', equipment: 'Máquina' },
  { id: 'tr-7', name: 'Press francés con barra Z (Skullcrushers)', category: 'Tríceps', equipment: 'Barra' },
  { id: 'tr-8', name: 'Press francés con mancuernas en banco plano', category: 'Tríceps', equipment: 'Mancuernas' },
  { id: 'tr-9', name: 'Extensión tras nuca con mancuerna a 2 manos', category: 'Tríceps', equipment: 'Mancuernas' },
  { id: 'tr-10', name: 'Extensión tras nuca unilateral con mancuerna', category: 'Tríceps', equipment: 'Mancuernas' },
  { id: 'tr-11', name: 'Press de banca agarre cerrado para tríceps', category: 'Tríceps', equipment: 'Barra' },
  { id: 'tr-12', name: 'Patada de tríceps con mancuerna (Kickback)', category: 'Tríceps', equipment: 'Mancuernas' },
  { id: 'tr-13', name: 'Tate Press con mancuernas en banco plano', category: 'Tríceps', equipment: 'Mancuernas' },
  { id: 'tr-14', name: 'Fondos en paralelas para tríceps (Torso vertical)', category: 'Tríceps', equipment: 'Corporal' },
  // Tríceps - Casa
  { id: 'tr-15', name: 'Fondos entre bancos / en silla o sofá', category: 'Tríceps', equipment: 'Corporal' },
  { id: 'tr-16', name: 'Flexiones Esfinge (Triceps extension push-ups)', category: 'Tríceps', equipment: 'Corporal' },
  { id: 'tr-17', name: 'Extensión de tríceps tras nuca con banda elástica', category: 'Tríceps', equipment: 'Bandas' },
  { id: 'tr-18', name: 'Pushdown de tríceps con banda anclada arriba', category: 'Tríceps', equipment: 'Bandas' },

  // Antebrazos
  { id: 'fa-1', name: 'Curl de muñeca en supinación con barra', category: 'Antebrazos', equipment: 'Barra' },
  { id: 'fa-2', name: 'Curl de muñeca en pronación (Inverso)', category: 'Antebrazos', equipment: 'Barra' },
  { id: 'fa-3', name: 'Paseo del granjero con mancuernas (Farmer Walk)', category: 'Antebrazos', equipment: 'Mancuernas' },
  { id: 'fa-4', name: 'Paseo de la maleta (Suitcase Carry unilateral)', category: 'Antebrazos', equipment: 'Mancuernas' },
  { id: 'fa-5', name: 'Pinza con discos (Plate Pinch para agarre)', category: 'Antebrazos', equipment: 'Accesorio' },
  { id: 'fa-6', name: 'Colgado estático en barra (Dead Hang)', category: 'Antebrazos', equipment: 'Corporal' },
  { id: 'fa-7', name: 'Enrollador de muñeca con cuerda y peso (Wrist Roller)', category: 'Antebrazos', equipment: 'Accesorio' },

  // ==========================================
  // 5. CUÁDRICEPS (PARTE FRONTAL DEL MUSLO)
  // ==========================================
  // Gimnasio (Máquinas y Peso Libre)
  { id: 'qd-1', name: 'Extensión de piernas en máquina (Leg Extension)', category: 'Cuádriceps', equipment: 'Máquina' },
  { id: 'qd-2', name: 'Prensa 45° con discos', category: 'Cuádriceps', equipment: 'Máquina' },
  { id: 'qd-3', name: 'Prensa horizontal en máquina', category: 'Cuádriceps', equipment: 'Máquina' },
  { id: 'qd-4', name: 'Prensa unilateral a 1 pierna', category: 'Cuádriceps', equipment: 'Máquina' },
  { id: 'qd-5', name: 'Sentadilla Hack en máquina', category: 'Cuádriceps', equipment: 'Máquina' },
  { id: 'qd-6', name: 'Sentadilla Belt Squat (Sentadilla con cinturón)', category: 'Cuádriceps', equipment: 'Máquina' },
  { id: 'qd-7', name: 'Prensa pendular', category: 'Cuádriceps', equipment: 'Máquina' },
  { id: 'qd-8', name: 'Sentadilla trasera con barra (High Bar / Low Bar)', category: 'Cuádriceps', equipment: 'Barra' },
  { id: 'qd-9', name: 'Sentadilla en máquina Smith / Multipower', category: 'Cuádriceps', equipment: 'Máquina' },
  { id: 'qd-10', name: 'Sentadilla frontal con barra (Front Squat)', category: 'Cuádriceps', equipment: 'Barra' },
  { id: 'qd-11', name: 'Sentadilla Zercher con barra en codos', category: 'Cuádriceps', equipment: 'Barra' },
  { id: 'qd-12', name: 'Sentadilla Goblet con mancuerna o pesa rusa', category: 'Cuádriceps', equipment: 'Mancuernas' },
  { id: 'qd-13', name: 'Zancadas caminantes con mancuernas (Walking Lunges)', category: 'Cuádriceps', equipment: 'Mancuernas' },
  { id: 'qd-14', name: 'Zancadas caminando con barra sobre hombros', category: 'Cuádriceps', equipment: 'Barra' },
  { id: 'qd-15', name: 'Sentadilla con talones elevados (Cyclist Squat)', category: 'Cuádriceps', equipment: 'Mancuernas' },
  { id: 'qd-16', name: 'Step-ups en cajón alto o banco con mancuernas', category: 'Cuádriceps', equipment: 'Mancuernas' },
  // Casa (Corporal, Mancuernas y Bandas)
  { id: 'qd-17', name: 'Sentadillas al aire libres (Air Squats)', category: 'Cuádriceps', equipment: 'Corporal' },
  { id: 'qd-18', name: 'Sentadillas con salto pliométricas (Jump Squats)', category: 'Cuádriceps', equipment: 'Corporal' },
  { id: 'qd-19', name: 'Sissy Squats de peso corporal', category: 'Cuádriceps', equipment: 'Corporal' },
  { id: 'qd-20', name: 'Sentadilla Búlgara con pie elevado en silla', category: 'Cuádriceps', equipment: 'Corporal' },
  { id: 'qd-21', name: 'Sentadillas Búlgaras con mancuernas', category: 'Cuádriceps', equipment: 'Mancuernas' },
  { id: 'qd-22', name: 'Pistol Squat (Sentadilla a una pierna)', category: 'Cuádriceps', equipment: 'Corporal' },
  { id: 'qd-23', name: 'Sentadilla isométrica en pared (Wall Sit)', category: 'Cuádriceps', equipment: 'Corporal' },
  { id: 'qd-24', name: 'Extensiones de pierna sentado en silla con banda', category: 'Cuádriceps', equipment: 'Bandas' },

  // ==========================================
  // 6. ISQUIOTIBIALES Y GLÚTEOS (CADENA POSTERIOR)
  // ==========================================
  // Isquiotibiales - Máquinas y Peso Libre
  { id: 'hm-1', name: 'Curl femoral acostado en máquina (Lying Leg Curl)', category: 'Isquiotibiales', equipment: 'Máquina' },
  { id: 'hm-2', name: 'Curl femoral sentado en máquina (Seated Leg Curl)', category: 'Isquiotibiales', equipment: 'Máquina' },
  { id: 'hm-3', name: 'Curl femoral de pie unilateral en máquina', category: 'Isquiotibiales', equipment: 'Máquina' },
  { id: 'hm-4', name: 'Peso muerto rumano con barra (RDL)', category: 'Isquiotibiales', equipment: 'Barra' },
  { id: 'hm-5', name: 'Peso muerto rumano con mancuernas', category: 'Isquiotibiales', equipment: 'Mancuernas' },
  { id: 'hm-6', name: 'Peso muerto rígido con barra (Stiff-Leg)', category: 'Isquiotibiales', equipment: 'Barra' },
  { id: 'hm-7', name: 'Buenos Días con barra (Good Mornings)', category: 'Isquiotibiales', equipment: 'Barra' },
  { id: 'hm-8', name: 'Curl femoral nórdico (Nordic Hamstring Curl)', category: 'Isquiotibiales', equipment: 'Corporal' },
  { id: 'hm-9', name: 'Curl femoral deslizante en piso con toalla', category: 'Isquiotibiales', equipment: 'Corporal' },
  { id: 'hm-10', name: 'Peso muerto rumano a 1 pierna con mancuerna', category: 'Isquiotibiales', equipment: 'Mancuernas' },
  { id: 'hm-11', name: 'Glute Ham Raise en máquina GHD', category: 'Isquiotibiales', equipment: 'Máquina' },

  // Glúteos - Máquinas y Peso Libre
  { id: 'gl-1', name: 'Hip Thrust con barra apoyado en banco', category: 'Glúteos', equipment: 'Barra' },
  { id: 'gl-2', name: 'Máquina de Hip Thrust específica', category: 'Glúteos', equipment: 'Máquina' },
  { id: 'gl-3', name: 'Kas Glute Bridge con barra (Rango corto)', category: 'Glúteos', equipment: 'Barra' },
  { id: 'gl-4', name: 'Patada de glúteo en polea baja con grillete', category: 'Glúteos', equipment: 'Polea' },
  { id: 'gl-5', name: 'Patada de glúteo en máquina específica (Kickback)', category: 'Glúteos', equipment: 'Máquina' },
  { id: 'gl-6', name: 'Máquina de abducción de cadera sentado', category: 'Glúteos', equipment: 'Máquina' },
  { id: 'gl-7', name: 'Abducción de cadera inclinando el torso a 45°', category: 'Glúteos', equipment: 'Máquina' },
  { id: 'gl-8', name: 'Abducción lateral de pierna en polea baja', category: 'Glúteos', equipment: 'Polea' },
  { id: 'gl-9', name: 'Hiperextensiones lumbares a 45° con espalda redonda (Glúteo)', category: 'Glúteos', equipment: 'Corporal' },
  { id: 'gl-10', name: 'Zancadas profundas con paso largo', category: 'Glúteos', equipment: 'Mancuernas' },
  // Glúteos - Casa
  { id: 'gl-11', name: 'Puente de glúteo en el piso (Glute Bridge)', category: 'Glúteos', equipment: 'Corporal' },
  { id: 'gl-12', name: 'Puente de glúteo a 1 pierna', category: 'Glúteos', equipment: 'Corporal' },
  { id: 'gl-13', name: 'Frog Pumps (Puente estilo rana en el suelo)', category: 'Glúteos', equipment: 'Corporal' },
  { id: 'gl-14', name: 'Hip Thrust apoyado en silla con mancuerna', category: 'Glúteos', equipment: 'Mancuernas' },
  { id: 'gl-15', name: 'Patadas de burro cuadrúpedas (Donkey Kicks)', category: 'Glúteos', equipment: 'Corporal' },
  { id: 'gl-16', name: 'Boca de riego cuadrúpeda (Fire Hydrants)', category: 'Glúteos', equipment: 'Corporal' },
  { id: 'gl-17', name: 'Monster Walks laterales con banda en tobillos', category: 'Glúteos', equipment: 'Bandas' },

  // ==========================================
  // 7. PANTORRILLAS (GEMELOS) Y ADUCTORES
  // ==========================================
  // Gemelos
  { id: 'cf-1', name: 'Elevación de talones de pie en máquina / Multipower', category: 'Gemelos', equipment: 'Máquina' },
  { id: 'cf-2', name: 'Elevación de talones sentado en máquina (Sóleo)', category: 'Gemelos', equipment: 'Máquina' },
  { id: 'cf-3', name: 'Elevación de talones en prensa 45°', category: 'Gemelos', equipment: 'Máquina' },
  { id: 'cf-4', name: 'Elevación de talones estilo Donkey (Burro)', category: 'Gemelos', equipment: 'Máquina' },
  { id: 'cf-5', name: 'Elevación de talones a 1 pierna sobre escalón', category: 'Gemelos', equipment: 'Corporal' },
  { id: 'cf-6', name: 'Elevación de talones sentado con peso en rodillas', category: 'Gemelos', equipment: 'Mancuernas' },
  { id: 'cf-7', name: 'Elevaciones tibiales contra pared (Tibialis Raises)', category: 'Gemelos', equipment: 'Corporal' },

  // Aductores
  { id: 'ad-1', name: 'Máquina de aducción de cadera sentado', category: 'Aductores', equipment: 'Máquina' },
  { id: 'ad-2', name: 'Sentadilla Sumo con barra o mancuerna', category: 'Aductores', equipment: 'Barra' },
  { id: 'ad-3', name: 'Sentadilla Cossack (Desplazamientos laterales)', category: 'Aductores', equipment: 'Corporal' },
  { id: 'ad-4', name: 'Zancadas laterales con mancuerna', category: 'Aductores', equipment: 'Mancuernas' },
  { id: 'ad-5', name: 'Aducción de Copenhague en banco (Copenhagen Plank)', category: 'Aductores', equipment: 'Corporal' },
  { id: 'ad-6', name: 'Aducción en polea baja con grillete', category: 'Aductores', equipment: 'Polea' },

  // ==========================================
  // 8. ABDOMEN Y ZONA CORE
  // ==========================================
  // Gimnasio (Poleas y Peso)
  { id: 'ab-1', name: 'Crunch en polea alta con cuerda (Rope Crunch)', category: 'Abdomen', equipment: 'Polea' },
  { id: 'ab-2', name: 'Giros rusos en polea (Woodchoppers rotacionales)', category: 'Abdomen', equipment: 'Polea' },
  { id: 'ab-3', name: 'Press Pallof anti-rotación en polea', category: 'Abdomen', equipment: 'Polea' },
  { id: 'ab-4', name: 'Elevación de piernas colgado en barra de dominadas', category: 'Abdomen', equipment: 'Corporal' },
  { id: 'ab-5', name: 'Pies a la barra de dominadas (Toes to Bar)', category: 'Abdomen', equipment: 'Corporal' },
  { id: 'ab-6', name: 'Elevación de piernas o rodillas en silla romana', category: 'Abdomen', equipment: 'Máquina' },
  { id: 'ab-7', name: 'Crunch en banco declinado con disco en pecho', category: 'Abdomen', equipment: 'Accesorio' },
  { id: 'ab-8', name: 'Dragon Flags en banco horizontal', category: 'Abdomen', equipment: 'Corporal' },
  // Casa (Corporal, Mancuernas y Bandas)
  { id: 'ab-9', name: 'Encogimientos abdominales tradicionales (Crunches)', category: 'Abdomen', equipment: 'Corporal' },
  { id: 'ab-10', name: 'Crunches invertidos (Elevación de pelvis)', category: 'Abdomen', equipment: 'Corporal' },
  { id: 'ab-11', name: 'Abdominales Navaja / V-Ups en el suelo', category: 'Abdomen', equipment: 'Corporal' },
  { id: 'ab-12', name: 'Rueda abdominal (Ab Wheel Rollout)', category: 'Abdomen', equipment: 'Accesorio' },
  { id: 'ab-13', name: 'Plancha isométrica frontal (Plank)', category: 'Abdomen', equipment: 'Corporal' },
  { id: 'ab-14', name: 'Plancha lateral isométrica o con rotación', category: 'Abdomen', equipment: 'Corporal' },
  { id: 'ab-15', name: 'Plancha con toques de hombro alternos', category: 'Abdomen', equipment: 'Corporal' },
  { id: 'ab-16', name: 'Escaladores en el suelo (Mountain Climbers)', category: 'Abdomen', equipment: 'Corporal' },
  { id: 'ab-17', name: 'Bicicletas abdominales cruzadas (Bicycle Crunches)', category: 'Abdomen', equipment: 'Corporal' },
  { id: 'ab-18', name: 'Hollow Body Hold (Isométrico de gimnasta)', category: 'Abdomen', equipment: 'Corporal' },
  { id: 'ab-19', name: 'Press Pallof con banda de resistencia anclada', category: 'Abdomen', equipment: 'Bandas' },
  { id: 'ab-20', name: 'Bird-Dog (Perro de caza para estabilidad lumbar)', category: 'Abdomen', equipment: 'Corporal' }
];
