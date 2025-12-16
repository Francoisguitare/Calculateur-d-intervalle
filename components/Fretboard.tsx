import React from 'react';
import { NotePosition } from '../types';
import { STRINGS, TOTAL_FRETS } from '../constants';

interface FretboardProps {
  root: NotePosition | null;
  target: NotePosition | null;
  ghosts?: NotePosition[];
  onSelect: (pos: NotePosition) => void;
}

const Fretboard: React.FC<FretboardProps> = ({ root, target, ghosts = [], onSelect }) => {
  // Generate frets array [0, 1, ... TOTAL_FRETS]
  const frets = Array.from({ length: TOTAL_FRETS }, (_, i) => i);
  // Strings are reversed for visual rendering (High E on top, Low E on bottom)
  const visualStringIndices = [5, 4, 3, 2, 1, 0];

  const isSelected = (stringIdx: number, fretIdx: number, type: 'root' | 'target' | 'ghost') => {
    if (type === 'root') return root?.stringIndex === stringIdx && root?.fret === fretIdx;
    if (type === 'target') return target?.stringIndex === stringIdx && target?.fret === fretIdx;
    if (type === 'ghost') return ghosts.some(g => g.stringIndex === stringIdx && g.fret === fretIdx);
    return false;
  };

  return (
    <div className="w-full overflow-x-auto pb-8 pt-4 select-none">
      <div className="relative min-w-[800px] px-4">
        {/* Nut (Fret 0) Indicator */}
        <div className="absolute left-10 top-0 bottom-0 w-2 bg-neutral-700/80 z-10 rounded-sm"></div>

        {/* Fret Markers (Dots) */}
        <div className="absolute inset-0 pointer-events-none z-0">
             {/* Single Dots */}
             {[3, 5, 7, 9].map(fret => (
               <div key={`dot-${fret}`} className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-neutral-800 rounded-full"
                    style={{ left: `${(fret * 80) + 40 + 20}px` }}></div>
             ))}
             {/* Double Dot 12 */}
             <div className="absolute top-1/3 -translate-y-1/2 w-4 h-4 bg-neutral-800 rounded-full"
                  style={{ left: `${(12 * 80) + 40 + 20}px` }}></div>
             <div className="absolute top-2/3 -translate-y-1/2 w-4 h-4 bg-neutral-800 rounded-full"
                  style={{ left: `${(12 * 80) + 40 + 20}px` }}></div>
        </div>

        {/* Grid */}
        <div className="flex flex-col relative z-20">
          {visualStringIndices.map((stringIdx) => (
            <div key={`string-${stringIdx}`} className="flex items-center h-12 relative group">
              
              {/* The String Line (Variable Thickness) 
                  stringIdx 0 is Low E (Thickest)
                  stringIdx 5 is High E (Thinnest)
              */}
              <div 
                className="absolute left-0 right-0 top-1/2 -translate-y-1/2 bg-neutral-500 group-hover:bg-neutral-400 transition-colors"
                style={{ height: `${1 + (6 - stringIdx) * 0.4}px` }}
              ></div>

              {/* String Name Label */}
              <div className="absolute -left-6 w-6 text-xs text-neutral-400 font-bold font-mono flex justify-center">
                {STRINGS[stringIdx]}
              </div>

              {/* Frets */}
              {frets.map((fret) => {
                const isRoot = isSelected(stringIdx, fret, 'root');
                const isTarget = isSelected(stringIdx, fret, 'target');
                const isGhost = !isRoot && !isTarget && isSelected(stringIdx, fret, 'ghost');

                return (
                  <div
                    key={`s${stringIdx}-f${fret}`}
                    onClick={() => onSelect({ stringIndex: stringIdx, fret })}
                    className="relative h-12 flex-shrink-0 cursor-pointer flex items-center justify-center border-r border-neutral-700 hover:bg-white/5 transition-colors"
                    style={{ width: fret === 0 ? '50px' : '80px' }} // Nut is narrower
                  >
                    {/* Note Markers */}
                    
                    {/* Ghost Note */}
                    {isGhost && (
                      <div className="w-8 h-8 rounded-full border-2 border-dashed border-neutral-500 opacity-60 flex items-center justify-center z-10 animate-pulse">
                      </div>
                    )}

                    {/* Active Notes */}
                    {(isRoot || isTarget) && (
                      <div className={`
                        w-9 h-9 rounded-full flex items-center justify-center shadow-lg transform transition-transform duration-200 scale-100
                        ${isRoot ? 'bg-cyan-500 text-black z-30' : ''}
                        ${isTarget ? 'bg-rose-500 text-white z-20' : ''}
                        ${isRoot && isTarget ? 'ring-4 ring-rose-500 bg-cyan-500' : ''} 
                      `}>
                         {/* T for Tonique, C for Cible */}
                         {isRoot && <span className="font-extrabold text-sm font-mono">T</span>}
                         {isTarget && !isRoot && <span className="font-extrabold text-sm font-mono">C</span>}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        
        {/* Fret Numbers Footer */}
        <div className="flex pl-[50px]">
           {frets.slice(1).map(fret => (
             <div key={`num-${fret}`} className="w-[80px] text-center text-xs text-neutral-500 pt-2 font-mono font-medium">
               {fret}
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default Fretboard;