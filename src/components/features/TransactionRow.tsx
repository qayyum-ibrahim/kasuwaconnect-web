import { ArrowDownLeft } from "lucide-react";
import type { Transaction } from "../../types";

type TransactionRowProps = {
  transaction: Transaction;
};

export default function TransactionRow({ transaction }: TransactionRowProps) {
  const date = new Date(transaction.transactionDate);
  const formatted = date.toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="flex items-center justify-between py-3.5 border-b border-border last:border-0">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-success/10 rounded-xl flex items-center justify-center shrink-0">
          <ArrowDownLeft size={16} className="text-success" />
        </div>
        <div>
          <p className="text-sm font-semibold text-dark">
            {transaction.senderName || "Customer payment"}
          </p>
          <p className="text-xs text-muted">{formatted}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-bold text-success">
          +₦{transaction.amountInNaira.toLocaleString()}
        </p>
        {transaction.isAnomaly && (
          <span className="text-xs text-warning font-medium">⚠ Flagged</span>
        )}
      </div>
    </div>
  );
}
