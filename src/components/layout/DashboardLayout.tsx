import React from 'react';
import Link from 'next/link';

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userEmail?: string;
}

const NAV = [
  {
    id: 'dashboard',
    label: 'Overview',
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
        <rect x="3" y="3" width="7" height="7" rx="1.5"/>
        <rect x="14" y="3" width="7" height="7" rx="1.5"/>
        <rect x="3" y="14" width="7" height="7" rx="1.5"/>
        <rect x="14" y="14" width="7" height="7" rx="1.5"/>
      </svg>
    ),
  },
  {
    id: 'transactions',
    label: 'Ledger',
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
        <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
        <rect x="9" y="3" width="6" height="4" rx="1"/>
        <line x1="9" y1="12" x2="15" y2="12"/>
        <line x1="9" y1="16" x2="13" y2="16"/>
      </svg>
    ),
  },
  {
    id: 'budget',
    label: 'Budgets',
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
        <path d="M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20z"/>
        <path d="M12 6v6l4 4"/>
      </svg>
    ),
  },
  {
    id: 'parser',
    label: 'Statement Parser',
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
        <path d="M14 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
        <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>
      </svg>
    ),
  },
];

export default function DashboardLayout({ children, activeTab, setActiveTab, userEmail }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#F7F8FA]">
      {/* Sidebar */}
      <aside className="w-[220px] flex-shrink-0 bg-white border-r border-gray-100 flex flex-col h-full">
        {/* Brand */}
        <div className="px-5 h-[56px] flex items-center border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center flex-shrink-0">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
                <path d="M12 6v6l4 2"/>
              </svg>
            </div>
            <span className="text-[15px] font-semibold tracking-tight text-gray-900">Penny</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">
          <p className="px-2 pt-1 pb-2 text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
            Main
          </p>
          {NAV.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-all ${
                activeTab === item.id
                  ? 'bg-indigo-50 text-indigo-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <span className={activeTab === item.id ? 'text-indigo-600' : 'text-gray-400'}>
                {item.icon}
              </span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-100 p-3 flex-shrink-0 space-y-1">
          {userEmail && (
            <div className="px-2.5 py-2 rounded-lg bg-gray-50 mb-1">
              <p className="text-[11px] text-gray-400 leading-none mb-0.5">Signed in as</p>
              <p className="text-xs font-medium text-gray-700 truncate">{userEmail}</p>
            </div>
          )}
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all"
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16,17 21,12 16,7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-8 py-7">
          {children}
        </div>
      </main>
    </div>
  );
}
