import React, { useState, useEffect, useRef, useCallback } from 'react';
import { saveHighScore } from '../SeleccionCascada';

// ─── DATOS DEL JUEGO ───────────────────────────────────────────────────────────
const FASES = [
  {
    id: 'analisis', label: 'ANÁLISIS', color: 'text-cyan-400', borderColor: 'border-cyan-500',
    narrativa: 'Requisitos legales, médicos y de confidencialidad (HIPAA/NOM) en proceso de congelamiento.',
    siguiente: 'Iniciando FASE DE DISEÑO...', danio: 35,
    preguntas: [
      { texto: 'Un consorcio de hospitales solicita agregar un módulo de telemedicina de emergencia cuando el Análisis ya está al 99%. ¿Qué procede en un modelo Cascada estricto?',
        opciones: [
          { texto: 'Detener el cierre de fase, analizar el impacto global, reestimar y no avanzar hasta que esté documentado y firmado', correcto: true, feedback: 'En Cascada, no se puede avanzar si el alcance sigue cambiando. Las fases son mutuamente excluyentes.' },
          { texto: 'Avanzar a Diseño con el 99% listo y agregar la telemedicina en un par de semanas', correcto: false, feedback: 'Cascada no permite iniciar el Diseño si los requisitos no están 100% cerrados.' },
          { texto: 'Rechazar la solicitud para siempre porque Cascada no acepta cambios', correcto: false, feedback: 'Cascada acepta cambios ANTES de congelar la fase. Una vez congelada, es cuando el cambio se vuelve casi imposible.' },
          { texto: 'Codificar el módulo de telemedicina de inmediato como un MVP', correcto: false, feedback: 'MVP es un concepto ágil. Aquí no se escribe código hasta la tercera fase.' },
        ],
      },
      { texto: '¿Por qué es absolutamente crítico que el documento de requisitos no tenga ambigüedades en un Sistema Nacional de Salud bajo Cascada?',
        opciones: [
          { texto: 'Para que los desarrolladores puedan ser creativos al interpretar las reglas', correcto: false, feedback: 'En sistemas críticos la creatividad en la interpretación de reglas cuesta vidas.' },
          { texto: 'Porque las fases posteriores asumirán estos requisitos como leyes inmutables, y un error aquí se arrastrará hasta el final', correcto: true, feedback: 'El efecto "bola de nieve". Un error de Análisis que llega a Pruebas puede costar millones y requerir rehacer todo.' },
          { texto: 'Para poder cobrarle más horas de consultoría al gobierno', correcto: false, feedback: 'Esto es un simulador de ingeniería de software, no de evasión fiscal.' },
          { texto: 'Porque así el Scrum Master puede planear mejor los Sprints', correcto: false, feedback: 'Cascada no utiliza Sprints ni Scrum Masters.' },
        ],
      },
    ],
  },
  {
    id: 'disenio', label: 'DISEÑO', color: 'text-blue-400', borderColor: 'border-blue-500',
    narrativa: 'Arquitectura de alta disponibilidad y esquemas de encriptación médica finalizados.',
    siguiente: 'Iniciando FASE DE IMPLEMENTACIÓN...', danio: 30,
    preguntas: [
      { texto: 'El sistema debe manejar 50 millones de expedientes con tolerancia a fallos del 99.999%. ¿Cuándo se decide la topología de servidores y balanceadores de carga?',
        opciones: [
          { texto: 'Durante las Pruebas, según cómo responda el sistema', correcto: false, feedback: 'Probar a ciegas sin una arquitectura diseñada para escalar garantiza el colapso del sistema.' },
          { texto: 'Mientras los programadores van haciendo el código', correcto: false, feedback: 'Los programadores no pueden escribir código óptimo sin saber dónde y cómo se ejecutará.' },
          { texto: 'Exclusivamente durante la fase de Diseño, antes de escribir cualquier código de la aplicación', correcto: true, feedback: 'La infraestructura crítica se diseña y aprueba formalmente antes de la Implementación.' },
          { texto: 'En la fase de Análisis, junto con las entrevistas a los médicos', correcto: false, feedback: 'El Análisis define QUÉ debe hacer (tolerancia a fallos), el Diseño define CÓMO se logrará (topología).' },
        ],
      },
      { texto: 'Se descubre que el protocolo de red elegido en el documento de Diseño tiene una vulnerabilidad de día cero recién publicada. ¿Cómo responde el flujo Cascada?',
        opciones: [
          { texto: 'Se congela el avance, se rediseña la arquitectura y se actualiza la especificación formal antes de permitir la implementación', correcto: true, feedback: 'En sistemas críticos de salud, no se improvisan parches. Se debe modificar la arquitectura formalmente.' },
          { texto: 'Se le dice a los programadores que usen otro protocolo y ya', correcto: false, feedback: 'La trazabilidad se pierde. El código no coincidiría con la documentación oficial.' },
          { texto: 'Se documenta como "riesgo conocido" y se pasa a Implementación', correcto: false, feedback: 'Un riesgo de seguridad crítico en datos médicos no se ignora.' },
          { texto: 'Se regresa a la fase de Análisis para cambiar las leyes de salud', correcto: false, feedback: 'Las leyes no cambian, el diseño técnico es el que falló y debe corregirse.' },
        ],
      },
    ],
  },
  {
    id: 'implementacion', label: 'IMPLEMENTACIÓN', color: 'text-yellow-400', borderColor: 'border-yellow-500',
    narrativa: 'Codificación de módulos de salud e integración de bases de datos biométricas.',
    siguiente: 'Iniciando FASE DE PRUEBAS...', danio: 30,
    preguntas: [
      { texto: 'El equipo de desarrollo biométrico nota que la API de huellas dactilares especificada en el Diseño fue discontinuada ayer. ¿Qué acción refleja la metodología Cascada pura?',
        opciones: [
          { texto: 'Buscar una API similar en Google e implementarla por su cuenta', correcto: false, feedback: 'Rompiste el contrato de diseño. La nueva API podría no cumplir con las normativas de seguridad aprobadas.' },
          { texto: 'Ignorar la biometría y avanzar con inicio de sesión por contraseña', correcto: false, feedback: 'No puedes omitir funcionalidades aprobadas en el Análisis sin control de cambios.' },
          { texto: 'Escalar el problema a los arquitectos para que retrocedan a la fase de Diseño y emitan una nueva especificación aprobada', correcto: true, feedback: 'Un obstáculo arquitectónico durante la codificación obliga a hacer un paso atrás formal para actualizar el plano.' },
          { texto: 'Hacer su propia API desde cero', correcto: false, feedback: 'Esto destruiría el presupuesto y el cronograma del proyecto masivo.' },
        ],
      },
      { texto: 'Un desarrollador Senior escribe un algoritmo de búsqueda de pacientes que es 10 veces más rápido que el diseñado, pero usa estructuras de datos diferentes. ¿Es aceptable?',
        opciones: [
          { texto: 'No, en sistemas críticos bajo Cascada, el código debe auditarse contra el diseño exacto aprobado para garantizar trazabilidad', correcto: true, feedback: 'La disciplina es absoluta. Cambiar la estructura de datos afecta la base de datos y la memoria RAM calculada por los arquitectos.' },
          { texto: 'Sí, porque el rendimiento siempre tiene prioridad sobre la documentación', correcto: false, feedback: 'Falso en Cascada. La prioridad es la conformidad con los requisitos y el diseño.' },
          { texto: 'Sí, siempre y cuando no le diga a QA', correcto: false, feedback: 'Ocultar desviaciones arquitectónicas es una falta profesional grave.' },
          { texto: 'No, porque el algoritmo probablemente tiene virus', correcto: false, feedback: 'No se asume malicia, sino falta de cumplimiento de las especificaciones.' },
        ],
      },
    ],
  },
  {
    id: 'pruebas', label: 'PRUEBAS', color: 'text-green-400', borderColor: 'border-green-500',
    narrativa: 'Simulación de estrés a nivel nacional y auditoría de integridad de expedientes.',
    siguiente: 'SISTEMA LISTO PARA DESPLIEGUE CRÍTICO.', danio: 40,
    preguntas: [
      { texto: 'Durante la auditoría final, se descubre que el sistema mezcla los tipos de sangre de pacientes homónimos por un error de concepto en la estructura de la base de datos. ¿Cuál es la consecuencia en Cascada?',
        opciones: [
          { texto: 'Un desastre financiero. Se debe retroceder formalmente a las fases de Diseño y Análisis para reconstruir el núcleo del sistema', correcto: true, feedback: 'El clásico talón de Aquiles de Cascada: los errores fundamentales encontrados hasta el final destruyen todo el proyecto.' },
          { texto: 'Se le pone un "parche visual" en el frontend para ocultar el error', correcto: false, feedback: 'Hacer eso en un sistema de salud te enviará directamente a prisión.' },
          { texto: 'Se lanza como versión Beta para que los hospitales reporten los errores', correcto: false, feedback: 'No existen versiones Beta en software de infraestructura crítica de soporte vital.' },
          { texto: 'Se cambia la metodología a Scrum inmediatamente', correcto: false, feedback: 'Cambiar de metodología al final del ciclo de vida es imposible y absurdo.' },
        ],
      },
      { texto: 'Las Pruebas demuestran que el sistema procesa recetas médicas exactamente como dice el documento de Análisis de hace 2 años. Pero los doctores dicen que la Ley de Salud cambió hace 6 meses. ¿El sistema pasa la fase de Pruebas?',
        opciones: [
          { texto: 'No, porque el sistema ya no sirve en el mundo real', correcto: false, feedback: 'Puede que en la práctica no sirva, pero técnicamente el equipo de pruebas audita contra el documento firmado, no contra las noticias.' },
          { texto: 'Se debe reprogramar todo gratis porque el cliente siempre tiene la razón', correcto: false, feedback: 'El riesgo de obsolescencia lo asume el cliente al firmar los requisitos hace 2 años.' },
          { texto: 'Se le echa la culpa al equipo de QA por no leer las noticias', correcto: false, feedback: 'QA valida contra especificaciones, no contra periódicos.' },
          { texto: 'Sí, porque el sistema cumple perfectamente los requisitos congelados. La desactualización legal requerirá un contrato de mantenimiento o un proyecto nuevo', correcto: true, feedback: 'El sistema "hace lo que se le pidió". La incapacidad de Cascada para adaptarse a entornos cambiantes es su mayor debilidad.' },
        ],
      },
    ],
  },
];
const TIEMPO_LIMITE = 30;
const PUNTOS_BASE = 100;

