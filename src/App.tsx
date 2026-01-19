import { useEffect, useMemo, useState } from "react";
import type { Clef, Feedback, Note, StatsMap } from "./types";
import { KEY_SIGS, RANGES } from "./utils/constants";
import {
  buildMidiRange,
  loadStats,
  noteLabel,
  saveStats,
  spellMidi,
  updateStats,
  weightedPick,
  weightForMidi,
} from "./utils/noteUtils";
import { ensureAudioStarted, playMidi } from "./utils/audio";
import { StaveDisplay } from "./components/StaveDisplay";
import { ScoreBoard } from "./components/ScoreBoard";
import { PianoKeyboard } from "./components/PianoKeyboard";
import { SettingsPanel } from "./components/SettingsPanel";

type DifficultyLevel = "beginner" | "intermediate" | "advanced";

const APP_VERSION = "1.2.1";
const SETTINGS_STORAGE_KEY = "piano_flashcards_settings_v1";

function loadSettings() {
  try {
    const raw = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export default function App() {
  const savedSettings = loadSettings();
  
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(savedSettings?.difficulty ?? "beginner");
  const [showHints, setShowHints] = useState<boolean>(savedSettings?.showHints ?? false);
  const [rangeId, setRangeId] = useState<string>(savedSettings?.rangeId ?? RANGES[0].id);
  const range = useMemo(() => RANGES.find((r) => r.id === rangeId) ?? RANGES[0], [rangeId]);

  const [clef, setClef] = useState<Clef>(savedSettings?.clef ?? range.clef);
  const [keySigId, setKeySigId] = useState<string>(savedSettings?.keySigId ?? KEY_SIGS[0].id);
  const keySig = useMemo(() => KEY_SIGS.find((k) => k.id === keySigId) ?? KEY_SIGS[0], [keySigId]);

  // Derive includeAccidentals from difficulty level
  const includeAccidentals = useMemo(() => {
    if (difficulty === "beginner") return false;
    return true;
  }, [difficulty]);
  const [stats, setStats] = useState<StatsMap>(() => loadStats());
  const [current, setCurrent] = useState<Note>(() => {
    const midi = 60;
    return { midi, spelling: spellMidi(midi, KEY_SIGS[0].pref) };
  });
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [feedback, setFeedback] = useState<Feedback>({ 
    type: "neutral", 
    text: "Click a piano key to answer." 
  });

  const midiChoices = useMemo(
    () => buildMidiRange(range.minMidi, range.maxMidi, includeAccidentals),
    [range, includeAccidentals]
  );

  // Keep clef in sync with range preset
  useEffect(() => {
    setClef(range.clef);
  }, [range.clef]);

  // Persist stats
  useEffect(() => {
    saveStats(stats);
  }, [stats]);

  // Persist settings
  useEffect(() => {
    try {
      window.localStorage.setItem(
        SETTINGS_STORAGE_KEY,
        JSON.stringify({ rangeId, clef, keySigId, difficulty, showHints })
      );
    } catch {
      // ignore
    }
  }, [rangeId, clef, keySigId, difficulty, showHints]);

  function pickNextNote(avoidMidi?: number): Note {
    const weights = midiChoices.map((m) => weightForMidi(stats, m));

    // Try to avoid immediate repeats when we have options
    let choices = midiChoices;
    let adjustedWeights = weights;
    if (avoidMidi !== undefined && midiChoices.length > 1) {
      const filtered = midiChoices
        .map((m, idx) => ({ midi: m, weight: weights[idx] }))
        .filter(({ midi }) => midi !== avoidMidi);
      if (filtered.length > 0) {
        choices = filtered.map((c) => c.midi);
        adjustedWeights = filtered.map((c) => c.weight);
      }
    }

    const midi = weightedPick(choices, adjustedWeights);
    return { midi, spelling: spellMidi(midi, keySig.pref) };
  }

  // When settings change, refresh the card
  useEffect(() => {
    const next = pickNextNote(current.midi);
    setCurrent(next);
    setFeedback({ type: "neutral", text: "What note is this?" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rangeId, difficulty, keySigId]);

  const next = (avoidMidi?: number): void => {
    const midiToAvoid = avoidMidi ?? current.midi;
    setCurrent(pickNextNote(midiToAvoid));
    setFeedback({ type: "neutral", text: "What note is this?" });
  };

  const submitMidi = async (answerMidi: number): Promise<void> => {
    await ensureAudioStarted();

    const correct = answerMidi === current.midi;

    // Only play the clicked note
    playMidi(answerMidi);

    setStats((s) => updateStats(s, current.midi, correct));

    if (correct) {
      setScore((v) => v + 1);
      setStreak((v) => v + 1);
      setFeedback({ type: "good", text: `✅ Correct: ${noteLabel(current)}` });
    } else {
      setStreak(0);
      const your = { midi: answerMidi, spelling: spellMidi(answerMidi, keySig.pref) };
      setFeedback({ 
        type: "bad", 
        text: `❌ Nope — it was ${noteLabel(current)} (you played ${noteLabel(your)})` 
      });
    }

    window.setTimeout(() => next(current.midi), 700);
  };

  const handleResetStats = (): void => {
    setStats({});
    setScore(0);
    setStreak(0);
    setFeedback({ type: "neutral", text: "Stats cleared. What note is this?" });
    next();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden">
      <div className="mx-auto w-full max-w-none px-4 py-4 sm:px-6 sm:py-6">
        <div className="rounded-3xl bg-slate-900/70 p-4 shadow-2xl ring-1 ring-white/10 sm:p-6">
          <header className="mb-4 sm:mb-5">
            <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
              ReadNote
              <span className="ml-2 text-xs font-normal text-slate-400 sm:ml-3 sm:text-sm">v{APP_VERSION}</span>
            </h1>
            <p className="mt-1 text-sm text-slate-300 sm:text-base">
              Piano note flashcards for learning the staff. Click the on-screen piano to answer, and replay notes for ear training.
            </p>
          </header>

          <div className="flex flex-col gap-4 sm:gap-6 lg:grid lg:grid-cols-[1fr_360px]">
            <div className="rounded-2xl bg-slate-950/40 p-4 shadow-lg ring-1 ring-white/10 sm:p-5">
              <ScoreBoard score={score} streak={streak} feedback={feedback} />

              <StaveDisplay note={current} clef={clef} keySig={keySig} />

              <div className="mt-3 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => next()}
                  className="rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-slate-100 ring-1 ring-white/10 hover:bg-white/15"
                >
                  Next
                </button>

                <button
                  onClick={async () => {
                    await ensureAudioStarted();
                    playMidi(current.midi);
                  }}
                  className="rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-slate-100 ring-1 ring-white/10 hover:bg-white/15"
                >
                  Play note
                </button>
              </div>

              <PianoKeyboard
                minMidi={range.minMidi}
                maxMidi={range.maxMidi}
                currentNote={current}
                includeAccidentals={includeAccidentals}
                midiChoices={midiChoices}
                keySigPref={keySig.pref}
                showHints={showHints}
                onKeyPress={(midi) => void submitMidi(midi)}
              />
            </div>

            <SettingsPanel
              rangeId={rangeId}
              clef={clef}
              keySigId={keySigId}
              difficulty={difficulty}
              showHints={showHints}
              currentNote={current}
              range={range}
              keySig={keySig}
              onRangeChange={setRangeId}
              onClefChange={setClef}
              onKeySigChange={setKeySigId}
              onDifficultyChange={setDifficulty}
              onShowHintsChange={setShowHints}
              onResetStats={handleResetStats}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
