export interface NotePosition {
  stringIndex: number; // 0 (High E) to 5 (Low E) or reversed depending on rendering, we will use 0 = Low E (thickest)
  fret: number; // 0 to 15
}

export enum CalculationMode {
  ASCENDING = 'ASCENDING',
  DESCENDING = 'DESCENDING',
  UNISON = 'UNISON'
}

export interface IntervalResult {
  semitonesDiff: number;
  tonesDiff: number;
  mode: CalculationMode;
  name: string;
  formula: string; // The math string to display (e.g. "6 - 1 = 5")
}
