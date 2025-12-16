import { NotePosition, IntervalResult, CalculationMode } from '../types';
import { INTERVAL_NAMES, STRING_OFFSETS, TOTAL_FRETS } from '../constants';

/**
 * Calculates the absolute semitone pitch value relative to the lowest string's open note.
 */
export const getPitch = (pos: NotePosition): number => {
  // stringIndex 0 is Low E (bottom of visual stack usually, but let's be consistent with array index)
  // We will map stringIndex 0 -> Low E
  return STRING_OFFSETS[pos.stringIndex] + pos.fret;
};

/**
 * Finds all valid positions on the fretboard for a given pitch.
 */
export const getPositionsForPitch = (pitch: number): NotePosition[] => {
  const positions: NotePosition[] = [];
  for (let stringIndex = 0; stringIndex < STRING_OFFSETS.length; stringIndex++) {
    const basePitch = STRING_OFFSETS[stringIndex];
    const fret = pitch - basePitch;
    if (fret >= 0 && fret < TOTAL_FRETS) {
      positions.push({ stringIndex, fret });
    }
  }
  return positions;
};

/**
 * Finds all positions on the fretboard that share the same pitch class (octaves) as the given pitch.
 */
export const getAllPositionsForPitchClass = (pitch: number): NotePosition[] => {
  const targetClass = pitch % 12;
  const positions: NotePosition[] = [];
  
  for (let stringIndex = 0; stringIndex < STRING_OFFSETS.length; stringIndex++) {
    const stringBase = STRING_OFFSETS[stringIndex];
    let offset = (targetClass - stringBase) % 12;
    if (offset < 0) offset += 12;
    
    for (let fret = offset; fret < TOTAL_FRETS; fret += 12) {
      positions.push({ stringIndex, fret });
    }
  }
  return positions;
};

/**
 * Calculates the interval information between a root and a target note.
 */
export const calculateInterval = (root: NotePosition, target: NotePosition): IntervalResult => {
  const rootPitch = getPitch(root);
  const targetPitch = getPitch(target);
  const diff = targetPitch - rootPitch;

  if (diff === 0) {
    return {
      semitonesDiff: 0,
      tonesDiff: 0,
      mode: CalculationMode.UNISON,
      name: INTERVAL_NAMES[0],
      formula: "Même note"
    };
  }

  const isAscending = diff > 0;
  const absDiff = Math.abs(diff);
  const absTones = absDiff / 2;

  if (isAscending) {
    // Logic: Simple addition
    const nameIndex = absDiff % 12;
    const displayName = (nameIndex === 0 && absDiff > 0) ? "Octave" : INTERVAL_NAMES[nameIndex];

    return {
      semitonesDiff: diff,
      tonesDiff: absTones,
      mode: CalculationMode.ASCENDING,
      name: displayName,
      formula: `+ ${formatTones(absTones)}`
    };
  } else {
    // Logic: Descending (The "6 - X" rule)
    const effectiveSemitonesDown = absDiff % 12;
    
    const effectiveTonesDown = effectiveSemitonesDown / 2;
    const resultTones = 6 - effectiveTonesDown;
    const resultSemitones = resultTones * 2; 

    return {
      semitonesDiff: diff,
      tonesDiff: absTones, 
      mode: CalculationMode.DESCENDING,
      name: INTERVAL_NAMES[Math.round(resultSemitones)], 
      formula: effectiveSemitonesDown === 0 
        ? "Octave" 
        : `6 - ${formatTones(effectiveTonesDown)} = ${formatTones(resultTones)}`
    };
  }
};

const formatTones = (num: number): string => {
  // If integer, return as is. If .5, return X.5
  return num.toString().replace('.', ',');
};