import { confidenceLabel } from "@/lib/scoring";

export function ScoreBar({
  label,
  confidence,
  score,
  color = "#2563eb",
  explanation
}: {
  label: string;
  confidence: number;
  score?: number;
  color?: string;
  explanation?: string;
}) {
  return (
    <div className="rounded-lg border border-line bg-white p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-medium text-ink">{label}</h3>
          <p className="mt-1 text-xs uppercase tracking-wide text-muted">{confidenceLabel(confidence)}</p>
        </div>
        <div className="text-right text-sm font-semibold text-ink">{confidence}%</div>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full" style={{ width: `${confidence}%`, backgroundColor: color }} />
      </div>
      {typeof score === "number" ? <p className="mt-2 text-xs text-muted">Weighted score: {score}</p> : null}
      {explanation ? <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted">{explanation}</p> : null}
    </div>
  );
}
