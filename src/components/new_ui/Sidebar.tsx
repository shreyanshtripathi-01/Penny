import { LayoutDashboard, ArrowLeftRight, BarChart2, Target, Settings, HelpCircle, LogOut } from "lucide-react";

const navItems = [
  { id: "dashboard", label: "Dashboard" },
  { id: "transactions", label: "Transactions" },
  { id: "budget", label: "Budgets" },
  { id: "parser", label: "Statement Parser" },
];

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userEmail: string;
  userName?: string;
}

export function Sidebar({ activeTab, setActiveTab, userEmail, userName }: SidebarProps) {
  const displayName = userName || userEmail.split('@')[0];
  const firstName = displayName.split(' ')[0];
  const initials = userName 
    ? userName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : userEmail.substring(0, 2).toUpperCase();

  return (
    <aside className="w-[220px] bg-white border-r border-slate-100 hidden md:flex flex-col">
      <div className="px-6 pt-7 pb-5">
        <span className="text-[21px] text-slate-900" style={{ fontWeight: 800, letterSpacing: "-0.03em" }}>
          penny<span className="text-emerald-500">.</span>
        </span>
      </div>

      <div className="px-4 mb-5">
        <div className="flex items-center gap-2.5 px-2 py-2">
          <div
            className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center text-white text-[10px] shrink-0"
            style={{ fontWeight: 700 }}
          >
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-[13px] text-slate-800 truncate leading-tight" style={{ fontWeight: 600 }}>
              {firstName}
            </p>
            <p className="text-[11px] text-slate-400 truncate leading-tight">Personal account</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-0.5">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full text-left px-4 py-2 rounded-md text-[13px] transition-colors ${
                isActive
                  ? "bg-slate-100 text-slate-900"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
              }`}
              style={{ fontWeight: isActive ? 600 : 500 }}
            >
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="px-3 pb-6 pt-4 border-t border-slate-100 space-y-1">
        <button
          onClick={() => setActiveTab('settings')}
          className="w-full text-left px-4 py-2 rounded-md text-[13px] text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors"
          style={{ fontWeight: 500 }}
        >
          Settings
        </button>
        <form action="/auth/signout" method="post" className="w-full">
          <button
            type="submit"
            className="w-full text-left px-4 py-2 rounded-md text-[13px] text-rose-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            style={{ fontWeight: 500 }}
          >
            Sign Out
          </button>
        </form>
      </div>
    </aside>
  );
}
