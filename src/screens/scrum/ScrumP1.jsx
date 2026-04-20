import React, { useState, useEffect, useRef, useCallback } from 'react';

// ─── DATOS DEL JUEGO ───────────────────────────────────────────────────────────
// Para hacer los demás niveles, copia este archivo y cambia solo este bloque.
// Ajusta NOMBRE_PROYECTO, SPRINTS (preguntas/narrativas) y los rangos si quieres.
const NOMBRE_PROYECTO = 'App de Tareas';

const SPRINTS = [
  {
    id: 'sprint1',
    numero: 1,
    label: 'SPRINT 1',
    color: 'text-green-400',
    borderColor: 'border-green-500',
    narrativa: 'El equipo completó la planificación. El backlog está priorizado y el primer ciclo arrancó.',
    preguntas: [
      {
        texto: '¿Cuál es el propósito del Product Backlog en Scrum?',
        opciones: [
          { texto: 'Registrar las horas trabajadas por el equipo', correcto: false, feedback: 'El Product Backlog no registra horas. Es la lista priorizada de todo el trabajo pendiente del producto, gestionada por el Product Owner.' },
          { texto: 'Documentar los errores encontrados en producción', correcto: false, feedback: 'Los bugs pueden estar en el backlog, pero su propósito es ser el inventario completo y priorizado de todo lo que debe construirse.' },
          { texto: 'Contener y priorizar todo el trabajo pendiente del producto', correcto: true, feedback: 'El Product Backlog es la fuente única de verdad sobre qué construir. El Product Owner lo gestiona y ordena por valor.' },
          { texto: 'Planificar las tareas del Sprint actual únicamente', correcto: false, feedback: 'Las tareas del Sprint van al Sprint Backlog. El Product Backlog cubre todo el producto, no solo el Sprint en curso.' },
        ],
      },
      {
        texto: '¿Qué es un Sprint en Scrum?',
        opciones: [
          { texto: 'Una reunión diaria de sincronización del equipo', correcto: false, feedback: 'Eso es el Daily Scrum. Un Sprint es el contenedor de trabajo completo, no una reunión.' },
          { texto: 'Un ciclo de tiempo fijo donde se crea un incremento del producto', correcto: true, feedback: 'El Sprint es el corazón de Scrum: un período fijo (1-4 semanas) donde el equipo entrega un incremento potencialmente usable.' },
          { texto: 'El proceso de despliegue del software a producción', correcto: false, feedback: 'El despliegue puede ocurrir en un Sprint, pero el Sprint es el ciclo completo de trabajo, no solo el despliegue.' },
          { texto: 'Una técnica de estimación de historias de usuario', correcto: false, feedback: 'La estimación (Planning Poker, Story Points) es una técnica dentro de Scrum, no la definición de Sprint.' },
        ],
      },
      {
        texto: '¿Cuál es el rol del Product Owner en Scrum?',
        opciones: [
          { texto: 'Gestionar al equipo de desarrollo día a día asignando tareas', correcto: false, feedback: 'El equipo es auto-organizado. El Product Owner no dirige el cómo, sino el qué y por qué se construye.' },
          { texto: 'Facilitar los eventos de Scrum y eliminar impedimentos del equipo', correcto: false, feedback: 'Eso es el Scrum Master. El Product Owner tiene responsabilidades sobre el producto y el valor entregado.' },
          { texto: 'Maximizar el valor del producto gestionando el Product Backlog', correcto: true, feedback: 'El Product Owner es responsable del valor: prioriza el backlog, define qué se construye y valida que el resultado sea valioso.' },
          { texto: 'Escribir el código de mayor complejidad técnica del equipo', correcto: false, feedback: 'El Product Owner no escribe código. Su dominio es el negocio y el cliente, no la implementación técnica.' },
        ],
      },
      {
        texto: '¿Qué ocurre en el Daily Scrum?',
        opciones: [
          { texto: 'Se revisan las métricas de rendimiento del trimestre completo', correcto: false, feedback: 'Las métricas trimestrales no son parte del Daily Scrum. Es una sincronización diaria de trabajo inmediato.' },
          { texto: 'El equipo sincroniza el progreso y planifica las próximas 24 horas', correcto: true, feedback: 'El Daily Scrum (15 min) sirve para sincronizarse: qué hice, qué haré, qué me bloquea. Inspección y adaptación diaria.' },
          { texto: 'El Product Owner asigna tareas individuales a cada desarrollador', correcto: false, feedback: 'En Scrum el equipo es auto-organizado. Nadie asigna tareas individualmente; el equipo decide cómo distribuir el trabajo.' },
          { texto: 'Se presenta el incremento terminado al cliente para su aprobación', correcto: false, feedback: 'La presentación al cliente ocurre en el Sprint Review. El Daily Scrum es interno y solo para el equipo de desarrollo.' },
        ],
      },
      {
        texto: '¿Qué es la Definición de Hecho (Definition of Done) en Scrum?',
        opciones: [
          { texto: 'La lista de funcionalidades que el cliente aprobó formalmente', correcto: false, feedback: 'La lista de funcionalidades aprobadas es el Product Backlog refinado. La DoD es un estándar interno de calidad del equipo.' },
          { texto: 'El criterio de aceptación de una historia de usuario específica', correcto: false, feedback: 'Los criterios de aceptación son particulares de cada historia. La DoD aplica uniformemente a todo el trabajo del equipo.' },
          { texto: 'El estándar compartido de calidad que un incremento debe cumplir para considerarse completo', correcto: true, feedback: 'La DoD garantiza transparencia: todos entienden qué significa "terminado". Incluye pruebas, revisión de código, documentación, etc.' },
          { texto: 'El porcentaje mínimo de velocidad que el equipo debe alcanzar por Sprint', correcto: false, feedback: 'La velocidad es una métrica de productividad. La DoD es un estándar de calidad, no una métrica numérica de velocidad.' },
        ],
      },
    ],
  },
  {
    id: 'sprint2',
    numero: 2,
    label: 'SPRINT 2',
    color: 'text-emerald-400',
    borderColor: 'border-emerald-500',
    narrativa: 'El equipo incorporó el feedback de la Retro. Las prioridades cambiaron. Así es Scrum.',
    preguntas: [
      {
        texto: '¿Cuánto tiempo dura típicamente un Sprint en Scrum?',
        opciones: [
          { texto: 'Exactamente 30 días, sin excepciones en ningún proyecto', correcto: false, feedback: 'Un Sprint puede durar entre 1 y 4 semanas. No hay una duración única obligatoria para todos los equipos.' },
          { texto: 'Entre una semana y un mes, con duración consistente dentro del proyecto', correcto: true, feedback: 'Los Sprints duran de 1 a 4 semanas y mantienen la misma duración durante el proyecto para crear ritmo y previsibilidad.' },
          { texto: 'Depende del tamaño de las historias seleccionadas, sin límite fijo', correcto: false, feedback: 'El Sprint tiene duración fija predeterminada. El alcance se ajusta si es necesario, nunca la duración del Sprint.' },
          { texto: 'Dura hasta que se terminan todas las tareas planificadas', correcto: false, feedback: 'El Sprint no se extiende por trabajo incompleto. Termina en la fecha pactada; lo no terminado regresa al Product Backlog.' },
        ],
      },
      {
        texto: '¿Qué es el Sprint Backlog?',
        opciones: [
          { texto: 'La lista completa de todas las funcionalidades del producto', correcto: false, feedback: 'Eso es el Product Backlog. El Sprint Backlog contiene solo el trabajo comprometido para el Sprint actual.' },
          { texto: 'El plan del equipo para el Sprint, con las historias seleccionadas y cómo realizarlas', correcto: true, feedback: 'El Sprint Backlog es del equipo de desarrollo. Contiene las historias comprometidas y el plan técnico para entregarlas.' },
          { texto: 'El registro de errores y bugs encontrados durante el Sprint', correcto: false, feedback: 'Los bugs se registran en el Product Backlog o como impedimentos. El Sprint Backlog es el plan de trabajo, no un log de errores.' },
          { texto: 'La agenda y calendario de reuniones del Sprint', correcto: false, feedback: 'El Sprint Backlog es trabajo técnico planificado, no un calendario de eventos ni agenda de reuniones.' },
        ],
      },
      {
        texto: '¿Qué mide la Velocidad (Velocity) en Scrum?',
        opciones: [
          { texto: 'La rapidez con la que el equipo responde correos al cliente', correcto: false, feedback: 'La velocidad en Scrum mide capacidad de entrega de valor, no tiempos de respuesta en comunicación.' },
          { texto: 'La cantidad de Story Points completados por el equipo en un Sprint', correcto: true, feedback: 'La velocidad mide cuánto trabajo (en story points) completa el equipo por Sprint. Se usa para planificar sprints futuros de forma realista.' },
          { texto: 'El número de reuniones Scrum realizadas durante el Sprint', correcto: false, feedback: 'Las reuniones no determinan la velocidad. Es una métrica de entrega real de trabajo valioso, no de asistencia a eventos.' },
          { texto: 'El tiempo promedio que tarda un desarrollador individual en completar una tarea', correcto: false, feedback: 'La velocidad es del equipo completo, no de individuos. Mide story points del equipo entregados, no tiempo por tarea.' },
        ],
      },
      {
        texto: '¿Qué sucede en la Sprint Retrospectiva?',
        opciones: [
          { texto: 'El equipo demuestra el incremento completado al Product Owner y al cliente', correcto: false, feedback: 'Eso es el Sprint Review. La Retrospectiva es interna: el equipo inspecciona su propio proceso de trabajo.' },
          { texto: 'El Product Owner reprioriza el Product Backlog para el siguiente Sprint', correcto: false, feedback: 'La repriorización ocurre en el refinamiento del backlog. La Retrospectiva analiza el proceso del equipo, no el producto.' },
          { texto: 'El equipo inspecciona su forma de trabajar y define mejoras concretas para el siguiente Sprint', correcto: true, feedback: 'La Retrospectiva busca mejora continua: qué salió bien, qué mejorar, qué acciones concretas tomar. Es la adaptación del proceso.' },
          { texto: 'Se cancelan y eliminan las historias no completadas del Sprint anterior', correcto: false, feedback: 'Las historias incompletas regresan al Product Backlog para ser reprioridas. La Retrospectiva no cancela trabajo; mejora el proceso.' },
        ],
      },
      {
        texto: '¿Cuál artefacto de Scrum representa el trabajo pendiente del Sprint en curso?',
        opciones: [
          { texto: 'El Burnup Chart acumulado del producto completo', correcto: false, feedback: 'El Burnup Chart es una herramienta visual de progreso. El artefacto oficial de trabajo del Sprint es el Sprint Backlog.' },
          { texto: 'El tablero Kanban del equipo de operaciones', correcto: false, feedback: 'Un tablero Kanban es una herramienta de visualización, no el artefacto oficial de Scrum para gestionar el Sprint.' },
          { texto: 'El Sprint Backlog, que refleja el plan vivo del equipo para el Sprint actual', correcto: true, feedback: 'El Sprint Backlog es el plan del equipo: muestra qué se comprometió, qué está en progreso y qué queda. Se actualiza diariamente.' },
          { texto: 'El Product Backlog con las historias de mayor prioridad marcadas', correcto: false, feedback: 'El Product Backlog es el inventario del producto completo. El trabajo del Sprint vive específicamente en el Sprint Backlog.' },
        ],
      },
    ],
  },
];

