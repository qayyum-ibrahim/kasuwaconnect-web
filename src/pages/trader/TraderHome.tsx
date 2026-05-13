import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, RefreshCw } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { useAppStore } from "../../store/useAppStore";
import {
  getTrader,
  getTraderSummary,
  getTraderTransactions,
} from "../../services/api";
import type { Trader, Transaction } from "../../types";
import CreditScoreCard from "../../components/features/CreditScoreCard";
import VirtualAccountCard from "../../components/features/VirtualAccountCard";
import TransactionRow from "../../components/features/TransactionRow";
import { CardSkeleton } from "../../components/ui/Skeleton";
import { toast } from "../../components/ui/Toast";

export default function TraderHome() {
  const session = useAuthStore((s) => s.session);
  const trader = useAppStore((s) => s.trader);
  const setTrader = useAppStore((s) => s.setTrader);

  const [summary, setSummary] = useState<any>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(
    async (silent = false) => {
      if (!session?.id) return;
      if (!silent) setLoading(true);
      else setRefreshing(true);

      try {
        const [traderRes, summaryRes, txRes] = await Promise.all([
          getTrader(session.id),
          getTraderSummary(session.id),
          getTraderTransactions(session.id),
        ]);

        setTrader(traderRes.data.data as Trader);
        setSummary(summaryRes.data.data);
        setTransactions(txRes.data.data?.slice(0, 5) ?? []);
      } catch {
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [session?.id, setTrader],
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="space-y-6 max-w-5xl">
        <CardSkeleton />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CardSkeleton />
          <CardSkeleton />
        </div>
        <CardSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Credit score — full width, hero element */}
      {trader && (
        <CreditScoreCard
          score={trader.creditScore}
          tier={trader.creditTier}
          updatedAt={trader.updatedAt}
          breakdown={
            summary
              ? {
                  totalTransactions: trader.totalTransactions,
                  totalVolume: trader.totalVolume,
                  weeklyCount: summary.weekly?.count ?? 0,
                  weeklyVolume: summary.weekly?.volume ?? 0,
                }
              : undefined
          }
        />
      )}

      {/* Second row — virtual account + simulate */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {trader?.squadVirtualAccount?.accountNumber ? (
          <VirtualAccountCard
            accountNumber={trader.squadVirtualAccount.accountNumber}
            bankName={trader.squadVirtualAccount.bankName || "Squad MFB"}
            accountName={
              trader.squadVirtualAccount.accountName || session?.name || ""
            }
          />
        ) : (
          <div className="bg-white rounded-2xl border border-border p-6">
            <p className="text-muted text-sm">Virtual account not set up yet</p>
          </div>
        )}

        {trader?.squadVirtualAccount?.accountNumber ? (
          <div className="bg-white rounded-2xl border border-border p-6 shadow-sm space-y-4">
            <div>
              <p className="text-xs font-medium text-muted uppercase tracking-wide mb-1">
                How Your Score Updates
              </p>
              <h3 className="text-base font-semibold text-dark">
                Live Credit Scoring
              </h3>
              <p className="text-text-sub text-xs mt-1">
                Every payment you make to workers automatically updates your
                credit score
              </p>
            </div>
            <div className="space-y-2">
              {[
                { step: "1", text: "Pay a worker via the Employer tab" },
                { step: "2", text: "Squad Transfer processes the wage" },
                { step: "3", text: "AI model recalculates your score" },
                { step: "4", text: "Dashboard updates automatically" },
              ].map((item) => (
                <div key={item.step} className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-primary">
                      {item.step}
                    </span>
                  </div>
                  <p className="text-xs text-text-sub">{item.text}</p>
                </div>
              ))}
            </div>
            <div
              className="w-full h-10 bg-primary/5 border border-primary/20 rounded-btn flex items-center justify-center gap-2 cursor-pointer hover:bg-primary/10 transition-all"
              onClick={() => (window.location.href = "/trader/employer")}
            >
              <span className="text-sm font-semibold text-primary">
                Go to Employer Tab →
              </span>
            </div>
          </div>
        ) : (
          <p className="text-muted text-sm">No virtual account available</p>
        )}
      </div>

      {/* Stats row */}
      {summary && (
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              label: "Total Transactions",
              value: trader?.totalTransactions ?? 0,
              sub: "All time",
            },
            {
              label: "Total Volume",
              value: `₦${(trader?.totalVolume ?? 0).toLocaleString()}`,
              sub: "All time",
            },
            {
              label: "This Week",
              value: `₦${(summary.weekly?.volume ?? 0).toLocaleString()}`,
              sub: `${summary.weekly?.count ?? 0} transactions`,
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-2xl border border-border p-5 shadow-sm"
            >
              <p className="text-xs font-medium text-muted uppercase tracking-wide">
                {stat.label}
              </p>
              <p className="text-2xl font-bold text-dark mt-1">{stat.value}</p>
              <p className="text-xs text-text-sub mt-0.5">{stat.sub}</p>
            </div>
          ))}
        </div>
      )}

      {/* Recent transactions */}
      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h3 className="font-semibold text-dark">Recent Transactions</h3>
          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchData(true)}
              disabled={refreshing}
              className="text-muted hover:text-primary transition-colors disabled:opacity-50"
              title="Refresh"
            >
              <RefreshCw
                size={15}
                className={refreshing ? "animate-spin" : ""}
              />
            </button>
            <Link
              to="/trader/payments"
              className="text-xs font-semibold text-primary hover:text-primary-dark flex items-center gap-1 transition-colors"
            >
              View all <ArrowRight size={13} />
            </Link>
          </div>
        </div>

        <div className="px-6">
          {transactions.length > 0 ? (
            transactions.map((tx) => (
              <TransactionRow key={tx._id} transaction={tx} />
            ))
          ) : (
            <div className="py-10 text-center">
              <p className="text-3xl mb-2">💸</p>
              <p className="text-text-sub text-sm font-medium">
                No transactions yet
              </p>
              <p className="text-muted text-xs mt-1">
                Use "Simulate Payment" above to see how it works
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
