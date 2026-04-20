import React, { useState, useEffect, useRef, useCallback } from 'react';

// ─── DATOS DEL JUEGO ───────────────────────────────────────────────────────────
// Para hacer los demás niveles, copia este archivo y cambia solo este bloque.
// Ajusta NOMBRE_PROYECTO, PREGUNTAS y los rangos si quieres.
const NOMBRE_PROYECTO = 'Software Empresarial ERP';

const PREGUNTAS = [
  {
    texto: 'El Vicepresidente de Operaciones exige que el equipo comience a trabajar en 10 nuevos módulos financieros inmediatamente, pero el tablero Kanban muestra que la columna "En Desarrollo" está al límite de su WIP. ¿Qué se debe hacer?',
    opciones: [
      { texto: 'Aumentar el límite WIP a 10 para acomodar las peticiones del Vicepresidente', correcto: false, feedback: 'Alterar los límites WIP por presión política destruye el sistema. El equipo colapsará bajo el cambio de contexto continuo.' },
      { texto: 'Ignorar el límite WIP temporalmente porque es una orden ejecutiva', correcto: false, feedback: 'En Kanban, el WIP es una restricción dura para proteger el flujo. Ignorarlo es volver al caos corporativo tradicional.' },
      { texto: 'Explicar que el sistema es "Pull" y las tareas entrarán cuando haya capacidad, priorizándolas en la columna "Por Hacer"', correcto: true, feedback: 'Proteger el flujo es vital. El VP puede priorizar esos módulos en el tope del Backlog, pero el equipo solo los "jalará" (Pull) cuando terminen lo que ya tienen en curso.' },
      { texto: 'Asignar las 10 tareas a los programadores junior para que no afecten a los senior', correcto: false, feedback: 'Sobrecargar a cualquier miembro del equipo rompe el principio de limitar el trabajo en progreso a nivel del sistema.' },
    ],
  },
  {
    texto: 'Una nueva regulación fiscal entrará en vigor el 1 de enero. Si el software no la cumple para esa fecha, la empresa enfrentará multas millonarias. ¿Cómo se clasifica esta tarea en el tablero Kanban?',
    opciones: [
      { texto: 'Como una tarea Estándar, pero con una nota adhesiva roja', correcto: false, feedback: 'Las notas adhesivas no cambian formalmente cómo el sistema procesa la tarea frente a otras prioridades.' },
      { texto: 'Clase de Servicio de "Fecha Fija" (Fixed Date), lo que dicta un tratamiento especial en el flujo', correcto: true, feedback: 'Las Clases de Servicio en Kanban ayudan a gestionar el riesgo. Una tarea de "Fecha Fija" tiene una prioridad que escala conforme se acerca la fecha crítica.' },
      { texto: 'Clase de Servicio "Expedite" (Vía Rápida / Urgencia Inmediata)', correcto: false, feedback: 'Expedite es para incidentes críticos actuales (ej. el servidor se quemó hoy). Si la fecha límite es a futuro, es Fecha Fija.' },
      { texto: 'Se mantiene fuera del tablero hasta el 31 de diciembre para no estorbar', correcto: false, feedback: 'Ocultar trabajo crítico garantiza el fracaso del proyecto.' },
    ],
  },
  {
    texto: 'El equipo de desarrollo terminó un parche crítico, pero no puede avanzar a producción porque el Departamento de Seguridad externa tarda 2 semanas en hacer su auditoría. ¿Cómo se refleja esto en Kanban?',
    opciones: [
      { texto: 'Se regresa la tarea a la columna "Por Hacer" para que no ocupe espacio', correcto: false, feedback: 'El trabajo nunca retrocede. Ocultar el problema evita que se solucione.' },
      { texto: 'Se marca la tarjeta visualmente como "Bloqueada" (Impedimento) en su columna actual y se mide el tiempo de bloqueo', correcto: true, feedback: 'Hacer visible el bloqueo es fundamental. Medir cuánto tiempo se pierde esperando a Seguridad justifica la necesidad sistémica de mejorar ese proceso.' },
      { texto: 'El equipo de desarrollo se salta la auditoría por el bien del flujo', correcto: false, feedback: 'Kanban respeta las políticas explícitas y la calidad. Saltarse la seguridad corporativa es inaceptable.' },
      { texto: 'Se oculta el tablero Kanban hasta que Seguridad termine', correcto: false, feedback: 'La transparencia total es un principio innegociable de Kanban.' },
    ],
  },
  {
    texto: 'El cliente corporativo tiene un SLA (Acuerdo de Nivel de Servicio) que dicta que cualquier defecto crítico debe resolverse en menos de 48 horas desde que se reporta. ¿Qué métrica de Kanban monitorea este contrato?',
    opciones: [
      { texto: 'El Lead Time (Tiempo de Entrega total)', correcto: true, feedback: 'El Lead Time mide exactamente el tiempo desde el compromiso con el cliente (se levanta el ticket) hasta la entrega del valor (se resuelve el bug en producción).' },
      { texto: 'El Cycle Time de la columna de Pruebas', correcto: false, feedback: 'El Cycle Time solo mediría una parte del proceso (ej. cuánto tardó el programador), pero al cliente le importa el tiempo total (Lead Time).' },
      { texto: 'El Diagrama de Flujo Acumulado (CFD)', correcto: false, feedback: 'El CFD muestra la salud general del flujo y los cuellos de botella, no el tiempo específico de resolución de una sola tarjeta.' },
      { texto: 'El límite WIP de la columna de "Urgencias"', correcto: false, feedback: 'El WIP es una restricción de capacidad, no una métrica de tiempo de respuesta.' },
    ],
  },
  {
    texto: 'Al analizar el Diagrama de Flujo Acumulado (CFD) del último trimestre, notas que la banda correspondiente a la columna "Integración QA" se está haciendo cada vez más ancha. ¿Qué significa empíricamente?',
    opciones: [
      { texto: 'Que el equipo de QA está trabajando cada vez más rápido', correcto: false, feedback: 'Si trabajaran más rápido, la banda se mantendría estrecha porque el trabajo fluiría. Una banda que se ensancha significa acumulación.' },
      { texto: 'Que la calidad del código de los desarrolladores es perfecta', correcto: false, feedback: 'El CFD no mide la calidad del código, mide el flujo de las tarjetas.' },
      { texto: 'Que hay un cuello de botella grave en QA; el trabajo llega más rápido de lo que logran probarlo', correcto: true, feedback: 'El ensanchamiento de una banda en el CFD es la evidencia visual irrefutable de que el trabajo se está atascando en esa etapa específica del proceso.' },
      { texto: 'Que es necesario contratar más gerentes de proyecto', correcto: false, feedback: 'Contratar gerentes no resuelve la falta de capacidad técnica en la etapa de pruebas.' },
    ],
  },
  {
    texto: 'Un programador mueve una tarjeta de "Desarrollo" directamente a "Despliegue", saltándose la columna "Code Review" porque "es un cambio de una sola línea". ¿Qué principio de Kanban violó?',
    opciones: [
      { texto: 'El Sistema Pull', correcto: false, feedback: 'No violó el cómo se jala el trabajo, violó las reglas del flujo de trabajo.' },
      { texto: 'Hacer las Políticas Explícitas', correcto: true, feedback: 'Kanban exige que las reglas para mover una tarjeta sean explícitas y respetadas por todos. Si la política exige "Code Review" antes de desplegar, no hay excepciones.' },
      { texto: 'Mejorar Colaborativamente (Kaizen)', correcto: false, feedback: 'Romper las reglas de calidad no es una mejora continua.' },
      { texto: 'Limitar el Trabajo en Progreso (WIP)', correcto: false, feedback: 'Saltarse una columna no afecta directamente la cantidad límite de trabajo permitido, sino la calidad y el proceso acordado.' },
    ],
  },
  {
    texto: 'El equipo lleva meses sufriendo porque el despliegue a los servidores del cliente requiere 40 pasos manuales, lo que causa fallos constantes y bloquea el flujo. Aplicando Kanban, ¿cuál es el enfoque correcto?',
    opciones: [
      { texto: 'Aceptar que así es la burocracia corporativa y trabajar horas extra', correcto: false, feedback: 'Kanban no fomenta el conformismo ante los desperdicios del sistema.' },
      { texto: 'Cambiar toda la arquitectura a microservicios inmediatamente', correcto: false, feedback: 'Kanban propone cambios evolutivos e incrementales, no revoluciones técnicas masivas y riesgosas de un día para otro.' },
      { texto: 'Despedir al equipo de operaciones y contratar uno nuevo', correcto: false, feedback: 'Cambiar a las personas no soluciona un proceso defectuoso.' },
      { texto: 'Aplicar Kaizen (Mejora Continua): analizar el cuello de botella y comenzar a automatizar el despliegue paso a paso para suavizar el flujo', correcto: true, feedback: 'Kanban se basa en gestionar el flujo y evolucionar el sistema a través del método científico: identificar el dolor, experimentar soluciones (automatizar) y medir el resultado.' },
    ],
  },
  {
    texto: 'El Gerente de Marketing quiere saber si el nuevo módulo de "Reportes Gerenciales" estará listo para el viernes. En lugar de darle una fecha inventada, ¿qué métrica estadística usa un equipo Kanban maduro para responder?',
    opciones: [
      { texto: 'La estimación en Story Points del equipo', correcto: false, feedback: 'Los Story Points son estimaciones relativas de esfuerzo, no proyecciones estadísticas de tiempo de entrega en el calendario.' },
      { texto: 'El porcentaje de tiempo dedicado a reuniones', correcto: false, feedback: 'Esto es una métrica de gestión de tiempo personal, no predice la entrega de software.' },
      { texto: 'El Service Level Expectation (SLE) basado en su histórico de Lead Time', correcto: true, feedback: 'Kanban utiliza datos históricos (percentiles de Lead Time). Ejemplo: "Según nuestros datos, el 85% de tareas de este tamaño se completan en 4 días o menos". Es previsibilidad matemática, no adivinanza.' },
      { texto: 'El número de horas registradas en el software de control de asistencia', correcto: false, feedback: 'Las horas en la oficina no equivalen a progreso en el sistema o tiempo de entrega.' },
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

export default function KanbanP3({ goToScreen, playHoverSound, mainAudioRef }) {
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
        setTimeout(() => goToScreen('gameover', { score, vida: 0, proyectoOrigen: 'kanbanP3' }), 2000);
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
    if (etapa === 'resultado') saveHighScore('kanbanP3', score);
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
          Proyecto 3 — {NOMBRE_PROYECTO}
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
          <button onMouseEnter={playHoverSound} onClick={() => goToScreen('kanbanP3')}
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