import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  CreditCard,
  Briefcase,
  User,
  LogOut,
  Wallet,
} from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { useAppStore } from "../../store/useAppStore";

type NavItem = {
  label: string;
  path: string;
  icon: React.ReactNode;
};

type SidebarProps = {
  role: "trader" | "seeker";
};

const traderNav: NavItem[] = [
  { label: "Dashboard", path: "/trader", icon: <LayoutDashboard size={18} /> },
  {
    label: "Payments",
    path: "/trader/payments",
    icon: <CreditCard size={18} />,
  },
  {
    label: "Employer",
    path: "/trader/employer",
    icon: <Briefcase size={18} />,
  },
  { label: "Profile", path: "/trader/profile", icon: <User size={18} /> },
];

const seekerNav: NavItem[] = [
  { label: "Dashboard", path: "/seeker", icon: <LayoutDashboard size={18} /> },
  { label: "Jobs", path: "/seeker/jobs", icon: <Briefcase size={18} /> },
  { label: "Profile", path: "/seeker/profile", icon: <User size={18} /> },
];

export default function Sidebar({ role }: SidebarProps) {
  const navigate = useNavigate();
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const clearApp = useAppStore((s) => s.clearApp);
  const session = useAuthStore((s) => s.session);
  const navItems = role === "trader" ? traderNav : seekerNav;

  const handleLogout = () => {
    clearAuth();
    clearApp();
    navigate("/login", { replace: true });
  };

  return (
    <aside className="w-60 min-h-screen bg-dark flex flex-col shrink-0">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shrink-0">
            <Wallet size={16} className="text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight">
              KasuwaConnect
            </p>
            <p className="text-white/40 text-xs capitalize">{role}</p>
          </div>
        </div>
      </div>

      {/* User pill */}
      <div className="px-4 py-4 border-b border-white/10">
        <div className="bg-white/5 rounded-xl px-4 py-3">
          <p className="text-white/50 text-xs uppercase tracking-wide mb-0.5">
            Logged in as
          </p>
          <p className="text-white font-semibold text-sm truncate">
            {session?.name}
          </p>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/trader" || item.path === "/seeker"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-primary text-white shadow-sm"
                  : "text-white/60 hover:text-white hover:bg-white/8"
              }`
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-6">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/40 hover:text-white hover:bg-white/8 transition-all duration-200"
        >
          <LogOut size={18} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
