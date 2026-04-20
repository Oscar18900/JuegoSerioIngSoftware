import React, { useState } from 'react';

const sections = [
  {
    id: 'vida',
    tag: 'SEC. 01',
    title: 'Sistema de Vida',
    accent: 'border-red-500',
    tagColor: 'text-red-400',
    icon: '♥',
    iconColor: 'text-red-400',
    content: (
      <>
        <p className="text-slate-300 leading-relaxed text-sm md:text-base mb-4">
          Empiezas con <span className="text-white font-black">100% de integridad</span>. Cada respuesta incorrecta
          o tiempo agotado te quita un porcentaje.
        </p>
        <div className="bg-red-950/40 border border-red-500/30 rounded px-4 py-3 flex items-start gap-3">
          <span className="text-red-400 text-lg mt-0.5 shrink-0">⚠</span>
          <p className="text-red-300 text-sm font-bold">
            Si llegas a 0%, el proyecto es cancelado. Y tú, <span className="uppercase tracking-widest">despedido</span>.
          </p>
        </div>
      </>
    ),
  },
  {
    id: 'puntos',
    tag: 'SEC. 02',
    title: 'Temporizador y Puntuación',
    accent: 'border-yellow-400',
    tagColor: 'text-yellow-400',
    icon: '⏱',
    iconColor: 'text-yellow-400',
    content: (
      <>
        <p className="text-slate-300 leading-relaxed text-sm md:text-base mb-4">
          Cada pregunta tiene una <span className="text-white font-bold">cuenta regresiva</span>. Responde correcto para sumar puntos.
          Más rápido igual más puntos.
        </p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Bonus Velocidad', desc: 'Responde antes de que se acabe el tiempo', color: 'border-yellow-500/40 bg-yellow-950/20' },
            { label: 'Combo', desc: 'Racha de respuestas correctas consecutivas', color: 'border-orange-500/40 bg-orange-950/20' },
          ].map(b => (
            <div key={b.label} className={`border ${b.color} rounded p-3`}>
              <p className="text-white font-black text-xs uppercase tracking-wider mb-1">{b.label}</p>
              <p className="text-slate-400 text-xs">{b.desc}</p>
            </div>
          ))}
        </div>
      </>
    ),
  },
  {
    id: 'rangos',
    tag: 'SEC. 03',
    title: 'Rangos Finales',
    accent: 'border-cyan-400',
    tagColor: 'text-cyan-400',
    icon: '★',
    iconColor: 'text-cyan-400',
    content: (
      <div className="flex flex-col gap-3">
        {[
          {
            rank: 'ORO',
            desc: 'Rendimiento excepcional',
            bg: 'bg-yellow-500/10 border-yellow-400/50',
            text: 'text-yellow-300',
            badge: 'bg-yellow-400 text-black',
            symbol: '🥇',
          },
          {
            rank: 'PLATA',
            desc: 'Aceptable, pero mejorable',
            bg: 'bg-slate-500/10 border-slate-400/50',
            text: 'text-slate-300',
            badge: 'bg-slate-300 text-black',
            symbol: '🥈',
          },
          {
            rank: 'BRONCE',
            desc: 'De milagro no te corrieron',
            bg: 'bg-orange-900/10 border-orange-700/50',
            text: 'text-orange-400',
            badge: 'bg-orange-700 text-white',
            symbol: '🥉',
          },
        ].map(r => (
          <div key={r.rank} className={`flex items-center gap-4 border ${r.bg} rounded px-4 py-3`}>
            <span className="text-2xl">{r.symbol}</span>
            <div className="flex-1">
              <span className={`font-black text-sm uppercase tracking-widest ${r.text}`}>{r.rank}</span>
              <p className="text-slate-400 text-xs mt-0.5">{r.desc}</p>
            </div>
          </div>
        ))}
      </div>
    ),
  },
];

const modes = [
  {
    id: 'cascada',
    label: 'MODO CASCADA',
    color: 'border-blue-500',
    tagColor: 'text-blue-400',
    bg: 'bg-blue-950/20',
    dot: 'bg-blue-400',
    rules: [
      'Las preguntas siguen las fases: Análisis → Diseño → Implementación → Pruebas.',
      'No hay cura en todo el proyecto.',
      'Los errores en Análisis duelen más que en otras fases.',
    ],
  },
  {
    id: 'scrum',
    label: 'MODO SCRUM',
    color: 'border-green-500',
    tagColor: 'text-green-400',
    bg: 'bg-green-950/20',
    dot: 'bg-green-400',
    rules: [
      'Las preguntas llegan en ráfagas de 5 por Sprint.',
      'Al terminar cada Sprint hay Retrospectiva.',
      'Si te fue bien en el Sprint, recuperas integridad.',
    ],
  },
  {
    id: 'kanban',
    label: 'MODO KANBAN',
    color: 'border-purple-500',
    tagColor: 'text-purple-400',
    bg: 'bg-purple-950/20',
    dot: 'bg-purple-400',
    rules: [
      'Flujo ininterrumpido. Sin sprints, sin pausas.',
      'Si el tiempo se acaba: daño doble hasta que aciertes.',
    ],
  },
];

