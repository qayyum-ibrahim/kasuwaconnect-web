import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import { ToastContainer, useToastManager } from "./components/ui/Toast";

// Auth pages
import LoginPage from "./pages/auth/LoginPage";
import ModeSelectPage from "./pages/auth/ModeSelectPage";
import RegisterTrader from "./pages/auth/RegisterTrader";
import RegisterSeeker from "./pages/auth/RegisterSeeker";

// Trader pages
import TraderLayout from "./pages/trader/TraderLayout";
import TraderHome from "./pages/trader/TraderHome";
import TraderPayments from "./pages/trader/TraderPayments";
import TraderEmployer from "./pages/trader/TraderEmployer";
import TraderProfile from "./pages/trader/TraderProfile";

// Seeker pages
import SeekerLayout from "./pages/seeker/SeekerLayout";
import SeekerHome from "./pages/seeker/SeekerHome";
import SeekerJobs from "./pages/seeker/SeekerJobs";
import SeekerProfile from "./pages/seeker/SeekerProfile";

// Protected route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const session = useAuthStore((s) => s.session);
  if (!session) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

// Root redirect based on role
function RootRedirect() {
  const session = useAuthStore((s) => s.session);
  if (!session) return <Navigate to="/login" replace />;
  if (session.role === "trader") return <Navigate to="/trader" replace />;
  return <Navigate to="/seeker" replace />;
}

export default function App() {
  const { initAuth, isLoading } = useAuthStore();
  const { toasts, removeToast } = useToastManager();

  // Replace the existing silent fetch line with this
  useEffect(() => {
    initAuth();
    // Wake both Render services on app load
    fetch("https://kasuwaconnect-backend.onrender.com/health").catch(() => {});
    fetch("https://kasuwaconnect-ai.onrender.com/health").catch(() => {});
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-offwhite flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-text-sub text-sm">Loading KasuwaConnect...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <BrowserRouter>
        <Routes>
          {/* Root */}
          <Route path="/" element={<RootRedirect />} />

          {/* Auth */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/mode-select" element={<ModeSelectPage />} />
          <Route path="/register/trader" element={<RegisterTrader />} />
          <Route path="/register/seeker" element={<RegisterSeeker />} />

          {/* Trader dashboard */}
          <Route
            path="/trader"
            element={
              <ProtectedRoute>
                <TraderLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<TraderHome />} />
            <Route path="payments" element={<TraderPayments />} />
            <Route path="employer" element={<TraderEmployer />} />
            <Route path="profile" element={<TraderProfile />} />
          </Route>

          {/* Seeker dashboard */}
          <Route
            path="/seeker"
            element={
              <ProtectedRoute>
                <SeekerLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<SeekerHome />} />
            <Route path="jobs" element={<SeekerJobs />} />
            <Route path="profile" element={<SeekerProfile />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
