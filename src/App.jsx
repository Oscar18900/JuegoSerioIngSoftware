import React from 'react';

function App() {
  return (
    <div className="max-w-5xl w-full px-4 py-12 flex flex-col items-center">
      
      {/* SECCIÓN DEL TÍTULO: Estilo Menú de Juego */}
      <header className="text-center mb-16 animate-fade-in">
        <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)] uppercase italic">
          METODOLOGÍAS
        </h1>
        <div className="flex items-center justify-center gap-4">
          <div className="h-px w-12 bg-white/30"></div>
          <h2 className="text-xl md:text-2xl text-slate-200 font-light tracking-[0.3em] uppercase">
            El Simulador
          </h2>
          <div className="h-px w-12 bg-white/30"></div>
        </div>
        <p className="mt-2 text-blue-300 font-bold tracking-widest text-sm uppercase">
          Supervivencia en Ingeniería de Software
        </p>
      </header>

{/* ZONA DE METTO (Sin el contenedor padre) */}
      <div className="w-full max-w-2xl flex flex-col md:flex-row items-center gap-6 mb-12">
        
        {/* Avatar */}
        <div className="w-24 h-24 shrink-0 bg-slate-900 rounded-full flex items-center justify-center overflow-hidden border-2 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.5)]">
          <img src="/metto.gif" alt="Metto" className="w-full h-full object-cover" onError={(e) => e.target.style.display='none'} />
          <span className="text-xs text-slate-500 absolute z-[-1]">GIF</span>
        </div>
        
        {/* Burbuja de diálogo */}
        <div className="flex-1 relative">
          {/* El triángulo que apunta a Metto */}
          <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-0 h-0 border-y-8 border-y-transparent border-r-8 border-r-slate-900/70 hidden md:block"></div>
          
          <p className="bg-slate-900/70 backdrop-blur-sm p-4 rounded-lg text-slate-200 italic text-sm md:text-base shadow-inner border border-white/10">
            "¡Saludos, humano! Soy Metto, tu asistente. Analizaré tus decisiones para asegurar que el flujo sea óptimo. ¿Estás listo para compilar tu futuro?"
          </p>
        </div>
      </div>

      {/* BLOQUES DE INFORMACIÓN: Sin tarjeta, estilo "Lore" o Instrucciones */}
      <div className="grid md:grid-grid-cols-2 gap-12 max-w-4xl w-full mb-16">
        <div className="border-l-4 border-cyan-500 pl-6">
          <h3 className="text-white font-black text-xl mb-3 uppercase tracking-wider">Misión</h3>
          <p className="text-slate-300 leading-relaxed text-sm md:text-base">
            Este simulador interactivo pondrá a prueba tu capacidad de toma de decisiones. 
            Aprenderás los principios de <span className="text-cyan-400 font-bold">Cascada</span>, 
            <span className="text-cyan-400 font-bold"> Scrum</span> y 
            <span className="text-cyan-400 font-bold"> Kanban</span> enfrentando crisis reales.
          </p>
        </div>

        <div className="border-l-4 border-red-500 pl-6">
          <h3 className="text-white font-black text-xl mb-3 uppercase tracking-wider">Directiva</h3>
          <p className="text-slate-300 leading-relaxed text-sm md:text-base">
            Administra tu integridad, evita cuellos de botella y cumple con los Sprints. 
            Toma las decisiones correctas para que el proyecto no colapse. 
            <span className="text-red-400 block mt-2 font-bold italic text-xs">ADVERTENCIA: El fracaso resultará en despido inmediato.</span>
          </p>
        </div>
      </div>

      {/* ACCIÓN PRINCIPAL */}
      <button className="group relative px-12 py-4 bg-white text-black font-black text-2xl uppercase tracking-tighter rounded-sm hover:bg-cyan-400 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.2)]">
        <span className="relative z-10">Iniciar Simulación</span>
        <div className="absolute inset-0 bg-cyan-500 blur-xl opacity-0 group-hover:opacity-50 transition-opacity"></div>
      </button>

    </div>
  );
}

export default App;