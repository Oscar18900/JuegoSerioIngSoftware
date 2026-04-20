import React, { useEffect, useRef } from 'react';

const proyectos = [
  {
    id: 'cascadaP1',
    numero: '01',
    dificultad: 'BÁSICO',
    nombre: 'Sistema de Biblioteca',
    desc: 'Gestión de préstamos, inventario y usuarios. El campo de entrenamiento.',
    color: 'border-green-500',
    tagColor: 'text-green-400',
    bg: 'bg-green-950/20',
    badge: 'bg-green-500/20 text-green-300 border-green-500/40',
  },
  {
    id: 'cascadaP2',
    numero: '02',
    dificultad: 'INTERMEDIO',
    nombre: 'Plataforma Bancaria',
    desc: 'Transacciones, seguridad y cumplimiento regulatorio. Los errores cuestan dinero.',
    color: 'border-yellow-500',
    tagColor: 'text-yellow-400',
    bg: 'bg-yellow-950/20',
    badge: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
  },
  {
    id: 'cascadaP3',
    numero: '03',
    dificultad: 'AVANZADO',
    nombre: 'Sistema Nacional de Salud',
    desc: 'Millones de registros médicos. Infraestructura crítica. Sin margen de error.',
    color: 'border-red-500',
    tagColor: 'text-red-400',
    bg: 'bg-red-950/20',
    badge: 'bg-red-500/20 text-red-300 border-red-500/40',
  },
];

export default function SeleccionCascada({ goToScreen, mainAudioRef, playClickSound, playHoverSound }) {
  const cascadaAudioRef = useRef(null);

  useEffect(() => {
    // Fade out música principal
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

    // Arrancar música de cascada
    if (cascadaAudioRef.current) {
      cascadaAudioRef.current.volume = 0;
      cascadaAudioRef.current.play().catch(() => {});
      const fadeIn = setInterval(() => {
        if (cascadaAudioRef.current && cascadaAudioRef.current.volume < 0.09) {
          cascadaAudioRef.current.volume = Math.min(0.1, cascadaAudioRef.current.volume + 0.01);
        } else {
          clearInterval(fadeIn);
        }
      }, 80);
    }

    // Al salir: restaurar música principal
    return () => {
      if (cascadaAudioRef.current) {
        cascadaAudioRef.current.pause();
        cascadaAudioRef.current.currentTime = 0;
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

      <audio ref={cascadaAudioRef} src="/fondocascada.mp3" loop />

      {/* Header */}
      <header className="text-center mb-10 w-full">
        <p className="text-blue-400 font-black text-xs tracking-[0.4em] uppercase mb-3">
          ▌ SELECCIÓN DE PROYECTO ▐
        </p>
        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic drop-shadow-[0_5px_15px_rgba(0,0,0,0.6)]">
          Modo
        </h1>
        <h1 className="text-5xl md:text-7xl font-black text-blue-400 tracking-tighter uppercase italic drop-shadow-[0_0_30px_rgba(59,130,246,0.5)]">
          Cascada
        </h1>
        <div className="mt-4 flex items-center gap-2 justify-center">
          <div className="h-px flex-1 bg-white/10 max-w-[60px]"></div>
          <span className="text-slate-500 text-xs tracking-widest uppercase">Secuencial · Sin retroceso</span>
          <div className="h-px flex-1 bg-white/10 max-w-[60px]"></div>
        </div>
      </header>

      {/* Descripción del modo */}
      <div className="w-full border-l-4 border-blue-500 pl-5 pr-4 py-4 bg-slate-900/50 rounded-r-lg mb-10">
        <p className="text-slate-300 leading-relaxed text-sm md:text-base">
          El modelo Cascada es <span className="text-white font-bold">secuencial y rígido</span>. Cada fase debe
          completarse antes de avanzar. <span className="text-red-400 font-bold">No hay curas</span>. Los errores
          tempranos duelen más.
        </p>
        {/* Fases visuales */}
        <div className="flex items-center gap-1 mt-4 flex-wrap">
          {['Análisis', 'Diseño', 'Implementación', 'Pruebas'].map((fase, i, arr) => (
            <React.Fragment key={fase}>
              <span className="text-xs text-blue-300 font-bold uppercase tracking-wider bg-blue-950/50 border border-blue-500/30 px-2 py-1 rounded">
                {fase}
              </span>
              {i < arr.length - 1 && <span className="text-slate-600 text-xs">→</span>}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Proyectos */}
      <div className="w-full flex flex-col gap-4 mb-10">
        {proyectos.map((p, i) => (
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
                {/* Número */}
                <span className={`font-black text-3xl leading-none ${p.tagColor} opacity-40 mt-1`}>
                  {p.numero}
                </span>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-black uppercase tracking-widest border px-2 py-0.5 rounded ${p.badge}`}>
                      {p.dificultad}
                    </span>
                  </div>
                  <p className="text-white font-black text-base md:text-lg uppercase tracking-tight">
                    {p.nombre}
                  </p>
                  <p className="text-slate-400 text-xs md:text-sm mt-1 leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              </div>
              {/* Flecha */}
              <span className={`${p.tagColor} text-xl mt-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200`}>
                →
              </span>
            </div>
          </button>
        ))}
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