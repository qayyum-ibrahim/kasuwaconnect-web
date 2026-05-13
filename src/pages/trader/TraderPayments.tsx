import { useEffect, useState, useCallback } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { getTraderTransactions } from "../../services/api";
import type { Transaction } from "../../types";
import TransactionRow from "../../components/features/TransactionRow";
import { CardSkeleton } from "../../components/ui/Skeleton";
import { toast } from "../../components/ui/Toast";
import { ArrowDownLeft } from "lucide-react";

export default function TraderPayments() {
  const session = useAuthStore((s) => s.session);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchTransactions = useCallback(
    async (p = 1) => {
      if (!session?.id) return;
      setLoading(true);
      try {
        const res = await getTraderTransactions(session.id, p);
        const data = res.data;
        setTransactions(data.data ?? []);
        setSummary(data.summary);
        setTotalPages(data.pagination?.totalPages ?? 1);
        setPage(p);
      } catch {
        toast.error("Failed to load transactions");
      } finally {
        setLoading(false);
      }
    },
    [session?.id],
  );

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="text-xl font-bold text-dark">Payments</h2>
        <p className="text-text-sub text-sm mt-1">
          All incoming payments to your Squad virtual account
        </p>
      </div>

      {/* Summary cards */}
      {summary && (
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              label: "Total Volume",
              value: `₦${summary.totalVolume?.toLocaleString() ?? 0}`,
            },
            { label: "Total Transactions", value: summary.totalCount ?? 0 },
            {
              label: "Average Amount",
              value: `₦${summary.avgAmount?.toLocaleString() ?? 0}`,
            },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-white rounded-2xl border border-border p-5 shadow-sm"
            >
              <p className="text-xs text-muted uppercase tracking-wide">
                {s.label}
              </p>
              <p className="text-xl font-bold text-dark mt-1">{s.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Transaction list */}
      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center gap-2">
          <ArrowDownLeft size={16} className="text-success" />
          <h3 className="font-semibold text-dark">Transaction History</h3>
        </div>

        {loading ? (
          <div className="p-6 space-y-3">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : transactions.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-4xl mb-3">💸</p>
            <p className="font-semibold text-dark">No transactions yet</p>
            <p className="text-text-sub text-sm mt-1">
              Go to your dashboard and use "Simulate Payment" to see how it
              works
            </p>
          </div>
        ) : (
          <div className="px-6">
            {transactions.map((tx) => (
              <TransactionRow key={tx._id} transaction={tx} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-border flex items-center justify-between">
            <button
              onClick={() => fetchTransactions(page - 1)}
              disabled={page <= 1 || loading}
              className="text-sm font-medium text-primary disabled:text-muted disabled:cursor-not-allowed hover:underline"
            >
              ← Previous
            </button>
            <span className="text-xs text-muted">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => fetchTransactions(page + 1)}
              disabled={page >= totalPages || loading}
              className="text-sm font-medium text-primary disabled:text-muted disabled:cursor-not-allowed hover:underline"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
