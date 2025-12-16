import React, { useState, useMemo } from 'react';
import Fretboard from './components/Fretboard';
import InfoPanel from './components/InfoPanel';
import { NotePosition, CalculationMode } from './types';
import { calculateInterval, getPitch, getAllPositionsForPitchClass } from './utils/musicLogic';

const App: React.FC = () => {
  const [rootNote, setRootNote] = useState<NotePosition | null>(null);
  const [targetNote, setTargetNote] = useState<NotePosition | null>(null);

  const handleNoteSelect = (pos: NotePosition) => {
    // If no root is selected, set root
    if (!rootNote) {
      setRootNote(pos);
      return;
    }
    
    // Toggle root off if clicked again
    if (rootNote.stringIndex === pos.stringIndex && rootNote.fret === pos.fret) {
      setRootNote(null);
      setTargetNote(null);
      return;
    }

    setTargetNote(pos);
  };

  const handleReset = () => {
    setRootNote(null);
    setTargetNote(null);
  };

  const intervalResult = useMemo(() => {
    if (rootNote && targetNote) {
      return calculateInterval(rootNote, targetNote);
    }
    return null;
  }, [rootNote, targetNote]);

  // Calculate Ghost Notes (All octaves of Root) for Descending Mode
  const ghostNotes = useMemo(() => {
    if (intervalResult?.mode === CalculationMode.DESCENDING && rootNote) {
      const rootPitch = getPitch(rootNote);
      return getAllPositionsForPitchClass(rootPitch);
    }
    return [];
  }, [intervalResult, rootNote]);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 font-sans flex flex-col">
      
      {/* Header */}
      <header className="p-6 flex justify-between items-center border-b border-neutral-900 bg-neutral-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">Intervalle<span className="text-cyan-500">Master</span></h1>
          <p className="text-xs text-neutral-500 mt-1">Calculateur de tons et d'intervalles</p>
        </div>
        <button 
          onClick={handleReset}
          className="px-4 py-2 text-xs font-mono bg-neutral-900 hover:bg-neutral-800 text-neutral-400 rounded border border-neutral-800 transition-all active:scale-95"
        >
          RÉINITIALISER
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-start pt-8 pb-12 space-y-12">
        
        {/* Results Panel */}
        <div className="w-full px-4">
           <InfoPanel result={intervalResult} hasRoot={!!rootNote} />
        </div>

        {/* The Guitar Neck */}
        <div className="w-full border-y border-neutral-900 bg-[#121212]">
          <Fretboard 
            root={rootNote} 
            target={targetNote} 
            ghosts={ghostNotes}
            onSelect={handleNoteSelect} 
          />
        </div>

        {/* Instructions / Legend */}
        <div className="flex flex-wrap justify-center gap-6 text-sm text-neutral-400 font-mono px-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-full bg-cyan-500 text-black flex items-center justify-center font-bold text-xs">T</div>
            <span>Tonique</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center font-bold text-xs">C</div>
            <span>Cible</span>
          </div>
          {intervalResult?.mode === CalculationMode.DESCENDING && ghostNotes.length > 0 && (
             <div className="flex items-center space-x-2 animate-pulse">
              <div className="w-6 h-6 rounded-full border-2 border-dashed border-neutral-500"></div>
              <span>Octaves Tonique</span>
            </div>
          )}
        </div>

      </main>
    </div>
  );
};

export default App;