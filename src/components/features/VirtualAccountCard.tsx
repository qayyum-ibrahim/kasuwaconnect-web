import { useState } from "react";
import { Copy, CheckCheck, Building2 } from "lucide-react";

type VirtualAccountCardProps = {
  accountNumber: string;
  bankName:      string;
  accountName:   string;
};

export default function VirtualAccountCard({
  accountNumber,
  bankName,
  accountName,
}: VirtualAccountCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
          <Building2 size={16} className="text-primary" />
        </div>
        <div>
          <p className="text-xs font-medium text-muted uppercase tracking-wide">
            Squad Virtual Account
          </p>
          <p className="text-xs text-text-sub">{bankName}</p>
        </div>
      </div>

      <p className="text-xs text-text-sub mb-1">{accountName}</p>

      <div className="flex items-center justify-between bg-offwhite rounded-xl px-4 py-3 border border-border">
        <span className="font-mono text-xl font-bold text-dark tracking-wider">
          {accountNumber}
        </span>
        <button
          onClick={handleCopy}
          className={`
            flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-200
            ${copied
              ? "bg-success/10 text-success"
              : "bg-primary/10 text-primary hover:bg-primary hover:text-white"
            }
          `}
        >
          {copied
            ? <><CheckCheck size={13} /> Copied!</>
            : <><Copy size={13} /> Copy</>
          }
        </button>
      </div>

      <p className="text-xs text-muted mt-3 text-center">
        Share this account number to receive payments via Squad
      </p>
    </div>
  );
}