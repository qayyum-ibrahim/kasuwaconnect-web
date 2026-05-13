import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { useAppStore } from "../../store/useAppStore";
import {
  User,
  Phone,
  MapPin,
  LogOut,
  Briefcase,
  Languages,
} from "lucide-react";

export default function SeekerProfile() {
  const navigate = useNavigate();
  const session = useAuthStore((s) => s.session);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const clearApp = useAppStore((s) => s.clearApp);
  const seeker = useAppStore((s) => s.seeker);

  const handleLogout = () => {
    clearAuth();
    clearApp();
    navigate("/login", { replace: true });
  };

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h2 className="text-xl font-bold text-dark">Profile</h2>
        <p className="text-text-sub text-sm mt-1">
          Your account details and work preferences
        </p>
      </div>

      {/* Avatar card */}
      <div className="bg-dark rounded-2xl p-6 flex items-center gap-5">
        <div className="w-16 h-16 bg-dark border-2 border-primary rounded-2xl flex items-center justify-center text-white font-bold text-2xl shrink-0">
          {session?.name?.charAt(0) ?? "S"}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-bold text-lg truncate">
            {session?.name}
          </p>
          <p className="text-white/50 text-sm">{session?.phone}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="bg-white/10 text-white text-xs font-bold px-2.5 py-1 rounded-full">
              Job Seeker
            </span>
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                seeker?.isAvailable
                  ? "bg-success/20 text-success"
                  : "bg-muted/20 text-muted"
              }`}
            >
              {seeker?.isAvailable ? "Available" : "Unavailable"}
            </span>
          </div>
        </div>
      </div>

      {/* Stats */}
      {seeker && (
        <div className="grid grid-cols-2 gap-4">
          {[
            {
              label: "Total Earnings",
              value: `₦${seeker.totalEarnings.toLocaleString()}`,
              color: "text-success",
            },
            {
              label: "Completed Gigs",
              value: seeker.completedGigs,
              color: "text-dark",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-2xl border border-border p-5 shadow-sm text-center"
            >
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-muted mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Personal info */}
      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h3 className="font-semibold text-dark flex items-center gap-2">
            <User size={16} className="text-primary" />
            Account Information
          </h3>
        </div>
        <div className="divide-y divide-border">
          {[
            {
              label: "Full name",
              value: session?.name,
              icon: <User size={15} className="text-muted" />,
            },
            {
              label: "Phone",
              value: session?.phone,
              icon: <Phone size={15} className="text-muted" />,
            },
            {
              label: "State",
              value: seeker?.state,
              icon: <MapPin size={15} className="text-muted" />,
            },
            {
              label: "Location",
              value: seeker?.marketLocation,
              icon: <MapPin size={15} className="text-muted" />,
            },
            {
              label: "Experience",
              value: seeker?.experienceLevel,
              icon: <Briefcase size={15} className="text-muted" />,
            },
          ].map((row) => (
            <div key={row.label} className="px-6 py-4 flex items-center gap-4">
              <div className="w-8 h-8 bg-light-gray rounded-lg flex items-center justify-center shrink-0">
                {row.icon}
              </div>
              <div>
                <p className="text-xs text-muted uppercase tracking-wide">
                  {row.label}
                </p>
                <p className="text-sm font-semibold text-dark mt-0.5 capitalize">
                  {row.value ?? "—"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Skills */}
      {seeker?.skills && seeker.skills.length > 0 && (
        <div className="bg-white rounded-2xl border border-border shadow-sm p-6">
          <h3 className="font-semibold text-dark mb-3 flex items-center gap-2">
            <Briefcase size={16} className="text-primary" />
            Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {seeker.skills.map((sk) => (
              <span
                key={sk}
                className="text-xs bg-primary/10 text-primary font-semibold px-3 py-1.5 rounded-full"
              >
                {sk}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Languages */}
      {seeker?.languages && seeker.languages.length > 0 && (
        <div className="bg-white rounded-2xl border border-border shadow-sm p-6">
          <h3 className="font-semibold text-dark mb-3 flex items-center gap-2">
            <Languages size={16} className="text-primary" />
            Languages
          </h3>
          <div className="flex flex-wrap gap-2">
            {seeker.languages.map((lang) => (
              <span
                key={lang}
                className="text-xs bg-dark/5 text-dark font-semibold px-3 py-1.5 rounded-full capitalize"
              >
                {lang}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Squad virtual account */}
      {seeker?.squadVirtualAccount?.accountNumber && (
        <div className="bg-white rounded-2xl border border-border shadow-sm p-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
              <span className="text-white text-xs font-bold">S</span>
            </div>
            <h3 className="font-semibold text-dark">Squad Virtual Account</h3>
          </div>
          <p className="text-xs text-muted mb-1">
            {seeker.squadVirtualAccount.bankName}
          </p>
          <p className="font-mono text-xl font-bold text-dark tracking-wider">
            {seeker.squadVirtualAccount.accountNumber}
          </p>
          <p className="text-xs text-muted mt-1">
            Wages from employers are paid to this account
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
