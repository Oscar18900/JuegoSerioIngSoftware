import React, { useState, useEffect, useRef, useCallback } from 'react';

// ─── DATOS DEL JUEGO ───────────────────────────────────────────────────────────
// Para hacer los demás niveles, copia este archivo y cambia solo este bloque.
// Ajusta NOMBRE_PROYECTO, PREGUNTAS y los rangos si quieres.
const NOMBRE_PROYECTO = 'Equipo de Soporte';

const PREGUNTAS = [
  {
    texto: '¿Cuál es el principio fundamental del flujo en Kanban?',
    opciones: [
      { texto: 'Planificar todo el trabajo antes de empezar cualquier tarea', correcto: false, feedback: 'La planificación total previa es característica de Cascada. Kanban se enfoca en gestionar el flujo continuo de trabajo existente.' },
      { texto: 'Visualizar el trabajo, limitar el trabajo en progreso y maximizar el flujo', correcto: true, feedback: 'Los tres pilares de Kanban: ver el trabajo, limitar cuánto está en curso simultáneamente y lograr que las tareas fluyan sin bloqueos.' },
      { texto: 'Dividir el trabajo en sprints de duración fija', correcto: false, feedback: 'Los sprints de duración fija son de Scrum. Kanban trabaja con flujo continuo sin iteraciones delimitadas.' },
      { texto: 'Asignar tareas individuales a cada miembro del equipo por orden de llegada', correcto: false, feedback: 'Kanban no prescribe asignación individual obligatoria. El equipo pull el trabajo según capacidad.' },
    ],
  },
  {
    texto: '¿Qué es un límite WIP (Work In Progress) en Kanban?',
    opciones: [
      { texto: 'El número máximo de desarrolladores que pueden trabajar en paralelo', correcto: false, feedback: 'El WIP no limita personas sino tareas. Limitar cuántas tareas pueden estar activas en cada columna del tablero.' },
      { texto: 'El tiempo máximo que una tarea puede estar en el tablero sin completarse', correcto: false, feedback: 'Eso sería un tiempo de ciclo máximo. El WIP limit restringe la cantidad de items simultáneos, no el tiempo.' },
      { texto: 'La cantidad máxima de tareas que pueden estar en progreso simultáneamente en una columna', correcto: true, feedback: 'El WIP limit es clave en Kanban: al limitar cuántas tareas están activas, se fuerza a terminar antes de empezar nuevas, mejorando el flujo.' },
      { texto: 'El porcentaje máximo de capacidad del servidor permitido en producción', correcto: false, feedback: 'WIP es Work In Progress, un concepto de gestión de flujo, no de infraestructura técnica.' },
    ],
  },
  {
    texto: '¿Cuál es el propósito principal del tablero Kanban?',
    opciones: [
      { texto: 'Registrar las horas trabajadas por cada miembro del equipo', correcto: false, feedback: 'El tablero Kanban no es un timesheet. Su propósito es hacer visible el flujo de trabajo y sus bloqueos.' },
      { texto: 'Visualizar el estado de todo el trabajo y detectar cuellos de botella', correcto: true, feedback: 'La visualización es el primer principio de Kanban. El tablero revela dónde se acumula el trabajo y qué columnas están saturadas.' },
      { texto: 'Planificar las funcionalidades del producto para los próximos 3 meses', correcto: false, feedback: 'La planificación a largo plazo no es el objetivo del tablero. Kanban se enfoca en el flujo actual, no en road maps fijos.' },
      { texto: 'Documentar las decisiones técnicas tomadas durante el desarrollo', correcto: false, feedback: 'La documentación técnica se gestiona en otras herramientas. El tablero Kanban gestiona el flujo de tareas.' },
    ],
  },
  {
    texto: '¿Qué significa que una tarjeta esté "bloqueada" en el tablero Kanban?',
    opciones: [
      { texto: 'Que la tarea fue cancelada y no debe completarse', correcto: false, feedback: 'Una tarea cancelada se elimina del tablero. Una tarjeta bloqueada sigue siendo necesaria pero no puede avanzar.' },
      { texto: 'Que la tarea tiene mayor prioridad y no puede moverse hasta que el manager la apruebe', correcto: false, feedback: 'El bloqueo en Kanban no indica prioridad. Indica que algo externo impide avanzar: una dependencia, una decisión pendiente, etc.' },
      { texto: 'Que existe un impedimento externo que impide que la tarea avance en el flujo', correcto: true, feedback: 'Una tarjeta bloqueada señala que el equipo no puede progresar por causa externa. Debe resolverse urgentemente para no paralizar el flujo.' },
      { texto: 'Que la tarea está siendo revisada y nadie más puede modificarla', correcto: false, feedback: 'Una tarea en revisión avanza a la columna "En Revisión". El bloqueo es un estado especial que indica impedimento externo.' },
    ],
  },
  {
    texto: '¿Qué es el Tiempo de Ciclo (Cycle Time) en Kanban?',
    opciones: [
      { texto: 'El tiempo total que tarda un proyecto desde su inicio hasta su entrega final', correcto: false, feedback: 'Eso sería el Lead Time total del proyecto. El Cycle Time mide el tiempo de una sola tarea desde que empieza hasta que termina.' },
      { texto: 'El tiempo que transcurre desde que una tarea comienza hasta que se completa', correcto: true, feedback: 'El Cycle Time es la métrica de eficiencia más importante en Kanban. Reducirlo es el objetivo principal de la mejora del flujo.' },
      { texto: 'El tiempo entre reuniones de planificación del equipo', correcto: false, feedback: 'Kanban no prescribe reuniones periódicas obligatorias. El Cycle Time mide duración de tareas individuales, no intervalos entre reuniones.' },
      { texto: 'La duración fija de cada iteración de trabajo del equipo', correcto: false, feedback: 'Las iteraciones de duración fija son los sprints de Scrum. En Kanban el flujo es continuo y el Cycle Time varía por tarea.' },
    ],
  },
  {
    texto: '¿Cómo responde el equipo Kanban cuando una columna alcanza su límite WIP?',
    opciones: [
      { texto: 'Agrega más personas al equipo para aumentar la capacidad de esa columna', correcto: false, feedback: 'Agregar personas no resuelve el problema sistémico. El WIP limit indica que hay que terminar trabajo existente antes de comenzar nuevo.' },
      { texto: 'Ignora el límite si la tarea nueva es de alta prioridad', correcto: false, feedback: 'Ignorar el WIP limit destruye el sistema Kanban. El límite existe precisamente para proteger el flujo, incluso con trabajo urgente.' },
      { texto: 'Deja de iniciar nuevas tareas y ayuda a terminar las que están en progreso en esa columna', correcto: true, feedback: 'Stop starting, start finishing. Cuando se alcanza el WIP limit, el equipo colabora para desbloquear y completar el trabajo existente.' },
      { texto: 'Mueve las tareas más antiguas de vuelta a "Por Hacer" para liberar espacio', correcto: false, feedback: 'Retroceder tareas interrumpe el flujo y desperdicia trabajo. La solución es terminar, no retroceder.' },
    ],
  },
  {
    texto: '¿Cuál es la diferencia principal entre Kanban y Scrum en la gestión del tiempo?',
    opciones: [
      { texto: 'Kanban usa sprints de 2 semanas mientras Scrum usa sprints de 4 semanas', correcto: false, feedback: 'Ambos tienen la duración invertida en tu respuesta, y más importante: Kanban no usa sprints en absoluto.' },
      { texto: 'Kanban opera con flujo continuo sin iteraciones fijas; Scrum trabaja en sprints de duración definida', correcto: true, feedback: 'Esta es la diferencia central. Kanban es pull continuo sin timeboxes. Scrum divide el tiempo en sprints con compromisos definidos.' },
      { texto: 'Kanban tiene fechas de entrega fijas; Scrum entrega cuando el equipo lo decide', correcto: false, feedback: 'Es al revés. Scrum tiene la fecha fija del sprint. Kanban entrega continuamente conforme se completan las tareas.' },
      { texto: 'No hay diferencia, ambos gestionan el tiempo de la misma manera', correcto: false, feedback: 'La gestión del tiempo es precisamente una de sus mayores diferencias: timeboxed vs. flujo continuo.' },
    ],
  },
  {
    texto: '¿Qué es el concepto "pull" en el contexto de Kanban?',
    opciones: [
      { texto: 'El manager asigna (empuja) tareas a los desarrolladores según disponibilidad', correcto: false, feedback: 'Eso es un sistema "push", lo contrario de Kanban. En pull, el equipo toma trabajo cuando tiene capacidad, no cuando se lo asignan.' },
      { texto: 'El equipo retira tareas del backlog solo cuando tiene capacidad real para procesarlas', correcto: true, feedback: 'El sistema pull es la esencia de Kanban: nadie te impone trabajo. El equipo jala tareas cuando puede terminarlas, evitando la sobrecarga.' },
      { texto: 'Los usuarios finales solicitan directamente las funcionalidades que necesitan al equipo', correcto: false, feedback: 'Eso describe una forma de captura de requisitos. El pull en Kanban es sobre cuándo el equipo inicia el trabajo, no quién lo solicita.' },
      { texto: 'El equipo retira del tablero las tareas que llevan más de 30 días sin completarse', correcto: false, feedback: 'Eliminar tareas antiguas puede ser una práctica de mantenimiento, pero no es la definición del sistema pull en Kanban.' },
    ],
  },
];

