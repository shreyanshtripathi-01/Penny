import { Bell, Menu, Search } from "lucide-react";

interface TopbarProps {
  userEmail: string;
  userName?: string;
}

export function Topbar({ userEmail, userName }: TopbarProps) {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const initials = userName 
    ? userName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : userEmail.substring(0, 2).toUpperCase();

  return (
    <header className="h-14 bg-[#f5f5f2] border-b border-slate-200/60 flex items-center justify-between px-6 lg:px-10 shrink-0">
      <div className="flex items-center gap-3">
        <button className="p-1.5 text-slate-400 hover:text-slate-700 md:hidden">
          <Menu className="w-5 h-5" />
        </button>
        <p className="text-[13px] text-slate-400 hidden sm:block" style={{ fontWeight: 500 }}>
          {today}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <div
          className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center text-white text-[10px] cursor-pointer ml-1"
          style={{ fontWeight: 700 }}
        >
          {initials}
        </div>
      </div>
    </header>
  );
}
