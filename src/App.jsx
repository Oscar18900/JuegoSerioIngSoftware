import React, { useEffect, useRef, useState } from 'react';
import ManualEmpleado from './screens/ManualEmpleado.jsx';
import SeleccionCascada from './screens/SeleccionCascada.jsx';
import SeleccionScrum from './screens/SeleccionScrum';
import SeleccionKanban from './screens/SeleccionKanban';
import CascadaP1 from './screens/cascada/CascadaP1';
import CascadaP2 from './screens/cascada/CascadaP2';
import CascadaP3 from './screens/cascada/CascadaP3';
import GameOver  from './screens/GameOver';

function App() {
  const audioRef = useRef(null);
  const [currentScreen, setCurrentScreen] = useState('intro'); // 'intro' | 'menu'
  const [transitioning, setTransitioning] = useState(false);

  const playClickSound = () => {
    const click = new Audio('/sonido2.mp3');
    click.volume = 0.6;
    click.play().catch(e => console.log("Audio click esperando interacción", e));
  };

  const playHoverSound = () => {
    const hover = new Audio('/sonido1.mp3');
    hover.volume = 0.4;
    hover.play().catch(e => console.log("Audio hover esperando interacción", e));
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.1;
      audioRef.current.play().catch(() => {
        console.log("El navegador pausó el audio. Esperando interacción del usuario.");
      });
    }
  }, []);

  // Función de transición: fade negro -> cambia pantalla -> fade out
const [screenData, setScreenData] = useState({});

const goToScreen = (screenName, data = {}) => {
  playClickSound();
  audioRef.current?.play();
  setScreenData(data);
  setTransitioning(true);
  setTimeout(() => {
    setCurrentScreen(screenName);
    setTransitioning(false);
  }, 700);
};

  return (
    <div className="relative min-h-screen flex items-center justify-center">

      {/* Audio de fondo persistente */}
      <audio ref={audioRef} src="/musica-fondo.mp3" loop />

      {/* Overlay de transición (fade a negro) */}
      <div
        className="fixed inset-0 bg-black z-50 pointer-events-none transition-opacity duration-700"
        style={{ opacity: transitioning ? 1 : 0 }}
      />

      {/* PANTALLA: INTRO */}
      {currentScreen === 'intro' && (
        <div className="max-w-5xl w-full px-4 py-12 flex flex-col items-center animate-fade-in">

          <header className="text-center mb-16">
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

          <div className="w-full max-w-2xl flex flex-col md:flex-row items-center gap-6 mb-12">
            <div className="w-24 h-24 shrink-0 bg-slate-900 rounded-full flex items-center justify-center overflow-hidden border-2 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.5)]">
              <img src="/metto.gif" alt="Metto" className="w-full h-full object-cover" onError={(e) => e.target.style.display='none'} />
            </div>
            <div className="flex-1 relative">
              <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-0 h-0 border-y-8 border-y-transparent border-r-8 border-r-slate-900/70 hidden md:block"></div>
              <p className="bg-slate-900/70 backdrop-blur-sm p-4 rounded-lg text-slate-200 italic text-sm md:text-base shadow-inner border border-white/10">
                "¡Saludos, humano! Soy Metto, tu asistente. Analizaré tus decisiones para asegurar que el flujo sea óptimo. ¿Estás listo para compilar tu futuro?"
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-4xl w-full mb-16">
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

          <button
            onMouseEnter={playHoverSound}
            onClick={() => goToScreen('menu')}
            className="group relative px-12 py-4 bg-white text-black font-black text-2xl uppercase tracking-tighter rounded-sm hover:bg-cyan-400 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.2)]"
          >
            <span className="relative z-10">Iniciar Simulación</span>
            <div className="absolute inset-0 bg-cyan-500 blur-xl opacity-0 group-hover:opacity-50 transition-opacity"></div>
          </button>

        </div>
      )}

      {/* PANTALLA: MENÚ PRINCIPAL */}
      {currentScreen === 'menu' && (
        <div className="max-w-5xl w-full px-4 py-12 flex flex-col items-center animate-fade-in">

          <header className="text-center mb-10">
            <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)] uppercase italic">
              METODOLOGÍAS
            </h1>
            <div className="flex items-center justify-center gap-4 mt-1">
              <div className="h-px w-12 bg-white/30"></div>
              <h2 className="text-xl md:text-2xl text-slate-200 font-light tracking-[0.3em] uppercase">
                El Juego
              </h2>
              <div className="h-px w-12 bg-white/30"></div>
            </div>
            <p className="mt-2 text-yellow-300 font-bold tracking-widest text-sm uppercase">
              Bienvenido, empleado nuevo. Tu trabajo es simple: sobrevive.
            </p>
          </header>

          {/* Metto con mensaje diferente */}
          <div className="w-full max-w-2xl flex flex-col md:flex-row items-center gap-6 mb-12">
            <div className="w-24 h-24 shrink-0 bg-slate-900 rounded-full flex items-center justify-center overflow-hidden border-2 border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.4)]">
              <img src="/metto.gif" alt="Metto" className="w-full h-full object-cover" onError={(e) => e.target.style.display='none'} />
            </div>
            <div className="flex-1 relative">
              <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-0 h-0 border-y-8 border-y-transparent border-r-8 border-r-slate-900/70 hidden md:block"></div>
              <p className="bg-slate-900/70 backdrop-blur-sm p-4 rounded-lg text-slate-200 italic text-sm md:text-base shadow-inner border border-white/10">
                "¡Hola! Según mis bases de datos, el <span className="text-cyan-400 font-bold not-italic">Modelo Cascada</span> es rígido pero seguro. ¡Asegúrate de planear bien antes de empezar a escribir código!"
              </p>
            </div>
          </div>

{/* Botones de modo */}
<div className="flex flex-col gap-4 w-full max-w-md mb-8">
  {[
    { label: 'Modo Cascada', bg: 'bg-blue-500',   border: 'border-blue-400', screen: 'cascada' },
    { label: 'Modo Scrum',   bg: 'bg-green-500',  border: 'border-green-400', screen: 'scrum' },
    { label: 'Modo Kanban',  bg: 'bg-purple-500', border: 'border-purple-400', screen: 'kanban' },
  ].map((btn) => (
    <button
      key={btn.screen}
      onMouseEnter={playHoverSound}
      onClick={() => goToScreen(btn.screen)}
      className={`w-full py-4 ${btn.bg} border-2 ${btn.border} text-white font-black text-xl uppercase tracking-widest rounded-sm transition-transform duration-200 hover:scale-105 active:scale-95`}
    >
      {btn.label}
    </button>
  ))}

  {/* Botón Manual */}
  <button
    onMouseEnter={playHoverSound}
    onClick={() => goToScreen('manual')}
    className="w-full py-3 bg-transparent border border-white/30 text-slate-400 font-bold text-sm uppercase tracking-widest rounded-sm transition-transform duration-200 hover:border-white/60 hover:text-white hover:scale-105 active:scale-95"
  >
    Manual del Empleado
  </button>
</div>

{/* Botón volver */}
<button
  onMouseEnter={playHoverSound}
  onClick={() => goToScreen('intro')}
  className="text-slate-500 text-xs uppercase tracking-widest hover:text-slate-300 transition-colors mt-2"
>
  ← Volver al inicio
</button>

        </div>
      )}

      {currentScreen === 'manual' && (
  <ManualEmpleado
    goToScreen={goToScreen}
    playClickSound={playClickSound}
    playHoverSound={playHoverSound}
  />
)}

