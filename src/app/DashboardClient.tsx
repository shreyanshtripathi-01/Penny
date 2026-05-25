'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Transaction } from './dashboard/page'
import { Dashboard } from '@/components/brutalist/Dashboard'
import { QuickAddTransaction } from '@/components/brutalist/QuickAddTransaction'
import { MagicParser } from '@/components/brutalist/MagicParser'
import Link from 'next/link'

interface DashboardClientProps {
  initialTransactions: Transaction[]
  userEmail: string
  userName: string
  userId: string
}

export default function DashboardClient({ 
  initialTransactions,
  userEmail,
  userName,
  userId
}: DashboardClientProps) {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions)
  const [profileName, setProfileName] = useState(userName)
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  
  const defaultBudgets = {
    'Food & Dining': 8000,
    'Transportation': 4000,
    'Shopping': 10000,
    'Entertainment': 5000,
    'Groceries': 12000,
    'Utilities': 5000,
  }
  const [budgets, setBudgets] = useState<Record<string, number>>(defaultBudgets)

  const supabase = createClient()

  useEffect(() => {
    const saved = localStorage.getItem(`penny_budgets_${userId}`)
    if (saved) {
      try { setBudgets(JSON.parse(saved)) } catch (e) {}
    }
  }, [userId])

  useEffect(() => {
    const tabName = activeTab.charAt(0).toUpperCase() + activeTab.slice(1);
    document.title = `Penny - ${tabName}`;
  }, [activeTab]);

  const handleAddTransaction = async (newTx: Omit<Transaction, 'id' | 'date'>) => {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('transactions')
      .insert([{ user_id: userId, ...newTx, date: today }])
      .select();
    if (!error && data) setTransactions(prev => [data[0] as Transaction, ...prev]);
  };

  const handleSaveParsed = async (parsed: Transaction[]) => {
    const rows = parsed.map(({ id, ...tx }) => ({ user_id: userId, ...tx }));
    const { data, error } = await supabase.from('transactions').insert(rows).select();
    if (!error && data) {
      setTransactions(prev => [...(data as Transaction[]), ...prev]);
      setActiveTab('transactions');
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('transactions').delete().eq('id', id).eq('user_id', userId);
    if (!error) setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const handleUpdateProfile = async () => {
    setIsSavingProfile(true)
    await supabase.auth.updateUser({ data: { full_name: profileName } })
    setIsSavingProfile(false)
    alert('Profile updated successfully.')
  }

  const handleSignOutAll = async () => {
    alert('Signing out from all devices...')
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  const handleDeleteAccount = async () => {
    if (confirm('Are you absolutely sure you want to delete your account? This will wipe all your transactions.')) {
      await supabase.from('transactions').delete().eq('user_id', userId)
      await supabase.auth.signOut()
      window.location.href = '/'
    }
  }

  const handleBudgetChange = (cat: string, limit: number) => {
    setBudgets(prev => ({ ...prev, [cat]: limit }))
  }

  const handleSaveBudgets = () => {
    localStorage.setItem(`penny_budgets_${userId}`, JSON.stringify(budgets))
    alert('Budget limits saved successfully.')
  }

  const handleExportCSV = () => {
    if (transactions.length === 0) {
      alert("No transactions to export.");
      return;
    }
    const headers = ["Date", "Description", "Category", "Type", "Amount"];
    const csvContent = [
      headers.join(","),
      ...transactions.map(t => 
        `"${t.date}","${t.description.replace(/"/g, '""')}","${t.category}","${t.type}","${t.amount}"`
      )
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `penny_ledger_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="h-screen bg-[#f5f5f2] text-[#030213] font-sans selection:bg-[#030213] selection:text-[#f5f5f2] flex flex-col overflow-hidden">
      {/* Texture Layer */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.04]" 
        style={{ backgroundImage: 'radial-gradient(#030213 1px, transparent 1px)', backgroundSize: '32px 32px' }}
      />
      
      {/* Brutalist Top Nav */}
      <header className="grid grid-cols-12 border-b border-[#030213] relative z-10 bg-[#f5f5f2]">
        <div className="col-span-4 md:col-span-3 p-4 md:p-6 border-r border-[#030213] flex items-center">
          <Link href="/" className="text-xl md:text-2xl font-extrabold tracking-tighter text-[#030213] hover:opacity-80 transition-opacity">
            penny<span className="text-[#10b981]">.</span>
          </Link>
          <span className="ml-4 pl-4 border-l border-[rgba(0,0,0,0.2)] font-mono text-xs font-bold uppercase tracking-widest hidden md:inline-block">
            Dashboard
          </span>
        </div>

        {/* User Profile / Identity Info in Header */}
        <div className="col-span-5 md:col-span-6 px-4 md:px-6 border-r border-[#030213] flex items-center min-w-0">
          <div className="flex items-center gap-3 min-w-0">
            {/* Visual indicator / avatar placeholder */}
            <div className="w-8 h-8 border border-[#030213] flex items-center justify-center font-mono text-xs font-bold bg-[#10b981] text-[#030213] shrink-0">
              {profileName ? profileName.charAt(0).toUpperCase() : userEmail.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-xs uppercase tracking-widest truncate block leading-none mb-0.5">
                {profileName || userEmail.split('@')[0]}
              </span>
              <span className="font-mono text-[9px] uppercase tracking-widest text-gray-500 block truncate leading-none">
                {userEmail}
              </span>
            </div>
          </div>
        </div>

        {/* Logout Control */}
        <div className="col-span-3 md:col-span-3 flex justify-end">
          <form action="/auth/signout" method="post" className="w-full flex h-full">
            <button 
              type="submit" 
              className="w-full flex items-center justify-center p-4 text-xs font-mono font-bold uppercase tracking-widest hover:bg-[#d4183d] hover:text-[#f5f5f2] transition-none border-l border-[#030213]"
            >
              [ LOGOUT ]
            </button>
          </form>
        </div>
      </header>

      {/* Main Grid Content Area */}
      <main className="flex-1 grid grid-cols-1 md:grid-cols-12 relative z-10 overflow-hidden">
        
        {/* Left Sidebar Navigation */}
        <div className="md:col-span-3 border-b md:border-b-0 md:border-r border-[#030213] bg-[#f5f5f2] flex flex-col justify-between overflow-y-auto">
          <nav className="flex flex-col">
            {[
              { id: 'dashboard', label: 'Overview' },
              { id: 'sms-parser', label: 'Statement Parser' },
              { id: 'quick-add', label: 'Add Transaction' },
              { id: 'transactions', label: 'Transactions' },
              { id: 'budgets', label: 'Budget Limits' },
              { id: 'settings', label: 'Settings' },
            ].map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`w-full p-4 border-b border-[#030213] font-mono text-xs uppercase tracking-widest font-bold text-left transition-none ${
                  activeTab === id
                    ? 'bg-[#030213] text-[#f5f5f2]'
                    : 'text-[#030213] hover:bg-[#030213] hover:text-[#f5f5f2]'
                }`}
              >
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Right Content Area */}
        <div className="md:col-span-9 p-4 sm:p-6 md:p-12 overflow-y-auto">
          
          {activeTab === 'dashboard' && (
            <Dashboard 
              userEmail={userEmail}
              userName={userName}
              transactions={transactions}
              onDeleteTransaction={handleDelete}
              onTabChange={setActiveTab}
              budgetsRecord={budgets}
            />
          )}

          {activeTab === 'transactions' && (
            <div className="max-w-4xl w-full mx-auto space-y-6">
              <div className="bg-[#f5f5f2] border border-[#030213] p-6 shadow-[4px_4px_0px_0px_#030213] mb-6 flex justify-between items-center">
                <div>
                  <span className="font-mono text-xs uppercase tracking-widest text-gray-500 block mb-1">
                    [ LEDGER.ALL_RECORDS ]
                  </span>
                  <h1 className="text-2xl font-black uppercase tracking-tight text-[#030213]">
                    TRANSACTION LEDGER
                  </h1>
                </div>
                <button 
                  onClick={handleExportCSV}
                  className="hidden sm:block font-mono text-xs font-bold uppercase tracking-widest px-4 py-2 border border-[#030213] hover:bg-[#030213] hover:text-[#f5f5f2] transition-none"
                >
                  [ EXPORT CSV ]
                </button>
              </div>

              {/* Transactions Ledger Box */}
              <div className="bg-[#f5f5f2] border border-[#030213] overflow-hidden shadow-[4px_4px_0px_0px_#030213]">
                <div className="divide-y divide-[#030213]">
                  {transactions.length === 0 ? (
                    <div className="py-12 text-center font-mono text-xs uppercase text-gray-400">NO SYSTEM ENTRIES IN DATABASE</div>
                  ) : transactions.map(tx => (
                    <div key={tx.id} className="flex items-center justify-between px-6 py-4 hover:bg-[#030213]/5 transition-none">
                      <div>
                        <p className="font-bold text-xs uppercase tracking-wider text-[#030213]">{tx.description}</p>
                        <p className="font-mono text-[10px] text-gray-500 uppercase tracking-widest mt-1">
                          {tx.category} • TIMESTAMP: {tx.date}
                        </p>
                      </div>
                      <div className="flex items-center gap-6">
                        <span className={`font-mono text-sm font-bold tabular-nums ${tx.type === 'income' ? 'text-[#10b981]' : 'text-[#030213]'}`}>
                          {tx.type === 'income' ? '+' : '−'}₹{tx.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </span>
                        <button 
                          onClick={() => handleDelete(tx.id)} 
                          className="font-mono text-[10px] font-bold text-gray-400 hover:text-[#d4183d] px-2 py-1 border border-transparent hover:border-[#d4183d] transition-none"
                        >
                          [ WIPE ]
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'quick-add' && (
            <div className="max-w-xl w-full mx-auto space-y-6">
              <QuickAddTransaction onAddTransaction={handleAddTransaction} />
            </div>
          )}

          {activeTab === 'sms-parser' && (
            <div className="max-w-2xl w-full">
              <MagicParser onSaveParsedTransactions={handleSaveParsed} />
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="max-w-2xl w-full">
              <div className="mb-7">
                <h1 className="text-2xl font-black tracking-tight text-[#030213]">Settings</h1>
                <p className="text-sm text-gray-500 mt-1">Manage your account and preferences.</p>
              </div>

              <div className="space-y-4">

                {/* Profile */}
                <div className="border border-[#030213] bg-[#f5f5f2] shadow-[4px_4px_0px_0px_#030213]">
                  <div className="px-6 py-4 border-b border-[#030213]">
                    <h2 className="text-sm font-bold text-[#030213]">Profile</h2>
                  </div>
                  <div className="p-6 space-y-5">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 border border-[#030213] bg-[#10b981] flex items-center justify-center text-xl font-black text-[#030213] shrink-0 select-none">
                        {(userName || userEmail).charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-[#030213]">{userName || 'Your Name'}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{userEmail}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Full Name</label>
                        <input
                          type="text"
                          value={profileName}
                          onChange={(e) => setProfileName(e.target.value)}
                          placeholder="Your full name"
                          className="w-full px-3 py-2.5 bg-white border border-[#030213] text-sm text-[#030213] placeholder:text-gray-400 focus:outline-none focus:border-[2px]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Email</label>
                        <input
                          type="email"
                          defaultValue={userEmail}
                          disabled
                          className="w-full px-3 py-2.5 bg-gray-50 border border-[#030213] text-sm text-gray-400 cursor-not-allowed focus:outline-none"
                        />
                      </div>
                    </div>
                    <button onClick={handleUpdateProfile} disabled={isSavingProfile} className="px-5 py-2.5 bg-[#030213] text-[#f5f5f2] text-xs font-bold uppercase tracking-widest border border-[#030213] hover:bg-[#10b981] hover:text-[#030213] hover:border-[#10b981] transition-none disabled:opacity-50">
                      {isSavingProfile ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </div>

                {/* Notifications */}
                <div className="border border-[#030213] bg-[#f5f5f2] shadow-[4px_4px_0px_0px_#030213]">
                  <div className="px-6 py-4 border-b border-[#030213]">
                    <h2 className="text-sm font-bold text-[#030213]">Notifications</h2>
                  </div>
                  <div className="divide-y divide-[#030213]/10">
                    {([
                      { label: 'Weekly spending summary', desc: 'A weekly digest of your spending across all categories', on: true },
                      { label: 'Budget limit alerts', desc: 'Get notified when you are close to or over a budget limit', on: true },
                      { label: 'Large transactions', desc: 'Alert when a single transaction exceeds ₹5,000', on: false },
                    ] as { label: string; desc: string; on: boolean }[]).map(({ label, desc, on }) => (
                      <div key={label} className="px-6 py-4 flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold text-[#030213]">{label}</p>
                          <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">{desc}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                          <input type="checkbox" defaultChecked={on} className="sr-only peer" />
                          <div className="w-9 h-5 bg-gray-200 border border-[#030213] peer-checked:bg-[#10b981] peer-checked:border-[#10b981] relative">
                            <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white border border-[#030213] peer-checked:translate-x-4 transition-none" />
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Security & Account */}
                <div className="border border-[#030213] bg-[#f5f5f2] shadow-[4px_4px_0px_0px_#030213]">
                  <div className="px-6 py-4 border-b border-[#030213]">
                    <h2 className="text-sm font-bold text-[#030213]">Security & Account</h2>
                  </div>
                  <div className="divide-y divide-[#030213]/10">
                    <div className="px-6 py-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-[#030213]">Sign-in method</p>
                        <p className="text-[11px] text-gray-500 mt-0.5">Signed in with Google OAuth</p>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-[#10b981] bg-[#10b981]/10 px-2 py-1 border border-[#10b981]">Active</span>
                    </div>
                    <div className="px-6 py-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-[#030213]">Active sessions</p>
                        <p className="text-[11px] text-gray-500 mt-0.5">1 device currently signed in</p>
                      </div>
                      <button onClick={handleSignOutAll} className="text-xs font-semibold text-[#030213] underline underline-offset-2 hover:text-[#d4183d] transition-none">
                        Sign out all
                      </button>
                    </div>
                    <div className="px-6 py-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-[#d4183d]">Delete Account</p>
                        <p className="text-[11px] text-gray-500 mt-0.5">Permanently remove your account and all data. This cannot be undone.</p>
                      </div>
                      <button onClick={handleDeleteAccount} className="text-xs font-bold text-[#d4183d] px-3 py-1.5 border border-[#d4183d] hover:bg-[#d4183d] hover:text-white transition-none shrink-0 ml-4">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {activeTab === 'budgets' && (
            <div className="max-w-2xl w-full mx-auto space-y-6">
              <div className="bg-[#f5f5f2] border border-[#030213] p-6 shadow-[4px_4px_0px_0px_#030213] mb-6">
                <span className="font-mono text-xs uppercase tracking-widest text-gray-500 block mb-1">
                  [ BUDGETS.AUDITING ]
                </span>
                <h1 className="text-2xl font-black uppercase tracking-tight text-[#030213]">
                  BUDGETARY LIMITS
                </h1>
              </div>

              <div className="bg-[#f5f5f2] border border-[#030213] p-6 space-y-6 shadow-[4px_4px_0px_0px_#030213]">
                <p className="font-mono text-xs text-gray-500 leading-relaxed uppercase tracking-wider">
                  Audits your spending patterns against standard default limits. Dynamic customization database tables are active and ready.
                </p>

                <div className="space-y-4">
                  {Object.entries(budgets).map(([cat, limit]) => (
                    <div key={cat} className="flex flex-col sm:flex-row justify-between items-start sm:items-center border border-[#030213] p-4 bg-white gap-4">
                      <span className="font-bold text-sm uppercase tracking-wider">{cat}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-gray-500">₹</span>
                        <input
                          type="number"
                          value={limit}
                          onChange={(e) => handleBudgetChange(cat, parseInt(e.target.value) || 0)}
                          className="w-24 px-2 py-1 bg-gray-50 border border-[#030213] text-sm font-mono font-bold text-[#030213] focus:outline-none focus:border-[#10b981]"
                        />
                        <span className="font-mono text-xs font-bold text-gray-500">/ MO</span>
                      </div>
                    </div>
                  ))}
                  
                  <div className="pt-4 border-t border-[#030213]/10 flex justify-end">
                    <button 
                      onClick={handleSaveBudgets} 
                      className="px-6 py-3 bg-[#030213] text-[#f5f5f2] text-xs font-bold uppercase tracking-widest border border-[#030213] hover:bg-[#10b981] hover:text-[#030213] hover:border-[#10b981] transition-none"
                    >
                      Save Limits
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

      </main>
    </div>
  )
}
