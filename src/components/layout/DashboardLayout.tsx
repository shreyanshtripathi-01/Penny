import React from 'react';
import { 
  LayoutDashboard, 
  Receipt, 
  PieChart, 
  Settings, 
  LogOut,
  Wallet
} from 'lucide-react';
import Link from 'next/link';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen bg-gray-50 text-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <Wallet className="h-6 w-6 text-blue-600 mr-2" />
          <span className="text-xl font-bold tracking-tight">Penny</span>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <NavItem href="/" icon={<LayoutDashboard size={20} />} label="Dashboard" active />
          <NavItem href="/transactions" icon={<Receipt size={20} />} label="Transactions" />
          <NavItem href="/budget" icon={<PieChart size={20} />} label="Budget" />
        </nav>
        
        <div className="p-4 border-t border-gray-200">
          <NavItem href="/settings" icon={<Settings size={20} />} label="Settings" />
          <button className="w-full mt-1 flex items-center px-3 py-2 text-sm font-medium rounded-md text-red-600 hover:bg-red-50 transition-colors">
            <LogOut size={20} className="mr-3 flex-shrink-0" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

function NavItem({ 
  href, 
  icon, 
  label, 
  active = false 
}: { 
  href: string; 
  icon: React.ReactNode; 
  label: string; 
  active?: boolean;
}) {
  return (
    <Link 
      href={href}
      className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
        active 
          ? 'bg-blue-50 text-blue-700' 
          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
      }`}
    >
      <span className={`mr-3 flex-shrink-0 ${active ? 'text-blue-700' : 'text-gray-400'}`}>
        {icon}
      </span>
      {label}
    </Link>
  );
}
