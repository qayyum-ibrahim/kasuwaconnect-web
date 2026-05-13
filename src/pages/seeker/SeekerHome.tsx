import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { useAppStore } from "../../store/useAppStore";
import { getJobSeeker, getSeekerEarnings } from "../../services/api";
import type { JobSeeker, Transaction } from "../../types";
import VirtualAccountCard from "../../components/features/VirtualAccountCard";
import TransactionRow from "../../components/features/TransactionRow";
import { CardSkeleton } from "../../components/ui/Skeleton";
import { toast } from "../../components/ui/Toast";

export default function SeekerHome() {
  const session = useAuthStore((s) => s.session);
  const seeker = useAppStore((s) => s.seeker);
  const setSeeker = useAppStore((s) => s.setSeeker);

  const [earnings, setEarnings] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [_summary, setSummary] = useState<any>(null);

  const fetchData = useCallback(async () => {
    if (!session?.id) return;
    setLoading(true);
    try {
      const [seekerRes, earningsRes] = await Promise.all([
        getJobSeeker(session.id),
        getSeekerEarnings(session.id),
      ]);
      setSeeker(seekerRes.data.data as JobSeeker);
      setSummary(earningsRes.data.seeker);
      setEarnings(earningsRes.data.data?.slice(0, 5) ?? []);
    } catch {
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }, [session?.id, setSeeker]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="space-y-6 max-w-4xl">
        <CardSkeleton />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            label: "Total Earnings",
            value: `₦${(seeker?.totalEarnings ?? 0).toLocaleString()}`,
            sub: "All time",
            color: "text-success",
          },
          {
            label: "Completed Gigs",
            value: seeker?.completedGigs ?? 0,
            sub: "Jobs finished",
            color: "text-dark",
          },
          {
            label: "Status",
            value: seeker?.isAvailable ? "Available" : "Unavailable",
            sub: seeker?.isAvailable ? "Open to new gigs" : "Currently working",
            color: seeker?.isAvailable ? "text-success" : "text-warning",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl border border-border p-5 shadow-sm"
          >
            <p className="text-xs font-medium text-muted uppercase tracking-wide">
              {stat.label}
            </p>
            <p className={`text-2xl font-bold mt-1 ${stat.color}`}>
              {stat.value}
            </p>
            <p className="text-xs text-text-sub mt-0.5">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Virtual account */}
      {seeker?.squadVirtualAccount?.accountNumber ? (
        <VirtualAccountCard
          accountNumber={seeker.squadVirtualAccount.accountNumber}
          bankName={seeker.squadVirtualAccount.bankName || "Squad MFB"}
          accountName={
            seeker.squadVirtualAccount.accountName || session?.name || ""
          }
        />
      ) : null}

      {/* CTA to jobs */}
      <div className="bg-dark rounded-2xl p-6 flex items-center justify-between">
        <div>
          <p className="text-white font-bold text-lg">Find your next gig</p>
          <p className="text-white/60 text-sm mt-1">
            Browse jobs matched to your skills using AI
          </p>
        </div>
        <Link
          to="/seeker/jobs"
          className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold text-sm px-5 py-3 rounded-btn transition-all duration-200 shrink-0"
        >
          View Jobs <ArrowRight size={15} />
        </Link>
      </div>

      {/* Earnings history */}
      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h3 className="font-semibold text-dark">Recent Earnings</h3>
        </div>
        <div className="px-6">
          {earnings.length > 0 ? (
            earnings.map((tx) => (
              <TransactionRow key={tx._id} transaction={tx} />
            ))
          ) : (
            <div className="py-10 text-center">
              <p className="text-3xl mb-2">💰</p>
              <p className="text-text-sub text-sm font-medium">
                No earnings yet
              </p>
              <p className="text-muted text-xs mt-1">
                Apply for jobs to start earning
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
