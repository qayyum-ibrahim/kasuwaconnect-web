import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { useAppStore } from "../../store/useAppStore";
import { User, Phone, MapPin, Tag, LogOut, Shield, Star } from "lucide-react";

export default function TraderProfile() {
  const navigate = useNavigate();
  const session = useAuthStore((s) => s.session);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const clearApp = useAppStore((s) => s.clearApp);
  const trader = useAppStore((s) => s.trader);

  const handleLogout = () => {
    clearAuth();
    clearApp();
    navigate("/login", { replace: true });
  };

  const tierConfig: Record<string, { color: string; label: string }> = {
    high: { color: "text-success bg-success/10", label: "High" },
    medium: { color: "text-warning bg-warning/10", label: "Medium" },
    low: { color: "text-primary bg-primary/10", label: "Low" },
    unscored: { color: "text-muted bg-light-gray", label: "Unscored" },
  };
  const tier = tierConfig[trader?.creditTier ?? "unscored"];

  const infoRows = [
    {
      icon: <User size={16} className="text-muted" />,
      label: "Full name",
      value: session?.name ?? "—",
    },
    {
      icon: <Phone size={16} className="text-muted" />,
      label: "Phone number",
      value: session?.phone ?? "—",
    },
    {
      icon: <Tag size={16} className="text-muted" />,
      label: "Trade category",
      value: trader?.tradeCategory
        ? trader.tradeCategory.charAt(0).toUpperCase() +
          trader.tradeCategory.slice(1)
        : "—",
    },
    {
      icon: <MapPin size={16} className="text-muted" />,
      label: "Market location",
      value: trader?.marketLocation ?? "—",
    },
    {
      icon: <MapPin size={16} className="text-muted" />,
      label: "State",
      value: trader?.state ?? "—",
    },
  ];

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h2 className="text-xl font-bold text-dark">Profile</h2>
        <p className="text-text-sub text-sm mt-1">
          Your account details and credit standing
        </p>
      </div>

      {/* Avatar card */}
      <div className="bg-dark rounded-2xl p-6 flex items-center gap-5">
        <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white font-bold text-2xl shrink-0">
          {session?.name?.charAt(0) ?? "T"}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-bold text-lg truncate">
            {session?.name}
          </p>
          <p className="text-white/50 text-sm">{session?.phone}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="bg-primary/20 text-primary text-xs font-bold px-2.5 py-1 rounded-full">
              Trader
            </span>
            {trader?.creditTier && (
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-full ${tier.color}`}
              >
                {tier.label} Credit
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Credit score summary */}
      {trader && (
        <div className="bg-white rounded-2xl border border-border shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <Star size={16} className="text-primary" />
            <h3 className="font-semibold text-dark">Credit Summary</h3>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Score", value: trader.creditScore },
              { label: "Transactions", value: trader.totalTransactions },
              {
                label: "Volume",
                value: `₦${trader.totalVolume.toLocaleString()}`,
              },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <p className="text-2xl font-bold text-dark">{item.value}</p>
                <p className="text-xs text-muted mt-0.5">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Account info */}
      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Shield size={16} className="text-primary" />
            <h3 className="font-semibold text-dark">Account Information</h3>
          </div>
        </div>
        <div className="divide-y divide-border">
          {infoRows.map((row) => (
            <div key={row.label} className="px-6 py-4 flex items-center gap-4">
              <div className="w-8 h-8 bg-light-gray rounded-lg flex items-center justify-center shrink-0">
                {row.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted uppercase tracking-wide">
                  {row.label}
                </p>
                <p className="text-sm font-semibold text-dark truncate mt-0.5">
                  {row.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Squad virtual account */}
      {trader?.squadVirtualAccount?.accountNumber && (
        <div className="bg-white rounded-2xl border border-border shadow-sm p-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
              <span className="text-white text-xs font-bold">S</span>
            </div>
            <h3 className="font-semibold text-dark">Squad Virtual Account</h3>
          </div>
          <p className="text-xs text-muted mb-1">
            {trader.squadVirtualAccount.bankName}
          </p>
          <p className="font-mono text-xl font-bold text-dark tracking-wider">
            {trader.squadVirtualAccount.accountNumber}
          </p>
          <p className="text-xs text-muted mt-1">
            {trader.squadVirtualAccount.accountName}
          </p>
        </div>
      )}

      {/* Sign out */}
      <button
        onClick={handleLogout}
        className="w-full flex items-center justify-center gap-3 h-12 rounded-btn border-2 border-error/30 text-error font-semibold text-sm hover:bg-error/5 transition-all duration-200"
      >
        <LogOut size={16} />
        Sign Out
      </button>
    </div>
  );
}