{currentScreen === 'cascada' && (
  <SeleccionCascada
    goToScreen={goToScreen}
    mainAudioRef={audioRef}
    playClickSound={playClickSound}
    playHoverSound={playHoverSound}
  />
)}

{currentScreen === 'scrum' && (
  <SeleccionScrum
    goToScreen={goToScreen}
    mainAudioRef={audioRef}
    playClickSound={playClickSound}
    playHoverSound={playHoverSound}
  />
)}

{currentScreen === 'kanban' && (
  <SeleccionKanban
    goToScreen={goToScreen}
    mainAudioRef={audioRef}
    playClickSound={playClickSound}
    playHoverSound={playHoverSound}
  />
)}

{currentScreen === 'cascadaP1' && (
  <CascadaP1 
    goToScreen={goToScreen} 
    playHoverSound={playHoverSound} 
    mainAudioRef={audioRef} // <-- AÑADE ESTA LÍNEA
  />
)}
{currentScreen === 'cascadaP2' && (
  <CascadaP2 
    goToScreen={goToScreen} 
    playHoverSound={playHoverSound} 
    mainAudioRef={audioRef} // <-- AÑADE ESTA LÍNEA
  />
)}
{currentScreen === 'cascadaP3' && (
  <CascadaP3 
    goToScreen={goToScreen} 
    playHoverSound={playHoverSound} 
    mainAudioRef={audioRef} // <-- AÑADE ESTA LÍNEA
  />
)}

{currentScreen === 'gameover' && (
  <GameOver
    goToScreen={goToScreen}
    playHoverSound={playHoverSound}
    score={screenData.score ?? 0}
    proyectoOrigen={screenData.proyectoOrigen ?? 'cascadaP1'}
  />
)}

    </div>
  );
}

export default App;