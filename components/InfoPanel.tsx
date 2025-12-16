import React from 'react';
import { IntervalResult, CalculationMode } from '../types';

interface InfoPanelProps {
  result: IntervalResult | null;
  hasRoot: boolean;
}

const InfoPanel: React.FC<InfoPanelProps> = ({ result, hasRoot }) => {
  if (!hasRoot) {
    return (
      <div className="h-48 flex flex-col items-center justify-center text-neutral-500 animate-pulse">
        <p className="text-lg">Sélectionnez une note fondamentale (Tonique)</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="h-48 flex flex-col items-center justify-center text-neutral-400">
        <p className="text-lg">Sélectionnez une note cible</p>
      </div>
    );
  }

  const isDescending = result.mode === CalculationMode.DESCENDING;
  const isAscending = result.mode === CalculationMode.ASCENDING;
  const isUnison = result.mode === CalculationMode.UNISON;

  return (
    <div className="h-48 w-full max-w-2xl mx-auto p-6 bg-neutral-900/50 rounded-2xl border border-neutral-800 flex flex-col items-center justify-center text-center">
      
      {isDescending ? (
        // Descending Layout (Pedagogical focus)
        <div className="flex flex-col items-center space-y-3">
          <div className="text-sm font-bold text-rose-400 uppercase tracking-widest flex items-center gap-2">
            <span>↓ Descendant</span>
            <span className="opacity-50">(- {result.formula.split(' = ')[0].split(' - ')[1]} tons)</span>
          </div>
          
          <div className="bg-neutral-800/50 px-4 py-2 rounded-lg border border-neutral-700/50">
             <span className="text-xs text-neutral-400 uppercase mr-2 font-mono">Règle de l'Octave</span>
             <span className="text-2xl font-mono text-neutral-200">
               {result.formula}
             </span>
             <span className="text-lg text-neutral-500 ml-2">tons</span>
          </div>

          <div className="text-3xl font-bold text-rose-400 tracking-wide mt-1">
            {result.name}
          </div>
        </div>
      ) : (
        // Ascending / Unison Layout
        <div className="flex flex-col items-center space-y-4">
           {isAscending && (
             <span className="text-sm text-cyan-500/80 font-mono uppercase tracking-widest">Ascendant</span>
           )}
           
           <div className="text-4xl md:text-5xl font-light font-mono text-neutral-100 tracking-tight">
            {result.formula} {(!isUnison && !result.formula.includes('=')) && <span className="text-2xl text-neutral-500">tons</span>}
          </div>

          <div className={`text-xl md:text-2xl font-bold tracking-wide 
            ${isUnison ? 'text-white' : 'text-cyan-400'}
          `}>
            {result.name}
          </div>
        </div>
      )}
      
    </div>
  );
};

export default InfoPanel;