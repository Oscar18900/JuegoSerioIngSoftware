import React, { useState, useEffect, useRef, useCallback } from 'react';

// ─── DATOS DEL JUEGO ───────────────────────────────────────────────────────────
// Para hacer los demás niveles, copia este archivo y cambia solo este bloque.
// Ajusta NOMBRE_PROYECTO, SPRINTS (preguntas/narrativas) y los rangos si quieres.
const NOMBRE_PROYECTO = 'Plataforma Educativa Nacional';

const SPRINTS = [
  {
    id: 'sprint1',
    numero: 1,
    label: 'SPRINT 1',
    color: 'text-indigo-400',
    borderColor: 'border-indigo-500',
    narrativa: 'Inicio de ciclo escolar. Múltiples equipos trabajando en un solo producto masivo. El Ministerio de Educación exige resultados perfectos.',
    preguntas: [
      {
        texto: 'La Plataforma Educativa es tan grande que requiere 3 equipos Scrum trabajando simultáneamente. ¿Cómo se debe gestionar el Product Backlog?',
        opciones: [
          { texto: 'Cada equipo debe tener su propio Product Backlog y su propio Product Owner', correcto: false, feedback: 'Error grave. Múltiples backlogs para un mismo producto destruyen la alineación y crean silos.' },
          { texto: 'Un solo Product Backlog y un solo Product Owner para todos los equipos', correcto: true, feedback: 'La regla de oro del escalado en Scrum: Un Producto = Un Product Backlog = Un Product Owner. Todos los equipos comparten la misma fuente de verdad y prioridades.' },
          { texto: 'Un comité de Product Owners que votan las prioridades del backlog compartido', correcto: false, feedback: 'El Product Owner es una sola persona, no un comité. Esto asegura claridad en la toma de decisiones.' },
          { texto: 'No se usa Product Backlog, cada equipo trabaja con los requerimientos directos de diferentes escuelas', correcto: false, feedback: 'Eso es caos absoluto. El Product Backlog es obligatorio.' },
        ],
      },
      {
        texto: 'El módulo de "Aulas Virtuales" es una Épica gigantesca que abarca todo el backlog. ¿De quién es la responsabilidad de desglosarlo en elementos listos para un Sprint?',
        opciones: [
          { texto: 'Única y exclusivamente del Product Owner, quien debe entregar todo detallado', correcto: false, feedback: 'El PO no trabaja aislado. Refinar historias complejas sin el equipo técnico lleva a estimaciones irreales.' },
          { texto: 'Del Scrum Master, ya que es el facilitador del proceso', correcto: false, feedback: 'El SM facilita que el evento ocurra, pero no es el responsable técnico ni de negocio para dividir el trabajo.' },
          { texto: 'De los Analistas de Negocio del Ministerio de Educación', correcto: false, feedback: 'Scrum no reconoce el rol de Analista de Negocio dentro del equipo central; el trabajo lo hace el Scrum Team.' },
          { texto: 'Es una actividad colaborativa de refinamiento entre el Product Owner y los Developers', correcto: true, feedback: 'El Refinamiento es un esfuerzo conjunto. El PO aporta el valor y negocio, y los Developers aportan la viabilidad y detalles técnicos.' },
        ],
      },
      {
        texto: 'El auditor del Ministerio quiere asistir al Daily Scrum todos los días para "monitorear el progreso y presionar a los vagos". ¿Qué debe hacer el Scrum Master?',
        opciones: [
          { texto: 'Permitirle la entrada y pedir a los Developers que le den su reporte de estado', correcto: false, feedback: 'El Daily Scrum no es un reporte de estado para stakeholders. Esto destruiría la auto-gestión.' },
          { texto: 'Prohibirle la entrada de manera diplomática para proteger el espacio del equipo', correcto: true, feedback: 'El Daily Scrum es una reunión interna y exclusiva de los Developers. El SM debe proteger al equipo de interferencias externas y micromanagement.' },
          { texto: 'Mover la reunión a una hora donde el auditor no pueda asistir', correcto: false, feedback: 'Evadir el problema no es ágil. El SM debe educar al auditor sobre las reglas de Scrum.' },
          { texto: 'Dejar que el auditor dirija la reunión para ahorrarle tiempo al Scrum Master', correcto: false, feedback: 'El SM ni siquiera dirige la reunión; los Developers lo hacen. Un externo jamás la dirige.' },
        ],
      },
      {
        texto: 'Durante la Sprint Planning, los Developers advierten que el servidor actual no soportará las videoconferencias, pero el PO insiste en codificarlas ya. ¿Qué prevalece?',
        opciones: [
          { texto: 'La decisión del Product Owner, porque él manda sobre el producto', correcto: false, feedback: 'El PO manda en el QUÉ (prioridad), pero no puede forzar un CÓMO (viabilidad técnica) si los Developers advierten que fallará.' },
          { texto: 'Se lleva a votación con el Scrum Master como desempate', correcto: false, feedback: 'Scrum no resuelve impedimentos técnicos por votación política.' },
          { texto: 'La decisión técnica de los Developers sobre cuánto pueden comprometerse a entregar con calidad', correcto: true, feedback: 'Los Developers tienen la última palabra sobre el "Cómo" y el tamaño del compromiso. Si técnicamente no es viable con calidad, no entra al Sprint.' },
          { texto: 'Se codifica a medias y se arregla el servidor en el siguiente Sprint', correcto: false, feedback: 'Generar deuda técnica intencional y planificada viola la Definición de Hecho (DoD).' },
        ],
      },
      {
        texto: 'Termina el Sprint. El módulo de calificaciones funciona perfecto, pero los Developers olvidaron escribir los manuales requeridos por la "Definición de Hecho". ¿Qué procede?',
        opciones: [
          { texto: 'El Incremento no está Terminado. No se presenta en la Review y regresa al Backlog', correcto: true, feedback: 'La DoD es binaria: o cumple TODO, o no está Terminado. Sin manuales, no hay incremento válido.' },
          { texto: 'Se presenta en la Review y se promete enviar los manuales por correo el lunes', correcto: false, feedback: 'No se hacen promesas de trabajo no terminado en Scrum. Se es 100% transparente con el estado real.' },
          { texto: 'El Scrum Master escribe los manuales rápido antes de la reunión', correcto: false, feedback: 'El SM no hace el trabajo de desarrollo para salvar el Sprint.' },
          { texto: 'Se aprueba porque el código funciona, que es lo más importante en Agile', correcto: false, feedback: 'Software funcionando es clave, pero Agile también exige excelencia técnica y cumplimiento de estándares (DoD).' },
        ],
      },
    ],
  },
  {
    id: 'sprint2',
    numero: 2,
    label: 'SPRINT 2',
    color: 'text-rose-400',
    borderColor: 'border-rose-500',
    narrativa: 'Mitad de semestre. Los servidores colapsan por los exámenes finales. Empirismo puro frente al caos corporativo.',
    preguntas: [
      {
        texto: 'A mitad del Sprint, la base de datos se corrompe afectando a 500 escuelas. El Sprint Goal era "Crear foros de discusión". ¿Qué sucede?',
        opciones: [
          { texto: 'El equipo ignora la base de datos y sigue programando foros de discusión', correcto: false, feedback: 'Un equipo ágil responde al cambio. Ignorar un desastre en producción por seguir un plan es negligencia extrema.' },
          { texto: 'El Scrum Master pausa el Sprint por 3 días hasta que se arregle', correcto: false, feedback: 'Los Sprints jamás se pausan ni se extienden en el tiempo.' },
          { texto: 'Los Developers trabajan horas extras extremas para hacer ambas cosas', correcto: false, feedback: 'Forzar horas extras destruye la calidad. Scrum fomenta el ritmo sostenible.' },
          { texto: 'El PO y los Developers negocian. Si el Sprint Goal quedó obsoleto, el PO puede cancelar el Sprint', correcto: true, feedback: 'Si una emergencia hace que el objetivo del Sprint ya no tenga sentido, el PO es el único autorizado para cancelarlo y planificar de nuevo.' },
        ],
      },
      {
        texto: 'El rector de la Universidad exige saber por qué la "Velocidad" del equipo bajó de 40 a 30 Story Points este Sprint. ¿Cómo responde el Scrum Master?',
        opciones: [
          { texto: 'Promete que el equipo hará 50 puntos el próximo Sprint para compensar', correcto: false, feedback: 'Prometer puntos inflados destruye la estimación real y empuja al equipo al agotamiento.' },
          { texto: 'Le exige a los Developers trabajar los fines de semana', correcto: false, feedback: 'Antipatrón grave de liderazgo.' },
          { texto: 'Explica que la velocidad es una métrica interna de capacidad, no de desempeño, y varió por la alta complejidad técnica encontrada', correcto: true, feedback: 'La Velocidad sirve para que el equipo planifique mejor, NO es un KPI de recursos humanos para castigar.' },
          { texto: 'Le echa la culpa al Product Owner por escribir malas historias', correcto: false, feedback: 'El SM no busca culpables, protege al equipo y explica el empirismo: descubrieron cosas nuevas.' },
        ],
      },
      {
        texto: 'En la Retrospectiva, los Developers admiten que la calidad del código bajó porque el Product Owner los apuró demasiado. ¿Cuál es el resultado deseado de esta reunión?',
        opciones: [
          { texto: 'Identificar el problema y crear una acción de mejora concreta (ej. respetar el límite de capacidad de la Planning)', correcto: true, feedback: 'La Retrospectiva es para resolver conflictos estructurales de frente y salir con un plan de acción para el siguiente Sprint.' },
          { texto: 'Reportar al Product Owner a Recursos Humanos', correcto: false, feedback: 'La Retrospectiva busca inspección y adaptación del proceso, no castigos.' },
          { texto: 'Que el Scrum Master asigne culpas oficialmente en un acta', correcto: false, feedback: 'El SM facilita un entorno psicológicamente seguro. Las actas de culpas destruyen la moral.' },
          { texto: 'Ignorarlo porque "lo hecho, hecho está" y el cliente está feliz', correcto: false, feedback: 'Ignorar problemas de calidad genera deuda técnica que eventualmente matará el producto.' },
        ],
      },
      {
        texto: '¿Cómo evalúa realmente el Product Owner si el módulo de "Exámenes en línea" entregado en el Sprint pasado fue valioso?',
        opciones: [
          { texto: 'Revisando que el código esté limpio y sin bugs en el repositorio', correcto: false, feedback: 'El código limpio es calidad, pero no garantiza que la herramienta sea útil para el negocio.' },
          { texto: 'Midiendo empíricamente su uso, la reducción de quejas y la satisfacción de los profesores en producción', correcto: true, feedback: 'El valor real solo se comprueba cuando el software está en manos del usuario (Empirismo). Las suposiciones se validan con métricas reales.' },
          { texto: 'Calculando cuántas horas ahorró el equipo al programarlo', correcto: false, feedback: 'Eficiencia de desarrollo no equivale a valor de negocio.' },
          { texto: 'Preguntándole al Director General si le gusta el color de los botones', correcto: false, feedback: 'La opinión de un ejecutivo sin basarse en datos de usuarios no es empirismo.' },
        ],
      },
      {
        texto: 'El equipo quiere implementar un nuevo pipeline automatizado (TDD). Toma 3 días configurarlo y no entregará funcionalidades nuevas este Sprint. ¿Es válido en Scrum?',
        opciones: [
          { texto: 'No, porque Scrum exige entregar software funcional para el cliente en cada Sprint', correcto: false, feedback: 'El software funcional es el progreso principal, pero Scrum no prohíbe invertir en infraestructura técnica para habilitar ese progreso.' },
          { texto: 'Sí, si es transparente en el Sprint Backlog y ayuda a la calidad futura del Incremento y la Definición de Hecho', correcto: true, feedback: 'Mejorar el proceso y la infraestructura técnica (eliminar deuda técnica) es vital y debe planificarse de manera transparente.' },
          { texto: 'Sí, pero deben hacerlo en su tiempo libre o fines de semana', correcto: false, feedback: 'Las mejoras técnicas son parte integral del trabajo profesional.' },
          { texto: 'No, esto debe ser un proyecto paralelo gestionado por el departamento de IT', correcto: false, feedback: 'El equipo Scrum es multifuncional e independiente; ellos gestionan su propia infraestructura y herramientas.' },
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

export default function ScrumP3({ goToScreen, playHoverSound, mainAudioRef }) {
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
        setTimeout(() => goToScreen('gameover', { score, vida: 0, proyectoOrigen: 'scrumP3' }), 2000);
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
    if (etapa === 'resultado') saveHighScore('scrumP3', score);
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
          Proyecto 3 — {NOMBRE_PROYECTO}
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
          <button onMouseEnter={playHoverSound} onClick={() => goToScreen('scrumP3')}
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