const TIEMPO_LIMITE = 15;
const PUNTOS_BASE = 100;
const DANIO_NORMAL = 15;
const DANIO_DOBLE = 30;

function saveHighScore(proyectoId, puntos) {
  try {
    const key = `hs_${proyectoId}`;
    const prev = parseInt(localStorage.getItem(key) || '0', 10);
    if (puntos > prev) localStorage.setItem(key, puntos.toString());
  } catch {}
}

function calcularPuntos(tiempoRestante) {
  return PUNTOS_BASE + Math.floor((tiempoRestante / TIEMPO_LIMITE) * 50);
}

function getRango(score) {
  if (score >= 700) return { label: 'ORO',    color: 'text-yellow-400', symbol: '🥇', desc: 'Flujo perfecto. El tablero nunca se bloqueó.' };
  if (score >= 400) return { label: 'PLATA',  color: 'text-slate-300',  symbol: '🥈', desc: 'Algunos bloqueos, pero el sistema aguantó.' };
  return                   { label: 'BRONCE', color: 'text-orange-400', symbol: '🥉', desc: 'Demasiados cuellos de botella. Revisa tu WIP.' };
}

// ─────────────────────────────────────────────────────────────────────────────

export default function KanbanP1({ goToScreen, playHoverSound, mainAudioRef }) {
  const [etapa, setEtapa] = useState('countdown');
  const [countdown, setCountdown] = useState(3);

  const [preguntaIdx, setPreguntaIdx] = useState(0);
  const [vida, setVida] = useState(100);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [tiempoRestante, setTiempoRestante] = useState(TIEMPO_LIMITE);
  const [dañoDoble, setDañoDoble] = useState(false);
  const [procesando, setProcesando] = useState(false); // bloqueo breve tras responder

  const [feedback, setFeedback] = useState(null);
  const [centerPopup, setCenterPopup] = useState(null);
  const [screenFlash, setScreenFlash] = useState(null);
  const [shakeHUD, setShakeHUD] = useState(false);

  const timerRef = useRef(null);
  const floatingTimer = useRef(null);
  const flashTimer = useRef(null);

  const preguntaActual = PREGUNTAS[preguntaIdx];

  // ── Música fondokanban ──
  useEffect(() => {
    const main = mainAudioRef?.current;
    if (main) {
      main.pause();
      main.volume = 0;
    }

    const audio = new Audio('/fondokanban.mp3');
    audio.loop = true;
    audio.volume = 0;
    audio.play().catch(() => {});

    const iv = setInterval(() => {
      if (main) main.volume = 0;
      if (audio.volume < 0.09) audio.volume = Math.min(0.1, audio.volume + 0.01);
      else clearInterval(iv);
    }, 80);

    return () => {
      clearInterval(iv);
      audio.pause();
      audio.currentTime = 0;
      if (main) {
        main.play().catch(() => {});
        const fadeInMain = setInterval(() => {
          if (main.volume < 0.09) main.volume = Math.min(0.1, main.volume + 0.01);
          else clearInterval(fadeInMain);
        }, 80);
      }
    };
  }, [mainAudioRef]);

  // ── Sonidos ──
  const playCorrecta    = () => { try { const a = new Audio('/correcta.mp3');    a.volume = 0.6; a.play(); } catch {} };
  const playIncorrecta  = () => { try { const a = new Audio('/incorrecta.mp3');  a.volume = 0.6; a.play(); } catch {} };
  const playTemporizador = () => { try { const a = new Audio('/temporizador.mp3'); a.volume = 0.5; a.play(); } catch {} };

  // ── Countdown ──
  useEffect(() => {
    if (etapa !== 'countdown') return;
    if (countdown === 3) playTemporizador();
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => setEtapa('pregunta'), 500);
      return () => clearTimeout(t);
    }
  }, [etapa, countdown]);

  // ── Timer: si llega a 0 activa daño doble y se reinicia ──
  useEffect(() => {
    if (etapa !== 'pregunta' || procesando) return;
    if (tiempoRestante <= 0) {
      // Activar daño doble y resetear timer sin cambiar pregunta
      setDañoDoble(true);
      setTiempoRestante(TIEMPO_LIMITE);
      setCenterPopup({ lines: ['⚡ DAÑO DOBLE'], correcto: false, key: Date.now() });
      setScreenFlash('incorrect');
      clearTimeout(flashTimer.current);
      flashTimer.current = setTimeout(() => setScreenFlash(null), 600);
      clearTimeout(floatingTimer.current);
      floatingTimer.current = setTimeout(() => setCenterPopup(null), 1400);
      return;
    }
    timerRef.current = setTimeout(() => setTiempoRestante(t => t - 1), 1000);
    return () => clearTimeout(timerRef.current);
  }, [etapa, tiempoRestante, procesando]);

  // ── Respuesta ──
  const handleRespuesta = useCallback((opcionIdx) => {
    if (procesando || etapa !== 'pregunta') return;
    clearTimeout(timerRef.current);
    setProcesando(true);

    const opcion = preguntaActual.opciones[opcionIdx];
    const correcto = opcion.correcto;

    if (correcto) {
      const puntos = calcularPuntos(tiempoRestante);
      const nuevoCombo = combo + 1;
      const bonusCombo = nuevoCombo >= 3 ? Math.floor(puntos * 0.2) : 0;
      const total = puntos + bonusCombo;
      setScore(s => s + total);
      setCombo(nuevoCombo);
      setDañoDoble(false); // ← desactiva daño doble al acertar
      playCorrecta();

      const lines = [`+${total} pts`];
      if (dañoDoble) lines.push('✅ FLUJO RESTAURADO');
      else if (nuevoCombo >= 3) lines.push(`🔥 COMBO ×${nuevoCombo}`);
      setCenterPopup({ lines, correcto: true, key: Date.now() });
      setScreenFlash('correct');
      setFeedback({ texto: opcion.feedback, correcto: true });

      clearTimeout(flashTimer.current);
      flashTimer.current = setTimeout(() => setScreenFlash(null), 600);
      clearTimeout(floatingTimer.current);
      floatingTimer.current = setTimeout(() => setCenterPopup(null), 1400);

      setTimeout(() => {
        setFeedback(null);
        if (preguntaIdx >= PREGUNTAS.length - 1) {
          setEtapa('resultado');
        } else {
          setPreguntaIdx(p => p + 1);
          setTiempoRestante(TIEMPO_LIMITE); // ← el tiempo se regenera al acertar
          setProcesando(false);
        }
      }, 2000);

    } else {
      // Respuesta incorrecta: daño (doble si está activo), misma pregunta
      const danio = dañoDoble ? DANIO_DOBLE : DANIO_NORMAL;
      const nuevaVida = Math.max(0, vida - danio);
      setVida(nuevaVida);
      setCombo(0);
      playIncorrecta();

      const popupText = dañoDoble ? `⚡ -${danio} pts` : 'INCORRECTO';
      setCenterPopup({ lines: [popupText], correcto: false, key: Date.now() });
      setScreenFlash('incorrect');
      setShakeHUD(true);
      setTimeout(() => setShakeHUD(false), 500);
      setFeedback({ texto: opcion.feedback, correcto: false });

      clearTimeout(flashTimer.current);
      flashTimer.current = setTimeout(() => setScreenFlash(null), 600);
      clearTimeout(floatingTimer.current);
      floatingTimer.current = setTimeout(() => setCenterPopup(null), 1400);

      if (nuevaVida <= 0) {
        setTimeout(() => goToScreen('gameover', { score, vida: 0, proyectoOrigen: 'kanbanP1' }), 2000);
        return;
      }

      // Quedarse en la misma pregunta — el timer continúa desde donde estaba
      setTimeout(() => {
        setFeedback(null);
        setProcesando(false); // el timer reanuda al desbloquear
      }, 2000);
    }
  }, [procesando, etapa, preguntaActual, tiempoRestante, combo, vida, dañoDoble, preguntaIdx, score]);

  useEffect(() => {
    if (etapa === 'resultado') saveHighScore('kanbanP1', score);
  }, [etapa]);

  const rango = getRango(score);
  const porcentajeVida = Math.max(0, vida);
  const porcentajeTiempo = (tiempoRestante / TIEMPO_LIMITE) * 100;
  const timerColor = dañoDoble ? 'bg-red-500' : tiempoRestante > 8 ? 'bg-purple-500' : tiempoRestante > 4 ? 'bg-yellow-500' : 'bg-red-500';
  const vidaColor = vida > 60 ? 'bg-green-500' : vida > 30 ? 'bg-yellow-500' : 'bg-red-500';

  // ── COUNTDOWN ──
  if (etapa === 'countdown') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
        <p className="text-slate-400 text-xs uppercase tracking-widest mb-6">
          Proyecto 1 — {NOMBRE_PROYECTO}
        </p>
        {countdown > 0 ? (
          <div key={countdown} className="text-9xl font-black text-white animate-ping-once drop-shadow-[0_0_40px_rgba(255,255,255,0.5)]">
            {countdown}
          </div>
        ) : (
          <div className="text-5xl font-black text-purple-400 uppercase tracking-widest animate-fade-in">¡COMIENZA!</div>
        )}
      </div>
    );
  }

  // ── RESULTADO FINAL ──
  if (etapa === 'resultado') {
    return (
      <div className="max-w-2xl w-full px-4 py-10 flex flex-col items-center animate-fade-in">
        <p className="text-slate-500 text-xs uppercase tracking-[0.3em] mb-2">Proyecto completado</p>
        <h1 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter mb-1">Equipo de</h1>
        <h1 className="text-4xl md:text-5xl font-black text-purple-400 uppercase italic tracking-tighter mb-8">Soporte</h1>

        <div className="w-full grid grid-cols-2 gap-4 mb-8">
          <div className="border border-white/10 rounded-lg px-4 py-4 bg-slate-900/50 text-center">
            <p className="text-slate-500 text-xs uppercase tracking-widest mb-1">Integridad final</p>
            <p className={`text-3xl font-black ${vida > 60 ? 'text-green-400' : vida > 30 ? 'text-yellow-400' : 'text-red-400'}`}>{vida}%</p>
          </div>
          <div className="border border-white/10 rounded-lg px-4 py-4 bg-slate-900/50 text-center">
            <p className="text-slate-500 text-xs uppercase tracking-widest mb-1">Puntuación</p>
            <p className="text-3xl font-black text-white">{score.toLocaleString()}</p>
          </div>
        </div>

        <div className={`w-full border-2 rounded-lg px-6 py-6 text-center mb-8
          ${rango.label === 'ORO' ? 'border-yellow-400/50 bg-yellow-950/20'
          : rango.label === 'PLATA' ? 'border-slate-400/50 bg-slate-800/20'
          : 'border-orange-700/50 bg-orange-950/20'}`}>
          <p className="text-4xl mb-2">{rango.symbol}</p>
          <p className={`text-2xl font-black uppercase tracking-widest ${rango.color}`}>RANGO {rango.label}</p>
          <p className="text-slate-400 text-sm mt-1">{rango.desc}</p>
        </div>

        <div className="flex flex-col gap-3 w-full max-w-xs">
          <button onMouseEnter={playHoverSound} onClick={() => goToScreen('kanbanP1')}
            className="w-full py-3 bg-white text-black font-black text-sm uppercase tracking-widest rounded-sm hover:bg-purple-400 transition-colors duration-150">
            Jugar de nuevo
          </button>
          <button onMouseEnter={playHoverSound} onClick={() => goToScreen('kanban')}
            className="w-full py-3 bg-transparent border border-white/30 text-slate-300 font-black text-sm uppercase tracking-widest rounded-sm transition-colors duration-150 hover:border-white/60 hover:text-white">
            Seleccionar otro proyecto
          </button>
          <button onMouseEnter={playHoverSound} onClick={() => goToScreen('menu')}
            className="w-full py-2 text-slate-500 text-xs uppercase tracking-widest hover:text-slate-300 transition-colors">
            ← Menú Principal
          </button>
        </div>
      </div>
    );
  }

  // ── PREGUNTA ──
  return (
    <div className="max-w-2xl w-full px-4 py-6 flex flex-col items-center animate-fade-in relative self-start mt-8">

      {/* Flash de pantalla */}
      {screenFlash && (
        <div className={`fixed inset-0 pointer-events-none z-30
          ${screenFlash === 'correct' ? 'bg-green-500/10' : 'bg-red-500/10'}`}
        />
      )}

      {/* Popup central */}
      {centerPopup && (
        <div key={centerPopup.key} className="fixed inset-0 pointer-events-none z-40">
          {centerPopup.lines.map((line, i) => (
            <div
              key={i}
              className={`animate-bounce-in-center font-black uppercase tracking-widest select-none
                ${i === 0
                  ? (centerPopup.correcto ? 'text-green-400' : 'text-red-400')
                  : centerPopup.correcto ? 'text-purple-400' : 'text-orange-400'
                }`}
              style={{
                position: 'absolute',
                top: centerPopup.lines.length === 1 ? '47%' : (i === 0 ? '40%' : '58%'),
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontSize: i === 0 ? 'clamp(3rem, 10vw, 5.5rem)' : 'clamp(1.2rem, 4vw, 2rem)',
                animationDelay: `${i * 0.09}s`,
                textShadow: centerPopup.correcto
                  ? '0 0 50px rgba(74,222,128,0.7), 0 4px 20px rgba(0,0,0,0.9)'
                  : '0 0 50px rgba(248,113,113,0.7), 0 4px 20px rgba(0,0,0,0.9)',
              }}
            >
              {line}
            </div>
          ))}
        </div>
      )}

      {/* HUD superior */}
      <div className={`w-full mb-5 space-y-2 ${shakeHUD ? 'animate-shake' : ''}`}>

        {/* Fila superior: label + daño doble badge + combo */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-widest text-purple-400">
            FLUJO CONTINUO — {preguntaIdx + 1}/{PREGUNTAS.length}
          </span>
          <div className="flex items-center gap-2">
            {dañoDoble && (
              <span className="text-xs font-black uppercase tracking-widest text-red-400 animate-pulse bg-red-950/40 border border-red-500/50 px-2 py-0.5 rounded">
                ⚡ DAÑO ×2
              </span>
            )}
            {combo >= 2 && !dañoDoble && (
              <span className="text-xs font-black uppercase tracking-widest text-orange-400 animate-pulse">
                🔥 COMBO ×{combo}
              </span>
            )}
          </div>
        </div>

        {/* Barra de progreso de preguntas */}
        <div className="flex gap-1 items-center">
          {PREGUNTAS.map((_, qi) => (
            <div
              key={qi}
              className={`h-1.5 flex-1 rounded-full transition-all duration-300
                ${qi < preguntaIdx ? 'bg-purple-500' : qi === preguntaIdx ? 'bg-white' : 'bg-slate-700'}`}
            />
          ))}
        </div>

        {/* Vida */}
        <div>
          <div className="flex justify-between text-xs text-white mb-1">
            <span className="uppercase tracking-wider font-semibold">Integridad</span>
            <span className={`font-black ${vida <= 30 ? 'text-red-400 animate-pulse' : ''}`}>{vida}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
            <div className={`h-full ${vidaColor} transition-all duration-500 rounded-full`} style={{ width: `${porcentajeVida}%` }} />
          </div>
        </div>

        {/* Tiempo — se vuelve rojo y pulsa cuando hay daño doble */}
        <div>
          <div className="flex justify-between text-xs text-white mb-1">
            <span className={`uppercase tracking-wider font-semibold ${dañoDoble ? 'text-red-400' : ''}`}>
              {dañoDoble ? '⚡ Tiempo (Daño ×2 activo)' : 'Tiempo'}
            </span>
            <span className={`font-black ${(tiempoRestante <= 5 || dañoDoble) ? 'text-red-400 animate-pulse' : ''}`}>
              {tiempoRestante}s
            </span>
          </div>
          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full ${timerColor} transition-all duration-1000 rounded-full ${dañoDoble ? 'animate-pulse' : ''}`}
              style={{ width: `${porcentajeTiempo}%` }}
            />
          </div>
        </div>

        {/* Score */}
        <div className="flex justify-between items-center">
          <span className="text-xs text-white uppercase tracking-wider font-semibold">Puntuación</span>
          <span className="text-sm font-black text-white">{score.toLocaleString()} pts</span>
        </div>
      </div>

      {/* Pregunta */}
      <div key={preguntaIdx} className="w-full animate-fade-in flex flex-col items-center">
        <div className={`relative w-full border-l-4 ${dañoDoble ? 'border-red-500' : 'border-purple-500'} pl-5 pr-4 py-5 bg-slate-900/60 rounded-r-lg mb-5 transition-colors duration-300`}>
          <p className="text-white font-bold text-xl md:text-2xl leading-relaxed">
            {preguntaActual.texto}
          </p>
        </div>

        {/* Opciones — sin scale, sin disabled: el jugador puede seguir intentando */}
        {preguntaActual.opciones.map((op, i) => {
          // Highlight solo la opción correcta tras responder correctamente
          let estilo = 'border-white/20 text-slate-200 hover:border-purple-400/60';
          if (procesando && feedback?.correcto) {
            estilo = op.correcto
              ? 'border-green-500 bg-green-950/40 text-green-300'
              : 'border-white/10 text-slate-500';
          }
          return (
            <button key={i}
              onMouseEnter={!procesando ? playHoverSound : undefined}
              onClick={() => handleRespuesta(i)}
              disabled={procesando}
              className={`w-full text-left px-4 py-3.5 border rounded-lg text-base font-bold transition-colors duration-150
                ${procesando ? 'cursor-default' : ''} ${estilo}`}
            >
              <span className="text-slate-500 mr-2 font-black">{['A', 'B', 'C', 'D'][i]})</span>
              {op.texto}
            </button>
          );
        })}
      </div>

      {/* Feedback Metto */}
      {feedback && (
        <div className={`w-full flex gap-3 items-start p-4 rounded-lg border animate-fade-in mt-4
          ${feedback.correcto ? 'border-green-500/40 bg-green-950/30' : 'border-red-500/40 bg-red-950/30'}`}>
          <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-white/20">
            <img src="/metto.gif" alt="Metto" className="w-full h-full object-cover" onError={e => e.target.style.display = 'none'} />
          </div>
          <div>
            <p className={`text-xs font-black uppercase tracking-wider mb-1 ${feedback.correcto ? 'text-green-400' : 'text-red-400'}`}>
              {feedback.correcto ? '[ÉXITO] ¡Flujo restaurado!' : '[BLOQUEO] ¡Cuello de botella detectado!'}
            </p>
            <p className="text-slate-300 text-sm">{feedback.texto}</p>
          </div>
        </div>
      )}

    </div>
  );
}