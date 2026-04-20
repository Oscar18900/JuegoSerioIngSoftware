import React, { useState, useEffect, useRef, useCallback } from 'react';

// ─── DATOS DEL JUEGO ───────────────────────────────────────────────────────────
// Para hacer los demás niveles, copia este archivo y cambia solo este bloque.
// Ajusta NOMBRE_PROYECTO, PREGUNTAS y los rangos si quieres.
const NOMBRE_PROYECTO = 'Agencia Web Digital';

const PREGUNTAS = [
  {
    texto: 'El sitio web principal de un cliente VIP de la agencia se cae (Error 500). ¿Cómo se maneja esta emergencia en un tablero Kanban?',
    opciones: [
      { texto: 'Se borran las tareas actuales del tablero para hacer espacio al error', correcto: false, feedback: 'Nunca se borra el trabajo en progreso. Esto destruiría la visibilidad y el esfuerzo ya invertido.' },
      { texto: 'Se utiliza un "Carril de Vía Rápida" (Expedite Swimlane) que permite saltar la fila respetando su propio límite WIP', correcto: true, feedback: 'Kanban maneja emergencias con carriles de urgencia (Expedite). Tienen la máxima prioridad pero límites estrictos (ej. máximo 1 a la vez) para no colapsar el sistema.' },
      { texto: 'Se espera a la siguiente reunión de planificación semanal para asignarla', correcto: false, feedback: 'Es una emergencia. Kanban permite flujo continuo, no hay que esperar a una planificación semanal.' },
      { texto: 'Se asigna como trabajo extra (horas extra) para no afectar el flujo normal', correcto: false, feedback: 'Kanban busca hacer visible todo el trabajo y mantener un ritmo sostenible, no ocultar el esfuerzo en horas extras.' },
    ],
  },
  {
    texto: 'La columna de "Diseño UI" está vacía, pero "Desarrollo Frontend" alcanzó su límite WIP y hay tarjetas acumuladas esperando entrar. ¿Qué deben hacer los diseñadores?',
    opciones: [
      { texto: 'Empezar a diseñar los proyectos del próximo mes para adelantar trabajo', correcto: false, feedback: 'Adelantar diseño crearía más inventario acumulado, empeorando el cuello de botella más adelante.' },
      { texto: 'Pedirle al manager que aumente el límite WIP de Frontend para que las tarjetas avancen', correcto: false, feedback: 'Aumentar el límite WIP solo esconde el problema real (falta de capacidad en Frontend) y retrasa los tiempos de entrega.' },
      { texto: 'Detener la creación de nuevos diseños y colaborar de alguna forma para desbloquear a Frontend (ej. control de calidad visual)', correcto: true, feedback: 'En Kanban, el equipo entero es responsable del flujo. Si hay un cuello de botella, los que están "aguas arriba" deben detenerse y ayudar a aliviar el bloqueo.' },
      { texto: 'Asignar directamente sus diseños terminados a los programadores para forzarlos a trabajar', correcto: false, feedback: 'Esto sería un sistema "Push", lo cual viola el principio fundamental "Pull" de Kanban.' },
    ],
  },
  {
    texto: 'Un cliente solicita una nueva Landing Page y quiere saber exactamente cuánto tiempo pasará desde hoy hasta que esté publicada. ¿Qué métrica de Kanban le da esta respuesta?',
    opciones: [
      { texto: 'El Cycle Time (Tiempo de Ciclo)', correcto: false, feedback: 'El Cycle Time mide el tiempo desde que el equipo *empieza* a trabajar en la tarea, no desde que el cliente la solicitó.' },
      { texto: 'La Velocidad del Equipo', correcto: false, feedback: 'La velocidad es una métrica de Scrum (puntos por sprint), no una medida de tiempo de entrega en Kanban.' },
      { texto: 'El Lead Time (Tiempo de Entrega)', correcto: true, feedback: 'El Lead Time mide el tiempo total transcurrido desde que se recibe la petición del cliente hasta que se le entrega el trabajo terminado.' },
      { texto: 'El Throughput (Rendimiento)', correcto: false, feedback: 'El Throughput mide la cantidad de tareas terminadas en un periodo (ej. 5 landing pages por mes), no el tiempo que toma hacer una.' },
    ],
  },
  {
    texto: 'Un Ejecutivo de Cuentas le asigna directamente 3 nuevas tareas urgentes a un programador que ya alcanzó su límite WIP en el tablero. ¿Qué principio de Kanban se está violando?',
    opciones: [
      { texto: 'El uso de Sprints', correcto: false, feedback: 'Kanban no utiliza Sprints.' },
      { texto: 'El Sistema Pull', correcto: true, feedback: 'Al forzar (empujar/push) tareas hacia el programador en lugar de esperar a que él tenga capacidad para tomarlas (pull), se rompe el flujo y se genera sobrecarga.' },
      { texto: 'Las Políticas Explícitas', correcto: false, feedback: 'Aunque es una mala práctica, el concepto central violado aquí es el sistema de arrastre (Pull).' },
      { texto: 'La Mejora Continua', correcto: false, feedback: 'La sobrecarga afecta la mejora continua, pero la violación directa es la imposición de trabajo sobre la capacidad actual.' },
    ],
  },
  {
    texto: 'La agencia maneja mantenimientos de rutina, campañas con fecha fija (ej. Día de las Madres) y caídas de servidores. ¿Qué herramienta de Kanban permite organizar esta variedad en el tablero?',
    opciones: [
      { texto: 'Sprints diferentes para cada tipo de tarea', correcto: false, feedback: 'Nuevamente, Kanban no utiliza Sprints. Todo fluye en el mismo sistema continuo.' },
      { texto: 'Clases de Servicio (Classes of Service)', correcto: true, feedback: 'Las Clases de Servicio (como Estándar, Fecha Fija, Urgente) dictan cómo el equipo debe tratar diferentes tipos de trabajo y priorizarlos visualmente.' },
      { texto: 'Tableros separados para cada tipo de trabajo', correcto: false, feedback: 'Tener múltiples tableros oculta la carga real del equipo. Kanban prefiere consolidar el trabajo para ver la capacidad total.' },
      { texto: 'Estimación en Story Points', correcto: false, feedback: 'La estimación no ayuda a organizar el flujo de diferentes urgencias; las Clases de Servicio sí.' },
    ],
  },
  {
    texto: 'El equipo terminó de programar, probar y aprobar el nuevo carrito de compras de un cliente un martes. ¿Cuándo se debe publicar (desplegar a producción) según el enfoque Kanban?',
    opciones: [
      { texto: 'Tan pronto como esté listo y validado, asegurando una entrega continua de valor', correcto: true, feedback: 'Kanban fomenta la entrega continua. No hay que esperar a que termine un ciclo arbitrario para entregar valor al cliente.' },
      { texto: 'Al final de la semana, durante la revisión del proyecto', correcto: false, feedback: 'Retrasar la entrega de algo terminado genera inventario estancado y retrasa el feedback del mercado.' },
      { texto: 'Al terminar el Sprint de desarrollo', correcto: false, feedback: 'En Kanban no hay Sprints que dicten cuándo se entrega el trabajo.' },
      { texto: 'Solo cuando el cliente pague la factura final', correcto: false, feedback: 'Esto es un problema administrativo, no una regla de la metodología de flujo de trabajo ágil.' },
    ],
  },
  {
    texto: 'El director de la agencia quiere ver si el trabajo se está atascando sistemáticamente en la fase de pruebas (QA) a lo largo del mes. ¿Qué gráfico de Kanban muestra esto de forma más clara?',
    opciones: [
      { texto: 'Gráfico de Trabajo Quemado (Burndown Chart)', correcto: false, feedback: 'El Burndown Chart muestra el trabajo restante en un Sprint (Scrum). No es ideal para analizar flujo continuo ni cuellos de botella por fase.' },
      { texto: 'Diagrama de Flujo Acumulado (Cumulative Flow Diagram - CFD)', correcto: true, feedback: 'El CFD muestra la cantidad de tareas en cada estado a lo largo del tiempo. Si la banda de "QA" se hace cada vez más ancha, hay un cuello de botella evidente.' },
      { texto: 'Gráfico de Gantt', correcto: false, feedback: 'El diagrama de Gantt muestra dependencias de tiempo y fases planificadas, no el flujo dinámico ni los atascos reales.' },
      { texto: 'Gráfico circular de tareas asignadas por usuario', correcto: false, feedback: 'Un gráfico de asignación no muestra cómo fluye el trabajo a través de las etapas del proceso.' },
    ],
  },
  {
    texto: '¿Cómo aseguran los desarrolladores de la agencia que los diseños que reciben de la columna "Diseño UI" están completamente listos y no les faltan imágenes o tipografías?',
    opciones: [
      { texto: 'Revisando personalmente la computadora del diseñador', correcto: false, feedback: 'Esto es ineficiente y no escalable.' },
      { texto: 'Mediante la definición de "Políticas Explícitas" entre las columnas del tablero', correcto: true, feedback: 'Hacer las políticas explícitas es una práctica clave de Kanban. Define exactamente qué criterios debe cumplir una tarjeta (ej. "Tener todos los assets SVG exportados") para poder pasar de Diseño a Desarrollo.' },
      { texto: 'Realizando una reunión de paso de estafeta por cada diseño', correcto: false, feedback: 'Las reuniones constantes para cada tarea rompen el flujo asíncrono que Kanban intenta optimizar.' },
      { texto: 'Devolviendo el diseño si le falta algo hasta que el diseñador adivine qué falta', correcto: false, feedback: 'Esto genera fricción y desperdicio. Las reglas claras (políticas) previenen estos rechazos.' },
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

export default function KanbanP2({ goToScreen, playHoverSound, mainAudioRef }) {
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
        setTimeout(() => goToScreen('gameover', { score, vida: 0, proyectoOrigen: 'kanbanP2' }), 2000);
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
    if (etapa === 'resultado') saveHighScore('kanbanP2', score);
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
          Proyecto 2 — {NOMBRE_PROYECTO}
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
          <button onMouseEnter={playHoverSound} onClick={() => goToScreen('kanbanP2')}
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