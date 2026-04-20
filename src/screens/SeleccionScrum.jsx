import React, { useEffect, useRef, useState } from 'react';

const proyectos = [
  {
    id: 'scrumP1',
    numero: '01',
    dificultad: 'BÁSICO',
    nombre: 'App de Tareas',
    desc: 'Gestión de pendientes, prioridades y usuarios. El primer sprint siempre es optimista.',
    color: 'border-green-500',
    tagColor: 'text-green-400',
    bg: 'bg-green-950/20',
    badge: 'bg-green-500/20 text-green-300 border-green-500/40',
  },
  {
    id: 'scrumP2',
    numero: '02',
    dificultad: 'INTERMEDIO',
    nombre: 'E-Commerce',
    desc: 'Catálogo, carrito, pagos y logística. El cliente cambia los requisitos cada Sprint.',
    color: 'border-yellow-500',
    tagColor: 'text-yellow-400',
    bg: 'bg-yellow-950/20',
    badge: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
  },
  {
    id: 'scrumP3',
    numero: '03',
    dificultad: 'AVANZADO',
    nombre: 'Plataforma Educativa',
    desc: 'Miles de estudiantes, contenido en vivo y métricas de aprendizaje. Sin excusas.',
    color: 'border-red-500',
    tagColor: 'text-red-400',
    bg: 'bg-red-950/20',
    badge: 'bg-red-500/20 text-red-300 border-red-500/40',
  },
];

function getHighScore(proyectoId) {
  try {
    const val = localStorage.getItem(`hs_${proyectoId}`);
    return val ? parseInt(val) : null;
  } catch {
    return null;
  }
}

function getRango(puntos) {
  if (puntos >= 900) return { label: 'ORO',    color: 'text-yellow-400', symbol: '🥇' };
  if (puntos >= 500) return { label: 'PLATA',  color: 'text-slate-300',  symbol: '🥈' };
  return                     { label: 'BRONCE', color: 'text-orange-400', symbol: '🥉' };
}

