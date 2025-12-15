export type Clef = "treble" | "bass";

export type AccidentalPref = "sharps" | "flats";

export type PitchSpelling = {
  letter: "A" | "B" | "C" | "D" | "E" | "F" | "G";
  accidental: "" | "#" | "b";
};

export type Note = {
  midi: number; // 0-127
  spelling: PitchSpelling;
};

export type Feedback =
  | { type: "neutral"; text: string }
  | { type: "good"; text: string }
  | { type: "bad"; text: string };

export type RangePreset = {
  id: string;
  label: string;
  clef: Clef;
  minMidi: number;
  maxMidi: number;
};

export type KeySig = {
  // VexFlow key signature string: "C", "G", "D", "F", "Bb", etc.
  id: string;
  label: string;
  vex: string;
  pref: AccidentalPref;
};

export type NoteStats = {
  seen: number;
  correct: number;
  wrong: number;
  // recent accuracy proxy in [0..1]
  emaAcc: number;
};

export type StatsMap = Record<string, NoteStats>; // key: `${midi}`
