export const INTERVAL_NAMES = [
  "Unisson",             // 0
  "Seconde mineure",     // 1
  "Seconde majeure",     // 2
  "Tierce mineure",      // 3
  "Tierce majeure",      // 4
  "Quarte juste",        // 5
  "Triton",              // 6
  "Quinte juste",        // 7
  "Sixte mineure",       // 8
  "Sixte majeure",       // 9
  "Septième mineure",    // 10
  "Septième majeure",    // 11
  "Octave"               // 12
];

// Offsets for Standard Tuning (E2, A2, D3, G3, B3, E4)
// Relative to Low E (0)
export const STRING_OFFSETS = [0, 5, 10, 15, 19, 24];

export const TOTAL_FRETS = 13; // 0 to 12 inclusive, maybe +1 for aesthetics

export const STRINGS = ['E', 'A', 'D', 'G', 'B', 'e']; // Standard Tuning (Low to High display logic)