export default function ManualEmpleado({ goToScreen, playClickSound, playHoverSound }) {
  const [activeMode, setActiveMode] = useState('cascada');

  return (
    <div className="max-w-3xl w-full px-4 py-10 flex flex-col items-center animate-fade-in">

      {/* Header */}
      <header className="text-center mb-10 w-full">
        {/* Clasificación de documento */}
        <p className="text-red-500 font-black text-xs tracking-[0.4em] uppercase mb-3">
          ▌DOCUMENTO INTERNO — CLASIFICADO▐
        </p>
        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic drop-shadow-[0_5px_15px_rgba(0,0,0,0.6)]">
          Manual del
        </h1>
        <h1 className="text-5xl md:text-7xl font-black text-cyan-400 tracking-tighter uppercase italic drop-shadow-[0_0_30px_rgba(6,182,212,0.4)]">
          Empleado
        </h1>
        {/* Línea decorativa estilo formulario */}
        <div className="mt-4 flex items-center gap-2 justify-center">
          <div className="h-px flex-1 bg-white/10 max-w-[80px]"></div>
          <span className="text-slate-500 text-xs tracking-widest uppercase">Recursos Humanos · v2.4.1</span>
          <div className="h-px flex-1 bg-white/10 max-w-[80px]"></div>
        </div>
      </header>

      {/* Secciones generales */}
      <div className="w-full flex flex-col gap-6 mb-10">
        {sections.map((sec, i) => (
          <div
            key={sec.id}
            className={`border-l-4 ${sec.accent} pl-5 pr-4 py-4 bg-slate-900/50 rounded-r-lg`}
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <div className="flex items-center gap-3 mb-3">
              <span className={`text-lg ${sec.iconColor}`}>{sec.icon}</span>
              <span className={`text-xs font-black tracking-widest uppercase ${sec.tagColor}`}>{sec.tag}</span>
              <h2 className="text-white font-black text-base uppercase tracking-wider">{sec.title}</h2>
            </div>
            {sec.content}
          </div>
        ))}
      </div>

      {/* Divisor */}
      <div className="w-full flex items-center gap-4 mb-8">
        <div className="h-px flex-1 bg-white/10"></div>
        <span className="text-slate-500 text-xs tracking-[0.3em] uppercase">Reglamento por Modo</span>
        <div className="h-px flex-1 bg-white/10"></div>
      </div>

      {/* Tabs de modos */}
      <div className="w-full mb-6">
        {/* Tab selector */}
        <div className="flex gap-2 mb-4">
          {modes.map(m => (
            <button
              key={m.id}
              onMouseEnter={playHoverSound}
              onClick={() => { playClickSound(); setActiveMode(m.id); }}
              className={`flex-1 py-2 text-xs font-black uppercase tracking-wider rounded-sm border transition-all duration-200
                ${activeMode === m.id
                  ? `${m.color} ${m.bg} ${m.tagColor} border-opacity-100`
                  : 'border-white/10 text-slate-500 hover:text-slate-300 hover:border-white/20'
                }`}
            >
              {m.label.replace('MODO ', '')}
            </button>
          ))}
        </div>

        {/* Contenido del tab activo */}
        {modes.filter(m => m.id === activeMode).map(m => (
          <div
            key={m.id}
            className={`border ${m.color} ${m.bg} rounded-lg px-5 py-4`}
          >
            <p className={`font-black text-sm uppercase tracking-widest ${m.tagColor} mb-3`}>{m.label}</p>
            <ul className="flex flex-col gap-2">
              {m.rules.map((rule, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-300 text-sm leading-relaxed">
                  <span className={`w-1.5 h-1.5 rounded-full ${m.dot} mt-2 shrink-0`}></span>
                  {rule}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Sello de RRHH (decorativo) */}
      <div className="w-full flex justify-end mb-8 opacity-20">
        <div className="border-2 border-red-500 rounded px-3 py-1 rotate-[-4deg]">
          <p className="text-red-500 font-black text-xs tracking-widest uppercase">Firmado · RRHH</p>
        </div>
      </div>

      {/* Botón volver */}
      <button
        onMouseEnter={playHoverSound}
        onClick={() => goToScreen('menu')}
        className="group relative px-10 py-3 bg-transparent border-2 border-white/30 text-white font-black text-sm uppercase tracking-widest rounded-sm transition-transform duration-200 hover:scale-105 active:scale-95 hover:border-white/60"
      >
        ← Volver al Menú
      </button>

    </div>
  );
}