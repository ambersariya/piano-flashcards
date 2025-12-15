import React, { useEffect, useMemo, useRef, useState } from "react";
import Flow from "vexflow";
import * as Tone from "tone";

type Natural = "C" | "D" | "E" | "F" | "G" | "A" | "B";

type Note = {
  step: Natural;
  oct: number;
};

type Range = {
  start: Note;
  end: Note;
};

type Feedback =
  | { type: "neutral"; text: string }
  | { type: "good"; text: string }
  | { type: "bad"; text: string };

const NATURALS: Natural[] = ["C", "D", "E", "F", "G", "A", "B"];

const RANGES: Record<string, Range> = {
  "C4–B4 (easy)": { start: { step: "C", oct: 4 }, end: { step: "B", oct: 4 } },
  "C4–C5": { start: { step: "C", oct: 4 }, end: { step: "C", oct: 5 } },
  "C4–C6": { start: { step: "C", oct: 4 }, end: { step: "C", oct: 6 } },
};

function noteIndex(step: Natural, oct: number): number {
  return oct * 7 + NATURALS.indexOf(step);
}

function fromIndex(idx: number): Note {
  const step = NATURALS[((idx % 7) + 7) % 7];
  const oct = Math.floor(idx / 7);
  return { step, oct };
}

function randomNoteInRange(rangeKey: string): Note {
  const r = RANGES[rangeKey];
  const a = noteIndex(r.start.step, r.start.oct);
  const b = noteIndex(r.end.step, r.end.oct);
  const lo = Math.min(a, b);
  const hi = Math.max(a, b);
  const pick = lo + Math.floor(Math.random() * (hi - lo + 1));
  return fromIndex(pick);
}

function vexKey(step: Natural, oct: number): string {
  // VexFlow wants e.g. "c/4"
  return `${step.toLowerCase()}/${oct}`;
}

const synth = new Tone.Synth({
  oscillator: { type: "sine" },
  envelope: {
    attack: 0.01,
    decay: 0.1,
    sustain: 0.3,
    release: 0.8,
  },
}).toDestination();

function playNote(note: Note): void {
  const midiNote = `${note.step}${note.oct}`; // e.g. "C4"
  synth.triggerAttackRelease(midiNote, "8n");
}

export default function App() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [rangeKey, setRangeKey] = useState<string>(Object.keys(RANGES)[0]);
  const [current, setCurrent] = useState<Note>(() =>
    randomNoteInRange(Object.keys(RANGES)[0])
  );
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [feedback, setFeedback] = useState<Feedback>({
    type: "neutral",
    text: "Click the note name below.",
  });

  const options = useMemo(() => NATURALS, []);
  const ensureAudioStarted = async () => {
    if (Tone.context.state !== "running") {
      await Tone.start();
    }
  };
  const draw = (note: Note): void => {
    const el = containerRef.current;
    if (!el) return;

    // Clear previous SVG
    el.innerHTML = "";

    const { Renderer, Stave, StaveNote, Voice, Formatter } = Flow;

    const renderer = new Renderer(el, Renderer.Backends.SVG);
    renderer.resize(420, 180);
    const context = renderer.getContext();

    const stave = new Stave(20, 40, 380);
    stave.addClef("treble");
    stave.setContext(context).draw();

    const staveNote = new StaveNote({
      clef: "treble",
      keys: [vexKey(note.step, note.oct)],
      duration: "q",
    });

    const voice = new Voice({ num_beats: 1, beat_value: 4 });
    // VexFlow voices are strict by default; for flashcards we allow incomplete measures.
    // This avoids: IncompleteVoice: Voice does not have enough notes.
    voice.setMode(Flow.Voice.Mode.SOFT);
    voice.addTickables([staveNote]);

    new Formatter().joinVoices([voice]).format([voice], 220);
    voice.draw(context, stave);
  };

  useEffect(() => {
    draw(current);
  }, [current]);

  useEffect(() => {
    // when range changes, generate a new note inside that range
    setCurrent(randomNoteInRange(rangeKey));
    setFeedback({ type: "neutral", text: "What note is this?" });
  }, [rangeKey]);

  const next = (): void => {
    setCurrent(randomNoteInRange(rangeKey));
    setFeedback({ type: "neutral", text: "What note is this?" });
  };

  const submit = async (answer: Natural): Promise<void> => {
    await ensureAudioStarted();

    const correct = answer === current.step;

    // play the correct note (ear training)
    playNote(current);

    if (correct) {
      setScore((s) => s + 1);
      setStreak((s) => s + 1);
      setFeedback({
        type: "good",
        text: `✅ Correct: ${current.step}${current.oct}`,
      });
    } else {
      setStreak(0);
      setFeedback({
        type: "bad",
        text: `❌ Nope — it was ${current.step}${current.oct}`,
      });
    }

    window.setTimeout(() => next(), 650);
  };

  const pillClass =
    feedback.type === "good"
      ? "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200"
      : feedback.type === "bad"
      ? "bg-rose-50 text-rose-800 ring-1 ring-rose-200"
      : "bg-slate-50 text-slate-700 ring-1 ring-slate-200";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-3xl px-6 py-10">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">
            Piano Note Flashcards
          </h1>
          <p className="mt-1 text-slate-300">
            Identify the note on the stave. Start with naturals; add
            sharps/flats once this feels easy.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-[1fr_280px]">
          <div className="rounded-2xl bg-slate-900/60 p-5 shadow-lg ring-1 ring-white/10">
            <div className="mb-4 flex flex-wrap gap-2">
              <div className="rounded-full bg-slate-800 px-3 py-1 text-sm text-slate-200">
                Score: <span className="font-semibold">{score}</span>
              </div>
              <div className="rounded-full bg-slate-800 px-3 py-1 text-sm text-slate-200">
                Streak: <span className="font-semibold">{streak}</span>
              </div>
              <div className={`rounded-full px-3 py-1 text-sm ${pillClass}`}>
                {feedback.text}
              </div>
            </div>

            <div className="rounded-xl bg-white p-2">
              <div ref={containerRef} />
            </div>

            <div className="mt-5 grid grid-cols-7 gap-2">
              {options.map((n) => (
                <button
                  key={n}
                  onClick={() => submit(n)}
                  className="rounded-xl bg-slate-800 px-3 py-3 text-base font-semibold text-slate-100 ring-1 ring-white/10 transition hover:-translate-y-0.5 hover:bg-slate-700 active:translate-y-0"
                >
                  {n}
                </button>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                onClick={next}
                className="rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-slate-100 ring-1 ring-white/10 hover:bg-white/15"
              >
                Next
              </button>

              <label className="flex items-center gap-2 text-sm text-slate-200">
                Range
                <select
                  value={rangeKey}
                  onChange={(e) => setRangeKey(e.target.value)}
                  className="rounded-xl bg-slate-800 px-3 py-2 text-sm text-slate-100 ring-1 ring-white/10 focus:outline-none"
                >
                  {Object.keys(RANGES).map((k) => (
                    <option key={k} value={k}>
                      {k}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <aside className="rounded-2xl bg-slate-900/60 p-5 ring-1 ring-white/10">
            <h2 className="text-base font-semibold">Next upgrades</h2>
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              <li>• Add bass clef toggle + lower ranges (E2–C4)</li>
              <li>• Add accidentals (C#, Eb) + key signatures</li>
              <li>• Replace buttons with an on-screen piano</li>
              <li>• MIDI input (press a key to answer)</li>
              <li>• Spaced repetition: weak notes appear more often</li>
            </ul>
          </aside>
        </div>
      </div>
    </div>
  );
}
