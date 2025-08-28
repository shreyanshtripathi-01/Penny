"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Sidebar } from '@/components/new_ui/Sidebar';
import { Topbar } from '@/components/new_ui/Topbar';
import { Dashboard } from '@/components/new_ui/Dashboard';
import { Transaction } from '@/components/new_ui/types';

interface Props {
  initialTransactions: Transaction[];
  userEmail: string;
  userName: string;
  userId: string;
}

export default function DashboardClient({ initialTransactions, userEmail, userName, userId }: Props) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const supabase = createClient();

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

  return (
    <div
      className="flex h-screen bg-[#f5f5f2] overflow-hidden text-slate-900"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} userEmail={userEmail} userName={userName} />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar userEmail={userEmail} userName={userName} />
        
        <main className="flex-1 overflow-y-auto px-6 py-8 lg:px-10 lg:py-10">
          {activeTab === 'dashboard' && (
            <Dashboard 
              userEmail={userEmail}
              userName={userName}
              transactions={transactions}
              onAddTransaction={handleAddTransaction}
              onDeleteTransaction={handleDelete}
              onSaveParsedTransactions={handleSaveParsed}
            />
          )}

          {activeTab === 'transactions' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <h1 className="text-[28px] text-slate-900 leading-tight" style={{ fontWeight: 700, letterSpacing: "-0.02em" }}>
                All Transactions
              </h1>
              {/* Reuse the dashboard components purely for ledger view */}
              <div className="bg-white rounded-2xl p-6 border border-slate-100">
                <div className="divide-y divide-slate-50">
                  {transactions.length === 0 ? (
                    <div className="py-12 text-center text-sm text-slate-400">No transactions yet.</div>
                  ) : transactions.map(tx => (
                    <div key={tx.id} className="flex items-center justify-between py-4">
                      <div>
                        <p className="text-[14px] text-slate-800" style={{ fontWeight: 600 }}>{tx.description}</p>
                        <p className="text-[12px] text-slate-400">{tx.category} • {tx.date}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`text-[15px] ${tx.type === 'income' ? 'text-emerald-600' : 'text-slate-700'}`} style={{ fontWeight: 600 }}>
                          {tx.type === 'income' ? '+' : '−'}₹{tx.amount.toLocaleString('en-IN')}
                        </span>
                        <button onClick={() => handleDelete(tx.id)} className="text-slate-300 hover:text-rose-500 transition-colors">
                           <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                           </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <h1 className="text-[28px] text-slate-900 leading-tight" style={{ fontWeight: 700, letterSpacing: "-0.02em" }}>
                Settings
              </h1>
              <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4">
                 <div>
                    <label className="text-[12px] font-semibold text-slate-400 uppercase tracking-wider">Account</label>
                    <p className="text-[15px] font-medium text-slate-800 mt-1">{userEmail}</p>
                 </div>
                 <div className="h-px bg-slate-100 w-full" />
                 <div>
                    <label className="text-[12px] font-semibold text-slate-400 uppercase tracking-wider">Database</label>
                    <p className="text-[15px] font-medium text-slate-800 mt-1">Supabase PostgreSQL Connected</p>
                 </div>
              </div>
            </div>
          )}
          
          {(activeTab === 'budget' || activeTab === 'parser') && (
            <div className="max-w-4xl mx-auto py-12 text-center text-slate-500">
               <p>Please view the main Dashboard for full budget & parsing integrations.</p>
               <button onClick={() => setActiveTab('dashboard')} className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium">
                  Go to Dashboard
               </button>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
