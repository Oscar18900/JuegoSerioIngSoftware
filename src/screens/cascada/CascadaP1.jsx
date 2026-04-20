import React, { useState, useEffect, useRef, useCallback } from 'react';
import { saveHighScore } from '../SeleccionCascada';

// ─── DATOS DEL JUEGO ───────────────────────────────────────────────────────────
const FASES = [
  {
    id: 'analisis',
    label: 'ANÁLISIS',
    color: 'text-cyan-400',
    borderColor: 'border-cyan-500',
    narrativa: 'Los requisitos han sido documentados y firmados.',
    siguiente: 'Iniciando FASE DE DISEÑO...',
    danio: 20, // análisis duele más
    preguntas: [
      {
        texto: '¿Cuál es el propósito principal de la fase de Análisis en el modelo Cascada?',
        opciones: [
          { texto: 'Escribir el código funcional del sistema', correcto: false, feedback: 'Escribir código es la fase de Implementación. Análisis se enfoca en capturar requisitos.' },
          { texto: 'Definir y documentar los requisitos del sistema', correcto: true,  feedback: 'El Análisis captura todos los requisitos antes de avanzar. Es la base de todo Cascada.' },
          { texto: 'Realizar pruebas de integración', correcto: false, feedback: 'Las pruebas de integración son parte de la fase de Pruebas, al final del proceso.' },
          { texto: 'Diseñar la arquitectura del software', correcto: false, feedback: 'La arquitectura se define en Diseño, la fase posterior al Análisis.' },
        ],
      },
      {
        texto: '¿Qué característica define al modelo Cascada frente a otras metodologías?',
        opciones: [
          { texto: 'Es iterativo y permite adaptarse a cambios frecuentes', correcto: false, feedback: 'La iteratividad es característica ágil. Cascada es lineal y sin iteraciones.' },
          { texto: 'Permite regresar a fases anteriores con facilidad', correcto: false, feedback: 'Regresar en Cascada es posible pero extremadamente costoso.' },
          { texto: 'Es secuencial: cada fase debe completarse antes de iniciar la siguiente', correcto: true,  feedback: 'La secuencialidad estricta es la esencia del modelo Cascada.' },
          { texto: 'Se basa en entregas continuas de valor al cliente', correcto: false, feedback: 'Las entregas continuas son propias de enfoques ágiles. Cascada entrega al final.' },
        ],
      },
    ],
  },
  {
    id: 'disenio',
    label: 'DISEÑO',
    color: 'text-blue-400',
    borderColor: 'border-blue-500',
    narrativa: 'La arquitectura ha sido aprobada. El equipo puede comenzar a construir.',
    siguiente: 'Iniciando FASE DE IMPLEMENTACIÓN...',
    danio: 10,
    preguntas: [
      {
        texto: '¿Qué se produce principalmente en la fase de Diseño del modelo Cascada?',
        opciones: [
          { texto: 'El código fuente del sistema', correcto: false, feedback: 'El código se produce en Implementación. Diseño genera arquitectura y especificaciones.' },
          { texto: 'Los casos de prueba del sistema', correcto: false, feedback: 'Los casos de prueba se definen en la fase de Pruebas.' },
          { texto: 'La arquitectura y especificaciones técnicas del sistema', correcto: true,  feedback: 'Diseño produce la arquitectura y especificaciones que guiarán la Implementación.' },
          { texto: 'El manual de usuario final', correcto: false, feedback: 'El manual de usuario se elabora al final del proyecto, no durante el Diseño.' },
        ],
      },
      {
        texto: '¿Cuándo puede comenzar la fase de Diseño en el modelo Cascada?',
        opciones: [
          { texto: 'En cualquier momento del proyecto', correcto: false, feedback: 'Cascada es secuencial. Diseño solo inicia cuando Análisis está 100% terminado y aprobado.' },
          { texto: 'Solo cuando el Análisis esté completamente documentado y aprobado', correcto: true,  feedback: 'Cada fase es prerequisito de la siguiente. No hay solapamiento en Cascada.' },
          { texto: 'En paralelo con Implementación para ahorrar tiempo', correcto: false, feedback: 'El paralelismo es ajeno a Cascada. Sus fases son estrictamente secuenciales.' },
          { texto: 'Después de las pruebas iniciales del sistema', correcto: false, feedback: 'Las Pruebas son la fase final. El Diseño ocurre justo después del Análisis.' },
        ],
      },
    ],
  },
  {
    id: 'implementacion',
    label: 'IMPLEMENTACIÓN',
    color: 'text-yellow-400',
    borderColor: 'border-yellow-500',
    narrativa: 'El sistema ha sido construido. El equipo de QA toma el control.',
    siguiente: 'Iniciando FASE DE PRUEBAS...',
    danio: 10,
    preguntas: [
      {
        texto: '¿Cuál es la actividad principal de la fase de Implementación en Cascada?',
        opciones: [
          { texto: 'Documentar los requisitos del sistema', correcto: false, feedback: 'Los requisitos se documentan en Análisis. Implementación construye, no documenta requisitos.' },
          { texto: 'Programar y construir el sistema según las especificaciones de diseño', correcto: true,  feedback: 'Implementación traduce el diseño aprobado en código funcional.' },
          { texto: 'Probar el sistema con usuarios reales', correcto: false, feedback: 'Las pruebas con usuarios son parte de la fase de Pruebas, posterior a Implementación.' },
          { texto: 'Planificar el cronograma del proyecto', correcto: false, feedback: 'La planificación ocurre antes de iniciar las fases, típicamente junto al Análisis.' },
        ],
      },
      {
        texto: '¿Qué tan sencillo es realizar cambios al diseño durante la Implementación en Cascada?',
        opciones: [
          { texto: 'Es sencillo; el modelo está diseñado para adaptarse', correcto: false, feedback: 'La flexibilidad es una característica ágil. Cascada no está diseñado para cambios durante la implementación.' },
          { texto: 'Es muy costoso porque la fase de Diseño ya está cerrada y documentada', correcto: true,  feedback: 'Modificar el diseño durante Implementación requiere retroceder formalmente. Costoso y disruptivo.' },
          { texto: 'No tiene ningún costo adicional si el equipo lo aprueba internamente', correcto: false, feedback: 'Siempre hay costo: rediseño, re-documentación, actualización de lo ya construido.' },
          { texto: 'Se puede cambiar sin afectar otras fases', correcto: false, feedback: 'En Cascada todo es interdependiente. Un cambio puede afectar diseño, pruebas y documentación.' },
        ],
      },
    ],
  },
  {
    id: 'pruebas',
    label: 'PRUEBAS',
    color: 'text-green-400',
    borderColor: 'border-green-500',
    narrativa: null,
    siguiente: null,
    danio: 10,
    preguntas: [
      {
        texto: '¿Qué se verifica principalmente en la fase de Pruebas del modelo Cascada?',
        opciones: [
          { texto: 'La estructura organizacional del equipo de desarrollo', correcto: false, feedback: 'La organización del equipo no es objeto de la fase de Pruebas.' },
          { texto: 'Que el sistema cumpla los requisitos definidos en la fase de Análisis', correcto: true,  feedback: 'Las Pruebas validan que el sistema cumple con lo especificado al inicio del proyecto.' },
          { texto: 'La velocidad del equipo para futuros proyectos', correcto: false, feedback: 'La velocidad del equipo es una métrica de Scrum. Las Pruebas se enfocan en la calidad del producto.' },
          { texto: 'Los costos finales del proyecto', correcto: false, feedback: 'Los costos son responsabilidad de gestión de proyectos. Las Pruebas validan funcionalidad.' },
        ],
      },
      {
        texto: '¿Qué ocurre si se descubren errores graves en la fase de Pruebas en Cascada?',
        opciones: [
          { texto: 'Se lanza el sistema de todas formas con una lista de errores conocidos', correcto: false, feedback: 'Lanzar con errores graves no es aceptable. Los errores deben corregirse.' },
          { texto: 'Se corrigen en la misma fase de Pruebas sin costo adicional', correcto: false, feedback: 'Si el error está en el diseño o análisis, corregirlo en Pruebas implica retroceder varias fases.' },
          { texto: 'Se debe retroceder a la fase donde se originó el error, lo cual es muy costoso', correcto: true,  feedback: 'En Cascada los errores detectados tarde obligan a retroceder. El costo crece exponencialmente.' },
          { texto: 'Se abren nuevos sprints de desarrollo para corregirlos', correcto: false, feedback: 'Los sprints son de Scrum. En Cascada los errores graves obligan a retroceder de fase formalmente.' },
        ],
      },
    ],
  },
];