const TIEMPO_LIMITE = 30;
const PUNTOS_BASE = 100;
const BONUS_SPRINT_PERFECTO = 150; // Bonus si el sprint fue perfecto (0 errores)
const RECUPERACION_VIDA = 20;      // Vida recuperada si hubo 1 error

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
  if (score >= 900) return { label: 'ORO',    color: 'text-yellow-400', symbol: '🥇', desc: 'Rendimiento excepcional. El Product Owner te quiere en todos sus proyectos.' };
  if (score >= 500) return { label: 'PLATA',  color: 'text-slate-300',  symbol: '🥈', desc: 'Desempeño aceptable. Hay áreas de mejora en la próxima Retro.' };
  return                   { label: 'BRONCE', color: 'text-orange-400', symbol: '🥉', desc: 'De milagro no cancelaron el proyecto.' };
}

// ─────────────────────────────────────────────────────────────────────────────

export default function ScrumP1({ goToScreen, playHoverSound, mainAudioRef }) {
  const [etapa, setEtapa] = useState('countdown');
  const [countdown, setCountdown] = useState(3);

  const [sprintIdx, setSprintIdx] = useState(0);
  const [preguntaIdx, setPreguntaIdx] = useState(0); // índice dentro del sprint actual

  const [vida, setVida] = useState(100);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [tiempoRestante, setTiempoRestante] = useState(TIEMPO_LIMITE);
  const [feedback, setFeedback] = useState(null);
  const [respondido, setRespondido] = useState(false);

  // Errores dentro del sprint actual (se resetea en cada retrospectiva)
  const [erroresSprint, setErroresSprint] = useState(0);

  // Efectos visuales
  const [centerPopup, setCenterPopup] = useState(null);
  const [screenFlash, setScreenFlash] = useState(null);
  const [shakeHUD, setShakeHUD] = useState(false);

  const timerRef = useRef(null);
  const floatingTimer = useRef(null);
  const flashTimer = useRef(null);

  const sprintActual = SPRINTS[sprintIdx];
  const preguntaActual = sprintActual?.preguntas[preguntaIdx];

  // ── Música fondoscrum ──
  useEffect(() => {
    const main = mainAudioRef?.current;
    if (main) {
      main.pause();
      main.volume = 0;
    }

    const audio = new Audio('/fondoscrum.mp3');
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
  const playCorrecta   = () => { try { const a = new Audio('/correcta.mp3');    a.volume = 0.6; a.play(); } catch {} };
  const playIncorrecta = () => { try { const a = new Audio('/incorrecta.mp3');  a.volume = 0.6; a.play(); } catch {} };
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

  // ── Timer pregunta ──
  useEffect(() => {
    if (etapa !== 'pregunta' || respondido) return;
    if (tiempoRestante <= 0) { handleRespuesta(null); return; }
    timerRef.current = setTimeout(() => setTiempoRestante(t => t - 1), 1000);
    return () => clearTimeout(timerRef.current);
  }, [etapa, tiempoRestante, respondido]);

  // ── Respuesta ──
  const handleRespuesta = useCallback((opcionIdx) => {
    if (respondido) return;
    clearTimeout(timerRef.current);
    setRespondido(true);

    const tiempoAgotado = opcionIdx === null;
    const opcion = tiempoAgotado ? null : preguntaActual.opciones[opcionIdx];
    const correcto = !tiempoAgotado && opcion.correcto;

    if (correcto) {
      const puntos = calcularPuntos(tiempoRestante);
      const nuevoCombo = combo + 1;
      const bonusCombo = nuevoCombo >= 3 ? Math.floor(puntos * 0.2) : 0;
      const total = puntos + bonusCombo;
      setScore(s => s + total);
      setCombo(nuevoCombo);
      playCorrecta();

      const lines = [`+${total} pts`];
      if (nuevoCombo >= 3) lines.push(`🔥 COMBO ×${nuevoCombo}`);
      setCenterPopup({ lines, correcto: true, key: Date.now() });
      setScreenFlash('correct');
      setFeedback({ texto: opcion.feedback, correcto: true });
    } else {
      const nuevaVida = Math.max(0, vida - 20);
      setVida(nuevaVida);
      setCombo(0);
      setErroresSprint(e => e + 1);
      playIncorrecta();

      const popupText = tiempoAgotado ? '⏱ TIEMPO' : 'INCORRECTO';
      setCenterPopup({ lines: [popupText], correcto: false, key: Date.now() });
      setScreenFlash('incorrect');
      setShakeHUD(true);
      setTimeout(() => setShakeHUD(false), 500);

      setFeedback({
        texto: tiempoAgotado ? 'Se agotó el tiempo. ¡Responde más rápido!' : opcion.feedback,
        correcto: false,
      });

      if (nuevaVida <= 0) {
        setTimeout(() => goToScreen('gameover', { score, vida: 0, proyectoOrigen: 'scrumP1' }), 2000);
        return;
      }
    }

    clearTimeout(flashTimer.current);
    flashTimer.current = setTimeout(() => setScreenFlash(null), 600);
    clearTimeout(floatingTimer.current);
    floatingTimer.current = setTimeout(() => setCenterPopup(null), 1400);

    setTimeout(() => avanzar(correcto), 2200);
  }, [respondido, preguntaActual, tiempoRestante, combo, vida, sprintIdx, score]);

  const avanzar = (correcto) => {
    const esUltimaPreguntaDeSprint = preguntaIdx >= sprintActual.preguntas.length - 1;
    const esUltimoSprint = sprintIdx >= SPRINTS.length - 1;

    if (esUltimaPreguntaDeSprint) {
      if (esUltimoSprint) {
        setEtapa('resultado');
      } else {
        setEtapa('retrospectiva');
      }
    } else {
      setPreguntaIdx(p => p + 1);
      setTiempoRestante(TIEMPO_LIMITE);
      setFeedback(null);
      setRespondido(false);
    }
  };

  const continuarSprint = (bonusScore, bonusVida) => {
    if (bonusScore > 0) setScore(s => s + bonusScore);
    if (bonusVida > 0) setVida(v => Math.min(100, v + bonusVida));
    setSprintIdx(s => s + 1);
    setPreguntaIdx(0);
    setTiempoRestante(TIEMPO_LIMITE);
    setFeedback(null);
    setRespondido(false);
    setErroresSprint(0);
    setEtapa('pregunta');
  };

  useEffect(() => {
    if (etapa === 'resultado') saveHighScore('scrumP1', score);
  }, [etapa]);

  const rango = getRango(score);
  const porcentajeVida = Math.max(0, vida);
  const porcentajeTiempo = (tiempoRestante / TIEMPO_LIMITE) * 100;
  const timerColor = tiempoRestante > 15 ? 'bg-green-500' : tiempoRestante > 8 ? 'bg-yellow-500' : 'bg-red-500';
  const vidaColor = vida > 60 ? 'bg-green-500' : vida > 30 ? 'bg-yellow-500' : 'bg-red-500';

  // Calcular recompensa de retrospectiva
  const retroInfo = (() => {
    if (erroresSprint === 0) return {
      tipo: 'perfecto',
      titulo: '¡SPRINT PERFECTO!',
      color: 'text-yellow-400',
      borderColor: 'border-yellow-500/60',
      bg: 'bg-yellow-950/20',
      icono: '⚡',
      desc: 'Cero errores. El equipo trabajó en sincronía total.',
      rewardText: `+${BONUS_SPRINT_PERFECTO} pts de bonus`,
      bonusScore: BONUS_SPRINT_PERFECTO,
      bonusVida: 0,
    };
    if (erroresSprint === 1) return {
      tipo: 'recuperacion',
      titulo: 'RETROSPECTIVA',
      color: 'text-green-400',
      borderColor: 'border-green-500/50',
      bg: 'bg-green-950/20',
      icono: '💚',
      desc: 'Hubo un tropiezo, pero el equipo aprendió de él.',
      rewardText: `+${RECUPERACION_VIDA}% de integridad recuperada`,
      bonusScore: 0,
      bonusVida: RECUPERACION_VIDA,
    };
    return {
      tipo: 'neutro',
      titulo: 'RETROSPECTIVA',
      color: 'text-slate-400',
      borderColor: 'border-slate-600/50',
      bg: 'bg-slate-800/20',
      icono: '📋',
      desc: 'Demasiados errores en el Sprint. El equipo tiene deuda técnica emocional.',
      rewardText: 'Sin bonus — trabajen mejor en el siguiente Sprint.',
      bonusScore: 0,
      bonusVida: 0,
    };
  })();

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
          <div className="text-5xl font-black text-green-400 uppercase tracking-widest animate-fade-in">¡COMIENZA!</div>
        )}
      </div>
    );
  }

  // ── RETROSPECTIVA (entre sprints) ──
  if (etapa === 'retrospectiva') {
    return (
      <div className="max-w-2xl w-full px-4 py-10 flex flex-col items-center animate-fade-in">

        {/* Última feedback del sprint */}
        {feedback && (
          <div className={`w-full mb-6 flex gap-3 items-start p-4 rounded-lg border ${feedback.correcto ? 'border-green-500/40 bg-green-950/30' : 'border-red-500/40 bg-red-950/30'}`}>
            <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-white/20">
              <img src="/metto.gif" alt="Metto" className="w-full h-full object-cover" onError={e => e.target.style.display = 'none'} />
            </div>
            <div>
              <p className={`text-xs font-black uppercase tracking-wider mb-1 ${feedback.correcto ? 'text-green-400' : 'text-red-400'}`}>
                {feedback.correcto ? '[ÉXITO] ¡Velocity en máximos!' : '[ERROR] ¡Deuda técnica acumulada!'}
              </p>
              <p className="text-slate-300 text-sm">{feedback.texto}</p>
            </div>
          </div>
        )}

        {/* Stats del sprint */}
        <div className="w-full flex justify-between text-xs text-white uppercase tracking-widest mb-6 border border-white/10 rounded px-4 py-2">
          <span>Integridad: <span className="font-black">{vida}%</span></span>
          <span>Errores en Sprint: <span className={`font-black ${erroresSprint === 0 ? 'text-green-400' : erroresSprint === 1 ? 'text-yellow-400' : 'text-red-400'}`}>{erroresSprint}</span></span>
          <span>Puntos: <span className="font-black">{score.toLocaleString()}</span></span>
        </div>

        {/* Card de retrospectiva */}
        <div className={`border-2 ${retroInfo.borderColor} ${retroInfo.bg} rounded-lg px-6 py-8 text-center w-full mb-6`}>
          <p className="text-4xl mb-3">{retroInfo.icono}</p>
          <p className="text-slate-500 text-xs font-black uppercase tracking-widest mb-1">
            Sprint {sprintActual.numero} — {NOMBRE_PROYECTO}
          </p>
          <p className={`text-2xl font-black uppercase tracking-tight mb-2 ${retroInfo.color}`}>
            {retroInfo.titulo}
          </p>
          <p className="text-slate-400 text-sm mb-5 leading-relaxed">
            {sprintActual.narrativa}
          </p>
          <div className={`inline-block border ${retroInfo.borderColor} rounded px-4 py-2`}>
            <p className={`text-sm font-black uppercase tracking-wider ${retroInfo.color}`}>
              {retroInfo.rewardText}
            </p>
          </div>
        </div>

        {/* Próximo sprint info */}
        <div className="w-full border border-white/10 rounded px-4 py-3 text-center mb-8">
          <p className="text-slate-500 text-xs uppercase tracking-widest">
            A continuación → <span className="text-white font-black">{SPRINTS[sprintIdx + 1]?.label}</span>
          </p>
        </div>

        <button
          onMouseEnter={playHoverSound}
          onClick={() => continuarSprint(retroInfo.bonusScore, retroInfo.bonusVida)}
          className="px-10 py-3 bg-white text-black font-black text-sm uppercase tracking-widest rounded-sm hover:bg-green-400 transition-transform duration-200 hover:scale-105 active:scale-95"
        >
          Continuar al {SPRINTS[sprintIdx + 1]?.label} →
        </button>
      </div>
    );
  }

  // ── RESULTADO FINAL ──
  if (etapa === 'resultado') {
    return (
      <div className="max-w-2xl w-full px-4 py-10 flex flex-col items-center animate-fade-in">
        <p className="text-slate-500 text-xs uppercase tracking-[0.3em] mb-2">Proyecto completado</p>
        <h1 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter mb-1">App de</h1>
        <h1 className="text-4xl md:text-5xl font-black text-green-400 uppercase italic tracking-tighter mb-8">Tareas</h1>

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

        <div className={`w-full border-2 rounded-lg px-6 py-6 text-center mb-8 ${rango.label === 'ORO' ? 'border-yellow-400/50 bg-yellow-950/20' : rango.label === 'PLATA' ? 'border-slate-400/50 bg-slate-800/20' : 'border-orange-700/50 bg-orange-950/20'}`}>
          <p className="text-4xl mb-2">{rango.symbol}</p>
          <p className={`text-2xl font-black uppercase tracking-widest ${rango.color}`}>RANGO {rango.label}</p>
          <p className="text-slate-400 text-sm mt-1">{rango.desc}</p>
        </div>

        <div className="flex flex-col gap-3 w-full max-w-xs">
          <button onMouseEnter={playHoverSound} onClick={() => goToScreen('scrumP1')}
            className="w-full py-3 bg-white text-black font-black text-sm uppercase tracking-widest rounded-sm hover:bg-green-400 transition-transform duration-200 hover:scale-105 active:scale-95">
            Jugar de nuevo
          </button>
          <button onMouseEnter={playHoverSound} onClick={() => goToScreen('scrum')}
            className="w-full py-3 bg-transparent border border-white/30 text-slate-300 font-black text-sm uppercase tracking-widest rounded-sm transition-transform duration-200 hover:scale-105 active:scale-95">
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
        <div className={`fixed inset-0 pointer-events-none z-30 animate-fade-in
          ${screenFlash === 'correct' ? 'bg-green-500/10' : 'bg-red-500/10'}`}
        />
      )}

      {/* Popup central con bounce */}
      {centerPopup && (
        <div key={centerPopup.key} className="fixed inset-0 pointer-events-none z-40 bg-transparent">
          {centerPopup.lines.map((line, i) => (
            <div
              key={i}
              className={`animate-bounce-in-center font-black uppercase tracking-widest select-none
                ${i === 0
                  ? (centerPopup.correcto ? 'text-green-400' : 'text-red-400')
                  : 'text-orange-400'
                }`}
              style={{
                position: 'absolute',
                top: centerPopup.lines.length === 1 ? '47%' : (i === 0 ? '40%' : '58%'),
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontSize: i === 0 ? 'clamp(3rem, 10vw, 5.5rem)' : 'clamp(1.5rem, 5vw, 2.5rem)',
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
        <div className="flex items-center justify-between">
          <span className={`text-xs font-black uppercase tracking-widest ${sprintActual.color}`}>
            {sprintActual.label} — Pregunta {preguntaIdx + 1}/{sprintActual.preguntas.length}
          </span>
          {combo >= 2 && (
            <span className="text-xs font-black uppercase tracking-widest text-orange-400 animate-pulse">
              🔥 COMBO ×{combo}
            </span>
          )}
        </div>

        {/* Indicador de progreso global */}
        <div className="flex gap-1 items-center">
          {SPRINTS.map((s, si) => (
            <React.Fragment key={s.id}>
              {s.preguntas.map((_, qi) => {
                const globalIdx = si * s.preguntas.length + qi;
                const currentGlobal = sprintIdx * sprintActual.preguntas.length + preguntaIdx;
                const isDone = globalIdx < currentGlobal;
                const isCurrent = globalIdx === currentGlobal;
                return (
                  <div
                    key={qi}
                    className={`h-1.5 flex-1 rounded-full transition-all duration-300
                      ${isDone ? 'bg-green-500' : isCurrent ? 'bg-white' : 'bg-slate-700'}`}
                  />
                );
              })}
              {si < SPRINTS.length - 1 && (
                <div className="w-px h-3 bg-slate-600 mx-0.5" />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Vida */}
        <div>
          <div className="flex justify-between text-xs text-white mb-1">
            <span className="uppercase tracking-wider font-semibold">Integridad</span>
            <span className={`font-black ${vida <= 30 ? 'text-red-400 animate-danger-pulse' : ''}`}>{vida}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
            <div className={`h-full ${vidaColor} transition-all duration-500 rounded-full`} style={{ width: `${porcentajeVida}%` }} />
          </div>
        </div>

        {/* Tiempo */}
        <div>
          <div className="flex justify-between text-xs text-white mb-1">
            <span className="uppercase tracking-wider font-semibold">Tiempo</span>
            <span className={`font-black ${tiempoRestante <= 8 ? 'text-red-400 animate-pulse' : ''}`}>{tiempoRestante}s</span>
          </div>
          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
            <div className={`h-full ${timerColor} transition-all duration-1000 rounded-full`} style={{ width: `${porcentajeTiempo}%` }} />
          </div>
        </div>

        {/* Score */}
        <div className="flex justify-between items-center">
          <span className="text-xs text-white uppercase tracking-wider font-semibold">Puntuación</span>
          <span className="text-sm font-black text-white">{score.toLocaleString()} pts</span>
        </div>
      </div>

      <div key={`${sprintIdx}-${preguntaIdx}`} className="w-full animate-fade-in flex flex-col items-center">

        {/* Pregunta */}
        <div className={`relative w-full border-l-4 ${sprintActual.borderColor} pl-5 pr-4 py-5 bg-slate-900/60 rounded-r-lg mb-5`}>
          <p className="text-white font-bold text-xl md:text-2xl leading-relaxed">
            {preguntaActual.texto}
          </p>
        </div>

        {/* Opciones */}
        {preguntaActual.opciones.map((op, i) => {
          let estilo = 'border-white/20 text-slate-200 hover:border-white/50';
          if (respondido) {
            estilo = op.correcto ? 'border-green-500 bg-green-950/40 text-green-300' : 'border-white/10 text-slate-500';
          }
          return (
            <button key={i}
              onMouseEnter={!respondido ? playHoverSound : undefined}
              onClick={() => handleRespuesta(i)}
              disabled={respondido}
              className={`w-full text-left px-4 py-3.5 border rounded-lg text-base font-bold transition-transform duration-150
                ${respondido ? 'cursor-default' : 'hover:scale-[1.01] active:scale-[0.99]'} ${estilo}`}
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
              {feedback.correcto ? '[ÉXITO] ¡Velocity en máximos!' : '[ERROR] ¡Deuda técnica acumulada!'}
            </p>
            <p className="text-slate-300 text-sm">{feedback.texto}</p>
          </div>
        </div>
      )}

    </div>
  );
}