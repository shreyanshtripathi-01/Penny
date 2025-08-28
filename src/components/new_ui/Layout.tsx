import { Outlet } from "react-router";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function Layout() {
  return (
    <div
      className="flex h-screen bg-[#f5f5f2] overflow-hidden text-slate-900"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto px-6 py-8 lg:px-10 lg:py-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