const TIEMPO_LIMITE = 30;
const PUNTOS_BASE = 100;

function calcularPuntos(tiempoRestante) {
  const bonus = Math.floor((tiempoRestante / TIEMPO_LIMITE) * 50);
  return PUNTOS_BASE + bonus;
}

function getRango(score) {
  if (score >= 700) return { label: 'ORO',    color: 'text-yellow-400', symbol: '🥇', desc: 'Rendimiento excepcional.' };
  if (score >= 400) return { label: 'PLATA',  color: 'text-slate-300',  symbol: '🥈', desc: 'Desempeño aceptable. Hay áreas de mejora.' };
  return                    { label: 'BRONCE', color: 'text-orange-400', symbol: '🥉', desc: 'De milagro no te corrieron.' };
}

// ─── COMPONENTE PRINCIPAL ──────────────────────────────────────────────────────
export default function CascadaP1({ goToScreen, playHoverSound }) {

  // Estados de fase y juego
  const [etapa, setEtapa] = useState('countdown'); // countdown | pregunta | transicion | resultado
  const [countdown, setCountdown] = useState(3);
  const [faseIdx, setFaseIdx] = useState(0);
  const [preguntaIdx, setPreguntaIdx] = useState(0);

  // Stats
  const [vida, setVida] = useState(100);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [tiempoRestante, setTiempoRestante] = useState(TIEMPO_LIMITE);

  // Feedback visual
  const [feedback, setFeedback] = useState(null); // { texto, correcto, puntos }
  const [floatingText, setFloatingText] = useState(null); // { texto, correcto }
  const [respondido, setRespondido] = useState(false);

  // Audio
  const correctaRef = useRef(null);
  const incorrectaRef = useRef(null);
  const temporizadorRef = useRef(null);

  const timerRef = useRef(null);
  const floatingTimer = useRef(null);

  const faseActual = FASES[faseIdx];
  const preguntaActual = faseActual?.preguntas[preguntaIdx];

  // ── Sonidos ──
  const playCorrecta = () => { try { const a = new Audio('/correcta.mp3'); a.volume = 0.6; a.play(); } catch {} }
  const playIncorrecta = () => { try { const a = new Audio('/incorrecta.mp3'); a.volume = 0.6; a.play(); } catch {} }
  const playTemporizador = () => { try { const a = new Audio('/temporizador.mp3'); a.volume = 0.5; a.play(); } catch {} }

  // ── Countdown inicial ──
  useEffect(() => {
    if (etapa !== 'countdown') return;
    if (countdown > 0) {
      playTemporizador();
      const t = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(t);
    } else {
      setEtapa('pregunta');
    }
  }, [etapa, countdown]);

  // ── Timer de pregunta ──
  useEffect(() => {
    if (etapa !== 'pregunta' || respondido) return;
    if (tiempoRestante <= 0) {
      handleRespuesta(null); // tiempo agotado
      return;
    }
    timerRef.current = setTimeout(() => setTiempoRestante(t => t - 1), 1000);
    return () => clearTimeout(timerRef.current);
  }, [etapa, tiempoRestante, respondido]);

  // ── Manejar respuesta ──
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
      setFloatingText({ texto: `+${total}`, correcto: true });
      setFeedback({ texto: opcion.feedback, correcto: true });
    } else {
      const danio = faseActual.danio;
      const nuevaVida = Math.max(0, vida - danio);
      setVida(nuevaVida);
      setCombo(0);
      playIncorrecta();
      setFloatingText({ texto: tiempoAgotado ? '⏱ TIEMPO' : 'INCORRECTO', correcto: false });
      setFeedback({
        texto: tiempoAgotado ? 'Se agotó el tiempo. ¡Responde más rápido!' : opcion.feedback,
        correcto: false,
      });

      if (nuevaVida <= 0) {
        // Game over — pequeño delay para mostrar el feedback
        setTimeout(() => goToScreen('gameover', { score, vida: 0 }), 2000);
        return;
      }
    }

    // Limpiar floating text
    clearTimeout(floatingTimer.current);
    floatingTimer.current = setTimeout(() => setFloatingText(null), 1500);

    // Avanzar después de mostrar feedback
    setTimeout(() => avanzar(correcto), 2200);
  }, [respondido, preguntaActual, tiempoRestante, combo, vida, faseActual, score]);

  const avanzar = (correcto) => {
    const esUltimaPreguntaDeFase = preguntaIdx >= faseActual.preguntas.length - 1;
    const esUltimaFase = faseIdx >= FASES.length - 1;

    if (esUltimaPreguntaDeFase) {
      if (esUltimaFase) {
        setEtapa('resultado');
      } else {
        setEtapa('transicion');
      }
    } else {
      setPreguntaIdx(p => p + 1);
      setTiempoRestante(TIEMPO_LIMITE);
      setFeedback(null);
      setRespondido(false);
    }
  };

  const siguienteFase = () => {
    setFaseIdx(f => f + 1);
    setPreguntaIdx(0);
    setTiempoRestante(TIEMPO_LIMITE);
    setFeedback(null);
    setRespondido(false);
    setEtapa('pregunta');
  };

  // Guardar high score al llegar a resultado
  useEffect(() => {
    if (etapa === 'resultado') {
      saveHighScore('cascadaP1', score);
    }
  }, [etapa]);

  const rango = getRango(score);
  const porcentajeVida = Math.max(0, vida);
  const porcentajeTiempo = (tiempoRestante / TIEMPO_LIMITE) * 100;
  const timerColor = tiempoRestante > 15 ? 'bg-green-500' : tiempoRestante > 8 ? 'bg-yellow-500' : 'bg-red-500';
  const vidaColor = vida > 60 ? 'bg-green-500' : vida > 30 ? 'bg-yellow-500' : 'bg-red-500';

  // ── RENDER: Countdown ──
  if (etapa === 'countdown') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
        <p className="text-slate-400 text-xs uppercase tracking-widest mb-6">Proyecto 1 — Sistema de Biblioteca</p>
        {countdown > 0 ? (
          <div key={countdown} className="text-9xl font-black text-white animate-ping-once drop-shadow-[0_0_40px_rgba(255,255,255,0.5)]">
            {countdown}
          </div>
        ) : (
          <div className="text-5xl font-black text-cyan-400 uppercase tracking-widest animate-fade-in">
            ¡COMIENZA!
          </div>
        )}
      </div>
    );
  }

  // ── RENDER: Transición entre fases ──
  if (etapa === 'transicion') {
    const faseFin = FASES[faseIdx];
    return (
      <div className="max-w-2xl w-full px-4 py-10 flex flex-col items-center animate-fade-in">
        {/* Feedback de última respuesta */}
        {feedback && (
          <div className={`w-full mb-6 flex gap-3 items-start p-4 rounded-lg border ${feedback.correcto ? 'border-green-500/40 bg-green-950/30' : 'border-red-500/40 bg-red-950/30'}`}>
            <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-white/20">
              <img src="/metto.gif" alt="Metto" className="w-full h-full object-cover" onError={e => e.target.style.display='none'} />
            </div>
            <div>
              <p className={`text-xs font-black uppercase tracking-wider mb-1 ${feedback.correcto ? 'text-green-400' : 'text-red-400'}`}>
                {feedback.correcto ? '[ÉXITO] ¡Flujo óptimo!' : '[ERROR] ¡Alerta de integridad!'}
              </p>
              <p className="text-slate-300 text-sm">{feedback.texto}</p>
            </div>
          </div>
        )}

        {/* HUD de transición */}
        <div className="w-full flex justify-between text-xs text-slate-400 uppercase tracking-widest mb-8 border border-white/10 rounded px-4 py-2">
          <span>Integridad: <span className="text-white font-black">{vida}%</span></span>
          <span>Puntos: <span className="text-white font-black">{score.toLocaleString()}</span></span>
        </div>

        <div className={`border-2 ${faseFin.borderColor} rounded-lg px-6 py-8 text-center w-full bg-slate-900/60`}>
          <p className={`text-xs font-black uppercase tracking-widest ${faseFin.color} mb-2`}>FASE COMPLETADA</p>
          <p className="text-white font-black text-2xl uppercase tracking-tight mb-2">{faseFin.label}</p>
          <p className="text-slate-400 text-sm mb-6">{faseFin.narrativa}</p>
          <p className="text-slate-500 text-xs uppercase tracking-widest">{faseFin.siguiente}</p>
        </div>

        <button
          onMouseEnter={playHoverSound}
          onClick={siguienteFase}
          className="mt-8 px-10 py-3 bg-white text-black font-black text-sm uppercase tracking-widest rounded-sm hover:bg-cyan-400 transition-transform duration-200 hover:scale-105 active:scale-95"
        >
          Continuar →
        </button>
      </div>
    );
  }

  // ── RENDER: Resultado final ──
  if (etapa === 'resultado') {
    return (
      <div className="max-w-2xl w-full px-4 py-10 flex flex-col items-center animate-fade-in">
        <p className="text-slate-500 text-xs uppercase tracking-[0.3em] mb-2">Proyecto completado</p>
        <h1 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter mb-1">Sistema de</h1>
        <h1 className="text-4xl md:text-5xl font-black text-cyan-400 uppercase italic tracking-tighter mb-8">Biblioteca</h1>

        {/* Stats */}
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

        {/* Rango */}
        <div className={`w-full border-2 rounded-lg px-6 py-6 text-center mb-8 ${rango.label === 'ORO' ? 'border-yellow-400/50 bg-yellow-950/20' : rango.label === 'PLATA' ? 'border-slate-400/50 bg-slate-800/20' : 'border-orange-700/50 bg-orange-950/20'}`}>
          <p className="text-4xl mb-2">{rango.symbol}</p>
          <p className={`text-2xl font-black uppercase tracking-widest ${rango.color}`}>RANGO {rango.label}</p>
          <p className="text-slate-400 text-sm mt-1">{rango.desc}</p>
        </div>

        {/* Botones */}
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <button
            onMouseEnter={playHoverSound}
            onClick={() => goToScreen('cascadaP1')}
            className="w-full py-3 bg-white text-black font-black text-sm uppercase tracking-widest rounded-sm hover:bg-cyan-400 transition-transform duration-200 hover:scale-105 active:scale-95"
          >
            Jugar de nuevo
          </button>
          <button
            onMouseEnter={playHoverSound}
            onClick={() => goToScreen('cascada')}
            className="w-full py-3 bg-transparent border border-white/30 text-slate-300 font-black text-sm uppercase tracking-widest rounded-sm transition-transform duration-200 hover:scale-105 active:scale-95"
          >
            Seleccionar otro proyecto
          </button>
          <button
            onMouseEnter={playHoverSound}
            onClick={() => goToScreen('menu')}
            className="w-full py-2 text-slate-500 text-xs uppercase tracking-widest hover:text-slate-300 transition-colors"
          >
            ← Menú Principal
          </button>
        </div>
      </div>
    );
  }

  // ── RENDER: Pregunta ──
  return (
    <div className="max-w-2xl w-full px-4 py-6 flex flex-col items-center animate-fade-in">

      {/* ── HUD SUPERIOR ── */}
      <div className="w-full mb-5 space-y-2">

        {/* Fila 1: fase actual + combo */}
        <div className="flex items-center justify-between">
          <span className={`text-xs font-black uppercase tracking-widest ${faseActual.color}`}>
            {faseActual.label} — Pregunta {preguntaIdx + 1}/{faseActual.preguntas.length}
          </span>
          {combo >= 2 && (
            <span className="text-xs font-black uppercase tracking-widest text-orange-400 animate-pulse">
              🔥 COMBO ×{combo}
            </span>
          )}
        </div>

        {/* Fila 2: barra de vida */}
        <div>
          <div className="flex justify-between text-xs text-slate-500 mb-1">
            <span className="uppercase tracking-wider">Integridad</span>
            <span className="font-black text-white">{vida}%</span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full ${vidaColor} transition-all duration-500 rounded-full`}
              style={{ width: `${porcentajeVida}%` }}
            />
          </div>
        </div>

        {/* Fila 3: barra de tiempo */}
        <div>
          <div className="flex justify-between text-xs text-slate-500 mb-1">
            <span className="uppercase tracking-wider">Tiempo</span>
            <span className={`font-black ${tiempoRestante <= 8 ? 'text-red-400 animate-pulse' : 'text-white'}`}>{tiempoRestante}s</span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full ${timerColor} transition-all duration-1000 rounded-full`}
              style={{ width: `${porcentajeTiempo}%` }}
            />
          </div>
        </div>

        {/* Fila 4: puntuación */}
        <div className="flex justify-between items-center">
          <span className="text-xs text-slate-500 uppercase tracking-wider">Puntuación</span>
          <span className="text-sm font-black text-white">{score.toLocaleString()} pts</span>
        </div>
      </div>

      {/* ── PREGUNTA ── */}
      <div className={`relative w-full border-l-4 ${faseActual.borderColor} pl-5 pr-4 py-5 bg-slate-900/60 rounded-r-lg mb-5`}>
        <p className="text-white font-bold text-base md:text-lg leading-relaxed">
          {preguntaActual.texto}
        </p>

        {/* Floating text (puntos / incorrecto) */}
        {floatingText && (
          <div className={`absolute -top-4 right-4 text-xl font-black pointer-events-none animate-float-up ${floatingText.correcto ? 'text-green-400' : 'text-red-400'}`}>
            {floatingText.texto}
          </div>
        )}
      </div>

      {/* ── OPCIONES ── */}
      <div className="w-full flex flex-col gap-3 mb-5">
        {preguntaActual.opciones.map((op, i) => {
          let estilo = 'border-white/20 text-slate-200 hover:border-white/50';
          if (respondido) {
            if (op.correcto) estilo = 'border-green-500 bg-green-950/40 text-green-300';
            else if (!op.correcto && feedback && !feedback.correcto && preguntaActual.opciones[i] === preguntaActual.opciones.find((_, idx) => idx === preguntaActual.opciones.indexOf(op))) estilo = 'border-white/10 text-slate-500';
            else estilo = 'border-white/10 text-slate-500';
          }

          return (
            <button
              key={i}
              onMouseEnter={!respondido ? playHoverSound : undefined}
              onClick={() => handleRespuesta(i)}
              disabled={respondido}
              className={`w-full text-left px-4 py-3 border rounded-lg text-sm font-bold transition-transform duration-150 ${respondido ? 'cursor-default' : 'hover:scale-[1.01] active:scale-[0.99]'} ${estilo} ${op.correcto && respondido ? '' : ''}`}
            >
              <span className="text-slate-500 mr-2 font-black">{['A', 'B', 'C', 'D'][i]})</span>
              {op.texto}
            </button>
          );
        })}
      </div>

      {/* ── FEEDBACK DE METTO ── */}
      {feedback && (
        <div className={`w-full flex gap-3 items-start p-4 rounded-lg border animate-fade-in ${feedback.correcto ? 'border-green-500/40 bg-green-950/30' : 'border-red-500/40 bg-red-950/30'}`}>
          <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-white/20">
            <img src="/metto.gif" alt="Metto" className="w-full h-full object-cover" onError={e => e.target.style.display='none'} />
          </div>
          <div>
            <p className={`text-xs font-black uppercase tracking-wider mb-1 ${feedback.correcto ? 'text-green-400' : 'text-red-400'}`}>
              {feedback.correcto ? '[ÉXITO] ¡Flujo óptimo!' : '[ERROR] ¡Alerta de integridad!'}
            </p>
            <p className="text-slate-300 text-sm">{feedback.texto}</p>
          </div>
        </div>
      )}

    </div>
  );
}