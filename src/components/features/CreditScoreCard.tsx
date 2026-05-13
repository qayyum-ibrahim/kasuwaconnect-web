import { useEffect, useState } from "react";
import { TrendingUp, Info } from "lucide-react";

type CreditScoreCardProps = {
  score: number;
  tier: "unscored" | "low" | "medium" | "high";
  updatedAt?: string;
  breakdown?: {
    totalTransactions: number;
    totalVolume: number;
    weeklyCount: number;
    weeklyVolume: number;
  };
};

const tierConfig = {
  high: { label: "High", bg: "bg-success", text: "Excellent credit profile" },
  medium: {
    label: "Medium",
    bg: "bg-warning",
    text: "Good — keep transacting",
  },
  low: { label: "Low", bg: "bg-primary", text: "Building credit history" },
  unscored: {
    label: "Unscored",
    bg: "bg-muted",
    text: "Make transactions to get scored",
  },
};

function AnimatedNumber({ target }: { target: number }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (target === 0) return;
    const duration = 1200;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(Math.round(increment * step), target);
      setDisplay(current);
      if (step >= steps) clearInterval(timer);
    }, duration / steps);

    return () => clearInterval(timer);
  }, [target]);

  return <span>{display}</span>;
}

export default function CreditScoreCard({
  score,
  tier,
  updatedAt,
  breakdown,
}: CreditScoreCardProps) {
  const config = tierConfig[tier] || tierConfig.unscored;
  const maxScore = 850;
  const pct = Math.round((score / maxScore) * 100);

  return (
    <div className="bg-dark rounded-2xl p-6 text-white shadow-lg">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-white/50 text-xs uppercase tracking-wide font-medium">
            Credit Score
          </p>
          <div className="flex items-end gap-3 mt-1">
            <span className="text-6xl font-bold leading-none tracking-tight">
              <AnimatedNumber target={score} />
            </span>
            <span className="text-white/40 text-sm mb-2">/ 850</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span
            className={`${config.bg} text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide`}
          >
            {config.label}
          </span>
          <TrendingUp size={16} className="text-white/30" />
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="w-full bg-white/10 rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-1000"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex justify-between text-white/30 text-xs mt-1">
          <span>0</span>
          <span>850</span>
        </div>
      </div>

      {/* Explanation */}
      <div className="flex items-start gap-2 bg-white/5 rounded-xl p-3 mb-4">
        <Info size={14} className="text-white/40 mt-0.5 shrink-0" />
        <p className="text-white/60 text-xs leading-relaxed">
          {config.text}. Score updates automatically after every payment
          received through your Squad virtual account.
        </p>
      </div>

      {/* Breakdown signals */}
      {breakdown && (
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Total transactions", value: breakdown.totalTransactions },
            {
              label: "Total volume",
              value: `₦${breakdown.totalVolume.toLocaleString()}`,
            },
            { label: "This week", value: breakdown.weeklyCount + " txns" },
            {
              label: "Weekly volume",
              value: `₦${breakdown.weeklyVolume.toLocaleString()}`,
            },
          ].map((item) => (
            <div key={item.label} className="bg-white/5 rounded-xl p-3">
              <p className="text-white/40 text-xs">{item.label}</p>
              <p className="text-white font-semibold text-sm mt-0.5">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      )}

      {updatedAt && (
        <p className="text-white/25 text-xs mt-3 text-right">
          Updated {new Date(updatedAt).toLocaleTimeString()}
        </p>
      )}
    </div>
  );
}
