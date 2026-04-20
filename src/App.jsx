import React from 'react';

function App() {
  return (
    <div className="max-w-3xl w-full bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden">
      
      {/* Encabezado */}
      <div className="bg-slate-900 p-8 text-center border-b border-slate-700">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-2">
          METODOLOGÍAS: EL SIMULADOR
        </h1>
        <h2 className="text-xl text-slate-400 font-medium tracking-wide">
          Supervivencia en Ingeniería de Software
        </h2>
      </div>

      <div className="p-8">
        
        {/* Zona de Metto */}
        <div className="flex flex-col md:flex-row items-center gap-6 bg-slate-700/50 p-6 rounded-xl mb-8 border border-slate-600">
          <div className="w-24 h-24 shrink-0 bg-slate-900 rounded-full flex items-center justify-center overflow-hidden border-2 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.5)]">
            <img src="/metto.gif" alt="Metto" className="w-full h-full object-cover fallback-bg" onError={(e) => e.target.style.display='none'} />
            <span className="text-xs text-slate-500 absolute z-[-1]">GIF</span>
          </div>
          
          <div className="flex-1 relative">
            <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-0 h-0 border-y-8 border-y-transparent border-r-8 border-r-slate-800 hidden md:block"></div>
            <p className="bg-slate-800 p-4 rounded-lg text-slate-300 italic text-sm md:text-base shadow-inner">
              "¡Saludos, humano! Soy Metto, tu asistente. Analizaré tus decisiones para asegurar que el flujo sea óptimo. ¿Estás listo para compilar tu futuro?"
            </p>
          </div>
        </div>

        {/* Descripción del juego */}
        <div className="space-y-4 mb-10 text-slate-300">
          <div>
            <h3 className="text-cyan-400 font-bold text-lg mb-1">¿De qué trata este juego?</h3>
            <p className="leading-relaxed">
              Este simulador interactivo está diseñado para poner a prueba tu capacidad de toma de decisiones en el mundo real del desarrollo de software. Aprenderás y aplicarás los principios fundamentales de las metodologías <strong className="text-white">Cascada</strong>, <strong className="text-white">Scrum</strong> y <strong className="text-white">Kanban</strong> enfrentando crisis en proyectos simulados.
            </p>
          </div>
          
          <div>
            <h3 className="text-cyan-400 font-bold text-lg mb-1">Tu objetivo:</h3>
            <p className="leading-relaxed">
              Administrar tu integridad, evitar cuellos de botella, cumplir con los Sprints y tomar las decisiones correctas para que el proyecto no colapse (y no te despidan).
            </p>
          </div>
        </div>

        {/* Botón Jugar */}
        <div className="flex justify-center">
          <button className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-4 px-12 rounded-full text-xl shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] transition-all transform hover:-translate-y-1 active:translate-y-0">
            INICIAR SIMULACIÓN
          </button>
        </div>

      </div>
    </div>
  );
}

export default App;