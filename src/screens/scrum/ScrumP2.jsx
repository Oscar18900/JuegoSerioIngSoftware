import React, { useState, useEffect, useRef, useCallback } from 'react';

// ─── DATOS DEL JUEGO ───────────────────────────────────────────────────────────
// Para hacer los demás niveles, copia este archivo y cambia solo este bloque.
// Ajusta NOMBRE_PROYECTO, SPRINTS (preguntas/narrativas) y los rangos si quieres.
const NOMBRE_PROYECTO = 'E-Commerce Global';

const SPRINTS = [
  {
    id: 'sprint1',
    numero: 1,
    label: 'SPRINT 1',
    color: 'text-blue-400',
    borderColor: 'border-blue-500',
    narrativa: 'El mercado es agresivo. La pasarela de pagos es prioridad, pero los directivos no dejan de pedir cambios. Protege el proceso.',
    preguntas: [
      {
        texto: 'A mitad del Sprint, el CEO le exige a un desarrollador que agregue un banner promocional urgente. ¿Qué debe suceder en Scrum?',
        opciones: [
          { texto: 'El desarrollador debe agregarlo porque es el CEO quien lo pide', correcto: false, feedback: 'En Scrum, nadie (ni el CEO) puede forzar al equipo a trabajar en algo fuera del Sprint Backlog en curso.' },
          { texto: 'El Scrum Master debe redirigir al CEO con el Product Owner', correcto: true, feedback: 'El PO es el único gestor del Product Backlog. El SM debe proteger al equipo de interrupciones externas para mantener el enfoque.' },
          { texto: 'El equipo debe votar si quieren hacer la tarea o no', correcto: false, feedback: 'No es una democracia de tareas. Cualquier requerimiento nuevo debe pasar por la priorización del Product Owner para futuros Sprints.' },
          { texto: 'Se detiene el Sprint actual para planificar la nueva tarea', correcto: false, feedback: 'Los Sprints no se detienen por nuevas peticiones. Se mantiene el enfoque en el Sprint Goal.' },
        ],
      },
      {
        texto: 'El proveedor principal de envíos del E-commerce cambia sus políticas, haciendo que el Objetivo del Sprint actual se vuelva obsoleto y no tenga valor comercial. ¿Quién tiene la autoridad para cancelar el Sprint?',
        opciones: [
          { texto: 'El Scrum Master, ya que es el responsable del proceso', correcto: false, feedback: 'El SM asegura que Scrum se entienda y se aplique, pero no toma decisiones sobre el producto o la inversión.' },
          { texto: 'Los Developers, por ser quienes ejecutan el trabajo', correcto: false, feedback: 'Los Developers deciden CÓMO trabajar, pero no tienen la autoridad para cancelar un Sprint por motivos de negocio.' },
          { texto: 'Cualquier stakeholder que esté financiando el proyecto', correcto: false, feedback: 'Los stakeholders tienen voz mediante el Product Owner, pero no pueden interactuar directamente para cancelar Sprints.' },
          { texto: 'Solo el Product Owner', correcto: true, feedback: 'Dado que el Product Owner es responsable de maximizar el valor y gestionar el negocio, es el único que puede cancelar un Sprint si el objetivo ya no tiene sentido.' },
        ],
      },
      {
        texto: 'Termina el Sprint. La pasarela de pagos es funcional y procesa tarjetas, pero carece de diseño CSS y no cumple la "Definición de Hecho" (DoD). ¿Se puede presentar en la Sprint Review?',
        opciones: [
          { texto: 'No, porque no es un Incremento terminado según la DoD', correcto: true, feedback: 'En Scrum, si un elemento no cumple la Definición de Hecho, no se presenta en la Review ni se libera. Regresa al Product Backlog.' },
          { texto: 'Sí, como una versión Beta para que los stakeholders la imaginen terminada', correcto: false, feedback: 'Scrum no presenta "casi terminados" o maquetas sin diseño si la DoD exige que esté listo para producción.' },
          { texto: 'Sí, pero solo si el Scrum Master autoriza la excepción', correcto: false, feedback: 'La DoD no es negociable a final del Sprint. Nadie puede autorizar un Incremento a medias.' },
          { texto: 'No, debe presentarse en una reunión privada solo con el CEO', correcto: false, feedback: 'Ocultar el progreso real va en contra de la "Transparencia", uno de los pilares fundamentales de Scrum.' },
        ],
      },
      {
        texto: 'El experto en bases de datos del equipo se enferma a mitad del Sprint. Hay historias urgentes que requieren cambios en la DB. ¿Qué hace el equipo en Scrum?',
        opciones: [
          { texto: 'El Scrum Master asigna las tareas de BD al programador más desocupado', correcto: false, feedback: 'El SM no asigna tareas. El equipo de desarrolladores es auto-gestionado.' },
          { texto: 'El equipo, siendo multifuncional y auto-gestionado, colabora para resolverlo y alcanzar el Sprint Goal', correcto: true, feedback: 'En Scrum no hay sub-títulos (ej. "solo soy Frontend"). El equipo entero es responsable de encontrar la manera de lograr el objetivo.' },
          { texto: 'Se pausan todas las historias que dependan de la base de datos hasta que vuelva', correcto: false, feedback: 'Pausar el trabajo compromete el Sprint. El equipo debe adaptarse.' },
          { texto: 'Se contrata inmediatamente a un freelancer para el resto del Sprint', correcto: false, feedback: 'Modificar la composición del equipo durante un Sprint causa interrupciones y reduce la velocidad de entrega.' },
        ],
      },
      {
        texto: 'Durante la Refinación del Backlog (Backlog Refinement), el Product Owner divide historias de usuario muy grandes en otras más pequeñas. ¿Por qué es importante esta actividad?',
        opciones: [
          { texto: 'Para asegurar que cada historia pueda completarse dentro de un solo Sprint', correcto: true, feedback: 'El refinamiento añade detalles y divide elementos para que sean lo suficientemente pequeños como para ser "Terminados" en un Sprint.' },
          { texto: 'Para justificar el salario del Product Owner ante los directivos', correcto: false, feedback: 'El refinamiento es una actividad crítica de inspección, no de justificación de roles.' },
          { texto: 'Para que el Scrum Master pueda generar diagramas de Gantt más detallados', correcto: false, feedback: 'Scrum no utiliza diagramas de Gantt; utiliza empirismo y control de procesos.' },
          { texto: 'Para evitar hacer la Sprint Planning en el futuro', correcto: false, feedback: 'El refinamiento facilita la Sprint Planning, pero de ninguna manera la reemplaza.' },
        ],
      },
    ],
  },
  {
    id: 'sprint2',
    numero: 2,
    label: 'SPRINT 2',
    color: 'text-purple-400',
    borderColor: 'border-purple-500',
    narrativa: 'El Black Friday se acerca. La presión aumenta, la deuda técnica sale a la luz y hay choques entre el alcance y la capacidad. Sobrevive.',
    preguntas: [
      {
        texto: 'El Product Owner presiona para incluir 5 historias urgentes para el Black Friday en la Sprint Planning, superando la velocidad histórica del equipo. ¿Quién decide cuánto trabajo entra al Sprint?',
        opciones: [
          { texto: 'El Scrum Master, buscando un punto medio', correcto: false, feedback: 'El SM facilita el evento, pero no tiene autoridad para decidir el volumen de trabajo técnico.' },
          { texto: 'Los Developers', correcto: true, feedback: 'Solo los Developers pueden evaluar su propia capacidad y seleccionar cuántos elementos del Product Backlog pueden comprometerse a terminar.' },
          { texto: 'El Product Owner, ya que es el dueño del negocio', correcto: false, feedback: 'El PO dicta la prioridad (QUÉ se hace primero), pero el equipo dicta la capacidad (CUÁNTO se puede hacer).' },
          { texto: 'El CEO, debido a la urgencia comercial del Black Friday', correcto: false, feedback: 'Nadie fuera del equipo Scrum tiene autoridad para forzar trabajo dentro de la planificación del Sprint.' },
        ],
      },
      {
        texto: 'Durante el Sprint, el equipo descubre que integrar el motor de recomendaciones es mucho más complejo de lo estimado. ¿Qué deberían hacer?',
        opciones: [
          { texto: 'Trabajar horas extra en secreto para no decepcionar al cliente', correcto: false, feedback: 'Las horas extra sistemáticas son anti-ágiles. Scrum busca un ritmo sostenible y total transparencia.' },
          { texto: 'Negociar el alcance del Sprint Backlog con el Product Owner sin comprometer el Sprint Goal', correcto: true, feedback: 'Si el trabajo resulta ser diferente a lo esperado, los Developers colaboran con el PO para ajustar el alcance manteniendo el objetivo.' },
          { texto: 'Cancelar el Sprint y volver a la fase de diseño técnico', correcto: false, feedback: 'Solo el PO puede cancelar el Sprint, y no se cancela por problemas técnicos si el objetivo comercial aún es válido.' },
          { texto: 'Culpar al equipo de diseño en el Daily Scrum', correcto: false, feedback: 'Scrum se basa en el respeto y el compromiso colectivo, no en buscar culpables.' },
        ],
      },
      {
        texto: 'En la Sprint Review del e-commerce, el equipo muestra el nuevo carrito de compras. ¿Cuál es el propósito real de esta reunión?',
        opciones: [
          { texto: 'Hacer una presentación en PowerPoint para que los stakeholders firmen la aceptación', correcto: false, feedback: 'No es una firma de aceptación formal ni una reunión de PowerPoint. Es una sesión de trabajo colaborativa.' },
          { texto: 'Inspeccionar el Incremento y adaptar el Product Backlog colaborando con los stakeholders', correcto: true, feedback: 'La Review sirve para mostrar software funcionando, recibir feedback real del mercado/usuarios y decidir juntos qué construir a continuación.' },
          { texto: 'Evaluar el desempeño técnico de cada desarrollador frente a los gerentes', correcto: false, feedback: 'El desempeño técnico e individual no se discute con los stakeholders. Eso rompería la confianza.' },
          { texto: 'Explicar los bugs y fallas técnicas del código', correcto: false, feedback: 'No es una reunión técnica de depuración, es una reunión de negocio enfocada en el valor entregado.' },
        ],
      },
      {
        texto: 'En el Daily Scrum, cada desarrollador se dirige al Scrum Master para reportarle sus tareas completadas y pedirle permiso para la siguiente. ¿Por qué es un antipatrón?',
        opciones: [
          { texto: 'Porque el Daily Scrum debe ser un reporte dirigido al Product Owner', correcto: false, feedback: 'El Product Owner ni siquiera está obligado a asistir al Daily Scrum.' },
          { texto: 'Porque no lo están registrando en un documento formal', correcto: false, feedback: 'Scrum minimiza la documentación innecesaria en favor de interacciones directas.' },
          { texto: 'Porque el Scrum Master solo debe recibir reportes semanales, no diarios', correcto: false, feedback: 'El SM no es un jefe que recibe reportes de estado. Es un líder servicial.' },
          { texto: 'Porque el Daily Scrum es un evento de sincronización de los Developers para los Developers', correcto: true, feedback: 'El Daily no es un reporte de estado para ningún jefe. Es para que el equipo inspeccione su progreso hacia el Sprint Goal y adapte su plan.' },
        ],
      },
      {
        texto: 'El equipo falló miserablemente y no pudo entregar el módulo de descuentos. En la Sprint Retrospective, ¿qué actitud deben tomar?',
        opciones: [
          { texto: 'Culpar a la presión de los directivos por el Black Friday', correcto: false, feedback: 'Quejarse no soluciona el proceso interno. La retrospectiva debe ser constructiva y proactiva.' },
          { texto: 'Inspeccionar cómo fue la colaboración, identificar el problema raíz y crear mejoras procesables', correcto: true, feedback: 'La Retrospectiva busca mejora continua y adaptación. Asumen la responsabilidad como equipo y ajustan su forma de trabajar.' },
          { texto: 'El Product Owner debe reprender al equipo por perder dinero', correcto: false, feedback: 'La Retrospectiva es un espacio seguro. Reprender destruye la confianza y la transparencia.' },
          { texto: 'Omitir la Retrospectiva para ganar tiempo y empezar el código del próximo Sprint', correcto: false, feedback: 'Omitir la Retrospectiva asegura que los mismos errores se repitan. Es un evento crítico e ineludible.' },
        ],
      },
    ],
  },
];

const TIEMPO_LIMITE = 25;
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

export default function ScrumP2({ goToScreen, playHoverSound, mainAudioRef }) {
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
        setTimeout(() => goToScreen('gameover', { score, vida: 0, proyectoOrigen: 'scrumP2' }), 2000);
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
    if (etapa === 'resultado') saveHighScore('scrumP2', score);
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
          Proyecto 2 — {NOMBRE_PROYECTO}
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
          <button onMouseEnter={playHoverSound} onClick={() => goToScreen('scrumP2')}
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