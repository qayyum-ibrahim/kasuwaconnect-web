import { MapPin, Clock, Zap, ChevronRight } from "lucide-react";
import type { JobMatch } from "../../types";

type JobMatchCardProps = {
  match: JobMatch;
  onApply: (jobId: string) => void;
  applying: boolean;
  applied: boolean;
};

function MatchBadge({ pct }: { pct: number }) {
  const color =
    pct >= 90 ? "bg-success" : pct >= 70 ? "bg-warning" : "bg-muted";
  return (
    <div
      className={`${color} text-white px-3 py-1.5 rounded-full flex items-center gap-1.5`}
    >
      <Zap size={12} className="shrink-0" />
      <span className="text-xs font-bold">{pct}% match</span>
    </div>
  );
}

export default function JobMatchCard({
  match,
  onApply,
  applying,
  applied,
}: JobMatchCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-border shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-200 overflow-hidden">
      {/* Top accent bar — colored by match score */}
      <div
        className={`h-1 w-full ${
          match.match_percentage >= 90
            ? "bg-success"
            : match.match_percentage >= 70
              ? "bg-warning"
              : "bg-muted"
        }`}
      />

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-dark text-base leading-tight truncate">
              {match.title}
            </h3>
            <div className="flex items-center gap-3 mt-1 text-xs text-muted flex-wrap">
              {match.market_location && (
                <span className="flex items-center gap-1">
                  <MapPin size={11} />
                  {match.market_location}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Clock size={11} />
                {match.pay_frequency}
              </span>
            </div>
          </div>
          {/* AI Match badge — prominent top right */}
          {match.match_percentage > 0 && (
            <MatchBadge pct={match.match_percentage} />
          )}
        </div>

        {/* Pay */}
        <div className="mb-4">
          <span className="text-2xl font-bold text-primary">
            ₦{match.pay_amount.toLocaleString()}
          </span>
          <span className="text-muted text-sm ml-1">
            / {match.pay_frequency}
          </span>
        </div>

        {/* Matched skills */}
        {match.matched_skills?.length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-muted mb-2 font-medium">
              Your matching skills
            </p>
            <div className="flex flex-wrap gap-1.5">
              {match.matched_skills.map((sk) => (
                <span
                  key={sk}
                  className="text-xs bg-success/10 text-success font-semibold px-2.5 py-1 rounded-full flex items-center gap-1"
                >
                  ✓ {sk}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Score breakdown — collapsed detail */}
        {match.score_breakdown && (
          <div className="mb-4 bg-offwhite rounded-xl p-3 space-y-1.5">
            <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-2">
              Match breakdown
            </p>
            {[
              { label: "Skills", val: match.score_breakdown.skills_score },
              { label: "Category", val: match.score_breakdown.category_score },
              { label: "Location", val: match.score_breakdown.location_score },
              { label: "Language", val: match.score_breakdown.language_score },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <span className="text-xs text-muted w-16 shrink-0">
                  {item.label}
                </span>
                <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${Math.round(item.val * 100)}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-text-sub w-8 text-right">
                  {Math.round(item.val * 100)}%
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Apply button */}
        {applied ? (
          <div className="w-full h-11 bg-success/10 text-success font-semibold text-sm rounded-btn flex items-center justify-center gap-2">
            ✓ Applied
          </div>
        ) : (
          <button
            onClick={() => onApply(match.job_id)}
            disabled={applying}
            className="w-full h-11 bg-primary hover:bg-primary-dark disabled:opacity-60 text-white font-semibold text-sm rounded-btn flex items-center justify-center gap-2 transition-all duration-200"
          >
            {applying ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                Apply Now <ChevronRight size={15} />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
