import { useState } from "react";
import { Zap, CheckCircle } from "lucide-react";
import { simulatePayment, getTrader } from "../../services/api";
import { useAppStore } from "../../store/useAppStore";
import { toast } from "../ui/Toast";
import type { Trader } from "../../types";

type SimulatePaymentButtonProps = {
  virtualAccountNumber: string;
  traderId: string;
};

type SimState = "idle" | "simulating" | "polling" | "done";

export default function SimulatePaymentButton({
  virtualAccountNumber,
  traderId,
}: SimulatePaymentButtonProps) {
  const setTrader = useAppStore((s) => s.setTrader);
  const currentTrader = useAppStore((s) => s.trader);
  const [state, setState] = useState<SimState>("idle");
  const [newScore, setNewScore] = useState<number | null>(null);

  const handleSimulate = async () => {
    if (state !== "idle") return;
    setState("simulating");

    try {
      // Fire the test payment
      await simulatePayment(virtualAccountNumber, 8000);
      setState("polling");

      // Poll for credit score update (up to 12 seconds)
      const previousScore = currentTrader?.creditScore ?? 0;
      let attempts = 0;
      const maxAttempts = 6;

      const poll = async () => {
        attempts++;
        try {
          const res = await getTrader(traderId);
          const updated = res.data.data as Trader;

          if (
            updated.creditScore !== previousScore ||
            attempts >= maxAttempts
          ) {
            setTrader(updated);
            setNewScore(updated.creditScore);
            setState("done");
            toast.success(
              `Payment received · Credit score updated to ${updated.creditScore}`,
            );
            // Reset after 5 seconds
            setTimeout(() => setState("idle"), 5000);
          } else {
            setTimeout(poll, 2000);
          }
        } catch {
          if (attempts < maxAttempts) {
            setTimeout(poll, 2000);
          } else {
            setState("idle");
            toast.error("Could not confirm score update. Try again.");
          }
        }
      };

      setTimeout(poll, 2000);
    } catch {
      setState("idle");
      toast.error("Payment simulation failed. Check your connection.");
    }
  };

  const stateConfig = {
    idle: {
      bg: "bg-primary hover:bg-primary-dark",
      text: "Simulate Payment  ₦8,000",
      icon: <Zap size={18} />,
    },
    simulating: {
      bg: "bg-primary/80 cursor-not-allowed",
      text: "Firing webhook...",
      icon: (
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ),
    },
    polling: {
      bg: "bg-warning cursor-not-allowed",
      text: "Updating credit score...",
      icon: (
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ),
    },
    done: {
      bg: "bg-success cursor-default",
      text: `Score updated to ${newScore}`,
      icon: <CheckCircle size={18} />,
    },
  };

  const config = stateConfig[state];

  return (
    <div className="space-y-2">
      <button
        onClick={handleSimulate}
        disabled={state !== "idle"}
        className={`
          w-full h-14 rounded-btn font-bold text-white text-base
          flex items-center justify-center gap-3
          transition-all duration-300 shadow-md
          ${config.bg}
        `}
      >
        {config.icon}
        {config.text}
      </button>
      <p className="text-xs text-muted text-center">
        Simulates a customer payment → fires Squad webhook → updates credit
        score live
      </p>
    </div>
  );
}
