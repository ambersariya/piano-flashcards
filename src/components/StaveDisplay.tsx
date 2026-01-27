import type { Clef, KeySig, Note } from "../types";
import { useRef, useEffect } from "react";
import Flow from "vexflow";
import { vexKeyForNote } from "../utils/noteUtils";

const STROKE = "#0f172a"; // dark stroke for visibility on light card

interface StaveDisplayProps {
  note: Note;
  clef: Clef;
  keySig: KeySig;
}

export function StaveDisplay({ note, clef, keySig }: StaveDisplayProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    el.innerHTML = "";

    const { Renderer, Stave, StaveNote, Voice, Formatter, Accidental } = Flow;

    // Make stave responsive to container width
    const width = Math.min(el.clientWidth || 640, 640);
    const scale = 2.00; // zoom everything a bit for readability
    const drawWidth = width / scale;
    const height = 240;
    const staveWidth = drawWidth - 40; // 20px padding on each side

    const renderer = new Renderer(el, Renderer.Backends.SVG);
    renderer.resize(width, height * scale);
    const context = renderer.getContext();
    context.scale(scale, scale);
    context.setFillStyle(STROKE);
    context.setStrokeStyle(STROKE);

    const stave = new Stave(20, 60, staveWidth);
    stave.addClef(clef);
    stave.addKeySignature(keySig.vex);
    stave.setContext(context).draw();

    const keys = [vexKeyForNote(note)];
    const staveNote = new StaveNote({
      clef,
      keys,
      duration: "q",
    }).setStyle({ strokeStyle: STROKE, fillStyle: STROKE });

    // If our key string includes an accidental, add it explicitly so it's always shown.
    if (note.spelling.accidental === "#" || note.spelling.accidental === "b") {
      staveNote.addModifier(new Accidental(note.spelling.accidental));
    }

    const voice = new Voice({ numBeats: 1, beatValue: 4 });
    // Flashcards are measure-free: allow incomplete measures.
    voice.setMode(Flow.Voice.Mode.SOFT);
    voice.addTickables([staveNote]);

    new Formatter().joinVoices([voice]).format([voice], 240);
    voice.draw(context, stave);
  }, [note, clef, keySig]);

  return (
    <div className="rounded-xl bg-white p-2 overflow-hidden">
      <div ref={containerRef} className="w-full" />
    </div>
  );
}
