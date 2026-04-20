import React from 'react';

export default function GameOver({ goToScreen, playHoverSound, score = 0, proyectoOrigen = 'cascadaP1' }) {
  return (
    <div className="max-w-lg w-full px-4 py-10 flex flex-col items-center animate-fade-in">

      {/* Header */}
      <div className="text-center mb-10">
        <p className="text-red-500 font-black text-xs tracking-[0.4em] uppercase mb-4 animate-pulse">
          ▌ PROYECTO CANCELADO ▐
        </p>
        <h1 className="text-6xl md:text-8xl font-black text-red-500 tracking-tighter uppercase italic drop-shadow-[0_0_40px_rgba(239,68,68,0.6)]">
          GAME
        </h1>
        <h1 className="text-6xl md:text-8xl font-black text-red-500 tracking-tighter uppercase italic drop-shadow-[0_0_40px_rgba(239,68,68,0.6)]">
          OVER
        </h1>
      </div>

      {/* Mensaje de Metto */}
      <div className="w-full flex gap-4 items-start mb-8">
        <div className="w-12 h-12 shrink-0 bg-slate-900 rounded-full flex items-center justify-center overflow-hidden border-2 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]">
          <img src="/metto.gif" alt="Metto" className="w-full h-full object-cover" onError={e => e.target.style.display='none'} />
        </div>
        <div className="flex-1 bg-slate-900/70 border border-red-500/30 rounded-lg p-4">
          <p className="text-red-400 font-black text-xs uppercase tracking-wider mb-1">[SISTEMA] Integridad crítica</p>
          <p className="text-slate-300 text-sm italic">
            "Tu integridad llegó a cero. El proyecto fue cancelado y el cliente exige responsables. 
            Según mis registros... eras tú."
          </p>
        </div>
      </div>

      {/* Puntuación final */}
      <div className="w-full border border-white/10 rounded-lg px-6 py-5 bg-slate-900/50 text-center mb-8">
        <p className="text-slate-500 text-xs uppercase tracking-widest mb-2">Puntuación alcanzada</p>
        <p className="text-4xl font-black text-white">{score.toLocaleString()}</p>
        <p className="text-slate-600 text-xs mt-1 uppercase tracking-widest">pts</p>
      </div>

      {/* Aviso de despido */}
      <div className="w-full bg-red-950/30 border border-red-500/30 rounded px-4 py-3 mb-8 flex items-center gap-3">
        <span className="text-red-400 text-lg shrink-0">📋</span>
        <p className="text-red-300 text-xs font-bold uppercase tracking-wide">
          Carta de despido emitida. RR.HH. ha sido notificado.
        </p>
      </div>

      {/* Botones */}
      <div className="flex flex-col gap-3 w-full max-w-xs">
        <button
          onMouseEnter={playHoverSound}
          onClick={() => goToScreen(proyectoOrigen)}
          className="w-full py-4 bg-red-500 border-2 border-red-400 text-white font-black text-sm uppercase tracking-widest rounded-sm transition-transform duration-200 hover:scale-105 active:scale-95"
        >
          Reintentar
        </button>
        <button
          onMouseEnter={playHoverSound}
          onClick={() => goToScreen('menu')}
          className="w-full py-3 bg-transparent border border-white/20 text-slate-400 font-black text-sm uppercase tracking-widest rounded-sm transition-transform duration-200 hover:scale-105 active:scale-95 hover:text-white hover:border-white/40"
        >
          ← Menú Principal
        </button>
      </div>

    </div>
  );
}