export default function SeleccionScrum({ goToScreen, mainAudioRef, playClickSound, playHoverSound }) {
  const scrumAudioRef = useRef(null);
  const [highScores, setHighScores] = useState({});

  // Leer high scores al montar
  useEffect(() => {
    const scores = {};
    proyectos.forEach(p => {
      scores[p.id] = getHighScore(p.id);
    });
    setHighScores(scores);
  }, []);

  // Audio fade in/out
  useEffect(() => {
    const main = mainAudioRef?.current;
    if (main) {
      const fadeOut = setInterval(() => {
        if (main.volume > 0.05) {
          main.volume = Math.max(0, main.volume - 0.015);
        } else {
          main.volume = 0;
          main.pause();
          clearInterval(fadeOut);
        }
      }, 80);
    }

    if (scrumAudioRef.current) {
      scrumAudioRef.current.volume = 0;
      scrumAudioRef.current.play().catch(() => {});
      const fadeIn = setInterval(() => {
        if (scrumAudioRef.current && scrumAudioRef.current.volume < 0.09) {
          scrumAudioRef.current.volume = Math.min(0.1, scrumAudioRef.current.volume + 0.01);
        } else {
          clearInterval(fadeIn);
        }
      }, 80);
    }

    return () => {
      if (scrumAudioRef.current) {
        scrumAudioRef.current.pause();
        scrumAudioRef.current.currentTime = 0;
      }
      if (main) {
        main.volume = 0;
        main.play().catch(() => {});
        const fadeIn = setInterval(() => {
          if (main.volume < 0.09) {
            main.volume = Math.min(0.1, main.volume + 0.01);
          } else {
            clearInterval(fadeIn);
          }
        }, 80);
      }
    };
  }, []);

  return (
    <div className="max-w-3xl w-full px-4 py-10 flex flex-col items-center animate-fade-in">

      <audio ref={scrumAudioRef} src="/fondoscrum.mp3" loop />

      {/* Header */}
      <header className="text-center mb-10 w-full">
        <p className="text-green-400 font-black text-xs tracking-[0.4em] uppercase mb-3">
          ▌ SELECCIÓN DE PROYECTO ▐
        </p>
        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic drop-shadow-[0_5px_15px_rgba(0,0,0,0.6)]">
          Modo
        </h1>
        <h1 className="text-5xl md:text-7xl font-black text-green-400 tracking-tighter uppercase italic drop-shadow-[0_0_30px_rgba(74,222,128,0.5)]">
          Scrum
        </h1>
        <div className="mt-4 flex items-center gap-2 justify-center">
          <div className="h-px flex-1 bg-white/10 max-w-[60px]"></div>
          <span className="text-slate-500 text-xs tracking-widest uppercase">Sprints · Retrospectiva · Cura</span>
          <div className="h-px flex-1 bg-white/10 max-w-[60px]"></div>
        </div>
      </header>

      {/* Descripción del modo */}
      <div className="w-full border-l-4 border-green-500 pl-5 pr-4 py-4 bg-slate-900/50 rounded-r-lg mb-10">
        <p className="text-slate-300 leading-relaxed text-sm md:text-base">
          Scrum trabaja en <span className="text-white font-bold">ciclos cortos</span>. Las preguntas llegan en
          ráfagas de <span className="text-green-400 font-bold">5 por Sprint</span>.
          El timer no perdona. Pero la <span className="text-white font-bold">Retrospectiva te cura</span> si le metes ganas.
        </p>
        {/* Ciclo visual */}
        <div className="flex items-center gap-1 mt-4 flex-wrap">
          {['Sprint', '5 Preguntas', 'Retrospectiva', 'Sprint →'].map((fase, i) => (
            <React.Fragment key={fase}>
              <span className="text-xs text-green-300 font-bold uppercase tracking-wider bg-green-950/50 border border-green-500/30 px-2 py-1 rounded">
                {fase}
              </span>
              {i < 2 && <span className="text-slate-600 text-xs">→</span>}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Proyectos */}
      <div className="w-full flex flex-col gap-4 mb-10">
        {proyectos.map((p, i) => {
          const hs = highScores[p.id];
          const jugado = hs !== null && hs !== undefined;
          const rango = jugado ? getRango(hs) : null;

          return (
            <button
              key={p.id}
              onMouseEnter={playHoverSound}
              onClick={() => {
                playClickSound();
                goToScreen(p.id);
              }}
              className={`group w-full text-left border-2 ${p.color} ${p.bg} rounded-lg px-5 py-4 transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]`}
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <span className={`font-black text-3xl leading-none ${p.tagColor} opacity-40 mt-1`}>
                    {p.numero}
                  </span>
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={`text-xs font-black uppercase tracking-widest border px-2 py-0.5 rounded ${p.badge}`}>
                        {p.dificultad}
                      </span>
                      {jugado && (
                        <span className="text-xs font-black uppercase tracking-widest border px-2 py-0.5 rounded bg-white/5 border-white/20 text-slate-400">
                          ✓ Jugado
                        </span>
                      )}
                    </div>
                    <p className="text-white font-black text-base md:text-lg uppercase tracking-tight">
                      {p.nombre}
                    </p>
                    <p className="text-slate-400 text-xs md:text-sm mt-1 leading-relaxed">
                      {p.desc}
                    </p>
                    {/* High score row */}
                    {jugado && (
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-sm">{rango.symbol}</span>
                        <span className={`text-xs font-black uppercase tracking-widest ${rango.color}`}>
                          {rango.label}
                        </span>
                        <span className="text-slate-600 text-xs">·</span>
                        <span className="text-slate-400 text-xs">Mejor:</span>
                        <span className="text-white font-black text-xs">{hs.toLocaleString()} pts</span>
                      </div>
                    )}
                  </div>
                </div>
                <span className={`${p.tagColor} text-xl mt-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200`}>
                  →
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Volver */}
      <button
        onMouseEnter={playHoverSound}
        onClick={() => goToScreen('menu')}
        className="text-slate-500 text-xs uppercase tracking-widest hover:text-slate-300 transition-colors"
      >
        ← Volver al Menú
      </button>

    </div>
  );
}