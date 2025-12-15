import type { Feedback } from "../types";

interface ScoreBoardProps {
  score: number;
  streak: number;
  feedback: Feedback;
}

export function ScoreBoard({ score, streak, feedback }: ScoreBoardProps) {
  const pillClass =
    feedback.type === "good"
      ? "bg-emerald-50 text-emerald-900 ring-1 ring-emerald-200"
      : feedback.type === "bad"
        ? "bg-rose-50 text-rose-900 ring-1 ring-rose-200"
        : "bg-slate-50 text-slate-800 ring-1 ring-slate-200";

  return (
    <div className="mb-4 flex flex-wrap gap-2">
      <div className="rounded-full bg-slate-800 px-3 py-1 text-sm text-slate-200">
        Score: <span className="font-semibold">{score}</span>
      </div>
      <div className="rounded-full bg-slate-800 px-3 py-1 text-sm text-slate-200">
        Streak: <span className="font-semibold">{streak}</span>
      </div>
      <div className={`rounded-full px-3 py-1 text-sm ${pillClass}`}>{feedback.text}</div>
    </div>
  );
}
