import React from 'react';
import { 
  LayoutDashboard, 
  Receipt, 
  PieChart, 
  Sparkles,
  Settings, 
  LogOut,
  Wallet
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function DashboardLayout({ children, activeTab, setActiveTab }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen bg-[#090D16] text-gray-100 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-[#111726] border-r border-[#1F293D] flex flex-col z-20">
        <div className="h-16 flex items-center px-6 border-b border-[#1F293D]">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-lg shadow-lg shadow-indigo-500/20">
              <Wallet className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Penny.ai
            </span>
          </div>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5">
          <NavItem 
            icon={<LayoutDashboard size={18} />} 
            label="Dashboard" 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')} 
          />
          <NavItem 
            icon={<Receipt size={18} />} 
            label="Ledger" 
            active={activeTab === 'transactions'} 
            onClick={() => setActiveTab('transactions')} 
          />
          <NavItem 
            icon={<PieChart size={18} />} 
            label="Budgets" 
            active={activeTab === 'budget'} 
            onClick={() => setActiveTab('budget')} 
          />
          <NavItem 
            icon={<Sparkles size={18} />} 
            label="AI Statement Parser" 
            active={activeTab === 'parser'} 
            onClick={() => setActiveTab('parser')} 
          />
        </nav>
        
        <div className="p-4 border-t border-[#1F293D] bg-[#0E1320]/50">
          <NavItem 
            icon={<Settings size={18} />} 
            label="Settings" 
            active={activeTab === 'settings'} 
            onClick={() => setActiveTab('settings')} 
          />
          <button className="w-full mt-2 flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-rose-400 hover:bg-rose-500/10 transition-all duration-200">
            <LogOut size={18} className="mr-3 flex-shrink-0" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative bg-[#090D16]">
        {/* Ambient background glows */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[150px] pointer-events-none"></div>
        
        <div className="p-8 max-w-6xl mx-auto z-10 relative">
          {children}
        </div>
      </main>
    </div>
  );
}

function NavItem({ 
  icon, 
  label, 
  active = false,
  onClick
}: { 
  icon: React.ReactNode; 
  label: string; 
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
        active 
          ? 'bg-gradient-to-r from-indigo-600/10 to-violet-600/5 text-white border-l-2 border-indigo-500 shadow-md shadow-indigo-950/20' 
          : 'text-gray-400 hover:text-gray-200 hover:bg-[#161F33]/50'
      }`}
    >
      <span className={`mr-3 flex-shrink-0 transition-colors duration-200 ${active ? 'text-indigo-400' : 'text-gray-400'}`}>
        {icon}
      </span>
      {label}
    </button>
  );
}