function calcularPuntos(tiempoRestante) {
  return PUNTOS_BASE + Math.floor((tiempoRestante / TIEMPO_LIMITE) * 50);
}

function getRango(score) {
  if (score >= 700) return { label: 'ORO',    color: 'text-yellow-400', symbol: '🥇', desc: 'Rendimiento excepcional.' };
  if (score >= 400) return { label: 'PLATA',  color: 'text-slate-300',  symbol: '🥈', desc: 'Desempeño aceptable. Hay áreas de mejora.' };
  return                   { label: 'BRONCE', color: 'text-orange-400', symbol: '🥉', desc: 'De milagro no te corrieron.' };
}

export default function CascadaP3({ goToScreen, playHoverSound, mainAudioRef }) {
  const [etapa, setEtapa] = useState('countdown');
  const [countdown, setCountdown] = useState(3);
  const [faseIdx, setFaseIdx] = useState(0);
  const [preguntaIdx, setPreguntaIdx] = useState(0);
  const [vida, setVida] = useState(100);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [tiempoRestante, setTiempoRestante] = useState(TIEMPO_LIMITE);
  const [feedback, setFeedback] = useState(null);
  const [respondido, setRespondido] = useState(false);

  // Efectos visuales
  const [centerPopup, setCenterPopup] = useState(null); // { lines, correcto, key }
  const [screenFlash, setScreenFlash] = useState(null); // 'correct' | 'incorrect'
  const [shakeHUD, setShakeHUD] = useState(false);

  const timerRef = useRef(null);
  const floatingTimer = useRef(null);
  const flashTimer = useRef(null);

  const faseActual = FASES[faseIdx];
  const preguntaActual = faseActual?.preguntas[preguntaIdx];

  // ── Música fondocascada ──
useEffect(() => {
    // 1. Apagar forzosamente la música principal del menú
    const main = mainAudioRef?.current;
    if (main) {
      main.pause();
      main.volume = 0;
    }

    const audio = new Audio('/fondocascada.mp3');
    audio.loop = true;
    audio.volume = 0;
    audio.play().catch(() => {});

    const iv = setInterval(() => {
      // Mantenemos a raya la música principal por si la transición intentó subirle el volumen
      if (main) main.volume = 0; 

      if (audio.volume < 0.09) audio.volume = Math.min(0.1, audio.volume + 0.01);
      else clearInterval(iv);
    }, 80);

    return () => { 
      clearInterval(iv); 
      audio.pause(); 
      audio.currentTime = 0; 
      
      // 2. Reactivar la música principal gradualmente al salir (volver al menú)
      if (main) {
        main.play().catch(() => {});
        const fadeInMain = setInterval(() => {
          if (main.volume < 0.09) main.volume = Math.min(0.1, main.volume + 0.01);
          else clearInterval(fadeInMain);
        }, 80);
      }
    };
  }, [mainAudioRef]); // <-- Añade mainAudioRef a las dependencias

  // ── Sonidos ──
  const playCorrecta   = () => { try { const a = new Audio('/correcta.mp3');    a.volume = 0.6; a.play(); } catch {} };
  const playIncorrecta = () => { try { const a = new Audio('/incorrecta.mp3');  a.volume = 0.6; a.play(); } catch {} };
  const playTemporizador = () => { try { const a = new Audio('/temporizador.mp3'); a.volume = 0.5; a.play(); } catch {} };

  // ── Countdown ──
// ── Countdown ──
  useEffect(() => {
    if (etapa !== 'countdown') return;
    
    // Solo dispara el audio una vez al inicio
    if (countdown === 3) {
      playTemporizador();
    }

    if (countdown > 0) {
      // Resta 1 cada segundo mientras sea mayor a 0
      const t = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(t);
    } else if (countdown === 0) { 
      // Cuando llega a 0, espera 0.5s para que se lea "¡COMIENZA!" antes de avanzar
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
      const danio = faseActual.danio;
      const nuevaVida = Math.max(0, vida - danio);
      setVida(nuevaVida);
      setCombo(0);
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
  setTimeout(() => goToScreen('gameover', { score, vida: 0, proyectoOrigen: 'cascadaP3' }), 2000);
  return;
}
    }

    clearTimeout(flashTimer.current);
    flashTimer.current = setTimeout(() => setScreenFlash(null), 600);
    clearTimeout(floatingTimer.current);
    floatingTimer.current = setTimeout(() => setCenterPopup(null), 1400);

    setTimeout(() => avanzar(correcto), 2200);
  }, [respondido, preguntaActual, tiempoRestante, combo, vida, faseActual, score]);

  const avanzar = (correcto) => {
    const esUltimaPreguntaDeFase = preguntaIdx >= faseActual.preguntas.length - 1;
    const esUltimaFase = faseIdx >= FASES.length - 1;
    if (esUltimaPreguntaDeFase) {
      if (esUltimaFase) setEtapa('resultado');
      else setEtapa('transicion');
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

  useEffect(() => {
    if (etapa === 'resultado') saveHighScore('cascadaP3', score);
  }, [etapa]);

  const rango = getRango(score);
  const porcentajeVida = Math.max(0, vida);
  const porcentajeTiempo = (tiempoRestante / TIEMPO_LIMITE) * 100;
  const timerColor = tiempoRestante > 15 ? 'bg-green-500' : tiempoRestante > 8 ? 'bg-yellow-500' : 'bg-red-500';
  const vidaColor = vida > 60 ? 'bg-green-500' : vida > 30 ? 'bg-yellow-500' : 'bg-red-500';

  // ── COUNTDOWN ──
  if (etapa === 'countdown') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
        <p className="text-slate-400 text-xs uppercase tracking-widest mb-6">Proyecto 3 — Sistema Nacional de Salud</p>
        {countdown > 0 ? (
          <div key={countdown} className="text-9xl font-black text-white animate-ping-once drop-shadow-[0_0_40px_rgba(255,255,255,0.5)]">
            {countdown}
          </div>
        ) : (
          <div className="text-5xl font-black text-cyan-400 uppercase tracking-widest animate-fade-in">¡COMIENZA!</div>
        )}
      </div>
    );
  }

  // ── TRANSICIÓN ──
  if (etapa === 'transicion') {
    const faseFin = FASES[faseIdx];
    return (
      <div className="max-w-2xl w-full px-4 py-10 flex flex-col items-center animate-fade-in">
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
        <div className="w-full flex justify-between text-xs text-white uppercase tracking-widest mb-8 border border-white/10 rounded px-4 py-2">
          <span>Integridad: <span className="font-black">{vida}%</span></span>
          <span>Puntos: <span className="font-black">{score.toLocaleString()}</span></span>
        </div>
        <div className={`border-2 ${faseFin.borderColor} rounded-lg px-6 py-8 text-center w-full bg-slate-900/60`}>
          <p className={`text-xs font-black uppercase tracking-widest ${faseFin.color} mb-2`}>FASE COMPLETADA</p>
          <p className="text-white font-black text-2xl uppercase tracking-tight mb-2">{faseFin.label}</p>
          <p className="text-slate-400 text-sm mb-6">{faseFin.narrativa}</p>
          <p className="text-slate-500 text-xs uppercase tracking-widest">{faseFin.siguiente}</p>
        </div>
        <button onMouseEnter={playHoverSound} onClick={siguienteFase}
          className="mt-8 px-10 py-3 bg-white text-black font-black text-sm uppercase tracking-widest rounded-sm hover:bg-cyan-400 transition-transform duration-200 hover:scale-105 active:scale-95">
          Continuar →
        </button>
      </div>
    );
  }

  // ── RESULTADO ──
  if (etapa === 'resultado') {
    return (
      <div className="max-w-2xl w-full px-4 py-10 flex flex-col items-center animate-fade-in">
        <p className="text-slate-500 text-xs uppercase tracking-[0.3em] mb-2">Proyecto completado</p>
        <h1 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter mb-1">Sistema de</h1>
        <h1 className="text-4xl md:text-5xl font-black text-cyan-400 uppercase italic tracking-tighter mb-8">Biblioteca</h1>
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
          <button onMouseEnter={playHoverSound} onClick={() => goToScreen('cascadaP3')}
            className="w-full py-3 bg-white text-black font-black text-sm uppercase tracking-widest rounded-sm hover:bg-cyan-400 transition-transform duration-200 hover:scale-105 active:scale-95">
            Jugar de nuevo
          </button>
          <button onMouseEnter={playHoverSound} onClick={() => goToScreen('cascada')}
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
    <div className="max-w-2xl w-full px-4 py-6 flex flex-col items-center animate-fade-in relative">



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
          <span className={`text-xs font-black uppercase tracking-widest ${faseActual.color}`}>
            {faseActual.label} — {preguntaIdx + 1}/{faseActual.preguntas.length}
          </span>
          {combo >= 2 && (
            <span className="text-xs font-black uppercase tracking-widest text-orange-400 animate-pulse">
              🔥 COMBO ×{combo}
            </span>
          )}
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
          <div key={preguntaIdx} className="w-full animate-fade-in flex flex-col items-center">
      {/* Pregunta */}
      <div className={`relative w-full border-l-4 ${faseActual.borderColor} pl-5 pr-4 py-5 bg-slate-900/60 rounded-r-lg mb-5`}>
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
        <div className={`w-full flex gap-3 items-start p-4 rounded-lg border animate-fade-in
          ${feedback.correcto ? 'border-green-500/40 bg-green-950/30' : 'border-red-500/40 bg-red-950/30'}`}>
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