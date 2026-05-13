import { Outlet } from "react-router-dom";
import Sidebar from "../../components/layout/Sidebar";
import TopBar  from "../../components/layout/TopBar";
import { useAuthStore } from "../../store/useAuthStore";

export default function SeekerLayout() {
  const session = useAuthStore((s) => s.session);

  return (
    <div className="flex min-h-screen bg-offwhite">
      <Sidebar role="seeker" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar
          title={session?.name ?? "Job Seeker"}
          subtitle="KasuwaConnect Job Seeker Dashboard"
        />
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}