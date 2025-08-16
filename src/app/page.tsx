"use client";

import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import TransactionTable, { Transaction } from '@/components/transactions/TransactionTable';
import TransactionForm from '@/components/transactions/TransactionForm';
import StatementParser from '@/components/transactions/StatementParser';
import DashboardAnalytics from '@/components/analytics/DashboardAnalytics';
import { IndianRupee, TrendingUp, TrendingDown, Wallet, Sparkles, CheckCircle2 } from 'lucide-react';

const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: 'tx-1', description: 'Swiggy Dinner Order', amount: 840.00, date: '2025-07-28', category: 'Food & Dining', type: 'expense' },
  { id: 'tx-2', description: 'Zomato Coffee & Dessert', amount: 320.00, date: '2025-07-27', category: 'Food & Dining', type: 'expense' },
  { id: 'tx-3', description: 'Uber Premier Ride', amount: 620.00, date: '2025-07-25', category: 'Transportation', type: 'expense' },
  { id: 'tx-4', description: 'Monthly HDFC PG Rent', amount: 15000.00, date: '2025-07-01', category: 'Housing', type: 'expense' },
  { id: 'tx-5', description: 'Monthly Salary Credit', amount: 48000.00, date: '2025-07-01', category: 'Income', type: 'income' },
  { id: 'tx-6', description: 'Netflix Premium India', amount: 649.00, date: '2025-07-15', category: 'Entertainment', type: 'expense' },
  { id: 'tx-7', description: 'Bescom Electricity Bill', amount: 2450.00, date: '2025-07-12', category: 'Utilities', type: 'expense' },
  { id: 'tx-8', description: 'Amazon Shopping Sale', amount: 4120.00, date: '2025-07-10', category: 'Shopping', type: 'expense' }
];

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);

  // Handlers for dynamic state changes
  const handleAddTransaction = (newTx: Omit<Transaction, 'id' | 'date'>) => {
    const tx: Transaction = {
      ...newTx,
      id: `tx-${Date.now()}`,
      date: new Date().toISOString().split('T')[0]
    };
    setTransactions(prev => [tx, ...prev]);
  };

  const handleSaveParsedTransactions = (parsedTxs: Transaction[]) => {
    setTransactions(prev => [...parsedTxs, ...prev]);
    setActiveTab('dashboard'); // Redirect to dashboard to see results
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(tx => tx.id !== id));
  };

  // Metric aggregates
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  return (
    <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      
      {/* 1. DASHBOARD VIEW */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Financial Workspace</h1>
              <p className="text-xs text-gray-400 mt-0.5">Unified accounting system with neural enhancements</p>
            </div>
            <div className="px-3.5 py-1.5 rounded-lg bg-[#111726]/80 border border-[#1F293D] text-[11px] font-medium text-gray-300 flex items-center space-x-1.5 shadow-md">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Gemini Model Connected</span>
            </div>
          </div>

          {/* Metric KPI Widgets */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <KPICard 
              title="Liquid Balance" 
              amount={balance} 
              icon={<Wallet className="text-indigo-400" size={18} />} 
              subtext="Combined liquid assets across ledgers"
              amountColor={balance >= 0 ? 'text-white' : 'text-rose-400'}
            />
            <KPICard 
              title="Total Direct Credits" 
              amount={totalIncome} 
              icon={<TrendingUp className="text-emerald-400" size={18} />} 
              subtext="Aggregated credits and salary flow"
              amountColor="text-emerald-400"
            />
            <KPICard 
              title="Direct Debits" 
              amount={totalExpense} 
              icon={<TrendingDown className="text-rose-400" size={18} />} 
              subtext="Total expenditures categorized"
              amountColor="text-white"
            />
          </div>

          {/* Recharts Analytics graphs */}
          <DashboardAnalytics transactions={transactions} />

          {/* Record manual transaction entry */}
          <TransactionForm onAddTransaction={handleAddTransaction} />

          {/* Financial Ledger Table (limited to last 5 for neatness) */}
          <TransactionTable 
            transactions={transactions.slice(0, 5)} 
            onDeleteTransaction={handleDeleteTransaction}
            showAllLink={true}
            onViewAllClick={() => setActiveTab('transactions')}
          />
        </div>
      )}

      {/* 2. LEDGER TAB VIEW */}
      {activeTab === 'transactions' && (
        <div className="space-y-6 animate-fadeIn">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Ledger Records</h1>
            <p className="text-xs text-gray-400 mt-0.5">Perform advanced search, filtering, and record management</p>
          </div>

          <TransactionForm onAddTransaction={handleAddTransaction} />

          <TransactionTable 
            transactions={transactions} 
            onDeleteTransaction={handleDeleteTransaction}
            showAllLink={false}
          />
        </div>
      )}

      {/* 3. BUDGETS TAB VIEW */}
      {activeTab === 'budget' && (
        <div className="space-y-6 animate-fadeIn">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Budget Allocation</h1>
            <p className="text-xs text-gray-400 mt-0.5">Control threshold spending ceilings per category</p>
          </div>

          <DashboardAnalytics transactions={transactions} />
        </div>
      )}

      {/* 4. AI STATEMENT PARSER VIEW */}
      {activeTab === 'parser' && (
        <div className="space-y-6 animate-fadeIn">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Neural NLP Statement Parser</h1>
            <p className="text-xs text-gray-400 mt-0.5">Process raw statement text outputs with zero preprocessing</p>
          </div>

          <StatementParser onSaveParsedTransactions={handleSaveParsedTransactions} />
        </div>
      )}

      {/* 5. SETTINGS VIEW */}
      {activeTab === 'settings' && (
        <div className="space-y-6 animate-fadeIn">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Workspace Configs</h1>
            <p className="text-xs text-gray-400 mt-0.5">Maintain system preferences and external APIs</p>
          </div>

          <div className="bg-[#111726]/60 backdrop-blur-md rounded-xl border border-[#1F293D] p-6 shadow-xl space-y-6">
            <div>
              <h3 className="text-base font-semibold text-white mb-2">Workspace Integrations</h3>
              <p className="text-xs text-gray-400 leading-relaxed mb-4">
                Maintain neural engines and backend cloud schemas. Changes apply live to the active virtual workspace session.
              </p>
              
              <div className="border border-[#1F293D] rounded-lg p-4 bg-[#090D16]/30 space-y-4">
                {/* Gemini Config */}
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Gemini LLM Classifier</h4>
                    <p className="text-[10px] text-gray-500 mt-0.5">Currently using Gemini 1.5 Flash Model for direct inferences</p>
                  </div>
                  <span className="px-2 py-1 inline-flex text-[10px] font-medium leading-4 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Active & Connected
                  </span>
                </div>

                <hr className="border-[#1F293D]/50" />

                {/* Database Config */}
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Supabase Live Connection</h4>
                    <p className="text-[10px] text-gray-500 mt-0.5">Using secure local virtual workspace database cache</p>
                  </div>
                  <span className="px-2 py-1 inline-flex text-[10px] font-medium leading-4 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    Virtual Mock Sandbox
                  </span>
                </div>
              </div>
            </div>

            <hr className="border-[#1F293D]" />

            <div>
              <h3 className="text-sm font-semibold text-white mb-2">Reset Session Database</h3>
              <p className="text-xs text-gray-400 mb-4">
                Revert transaction logs and category budget items back to the initial standard seed state.
              </p>
              <button 
                onClick={() => {
                  setTransactions(INITIAL_TRANSACTIONS);
                  alert("Session database cache reset to seed transactions.");
                }}
                className="px-4 py-2 border border-rose-500/30 text-xs font-semibold rounded-lg text-rose-400 bg-rose-500/5 hover:bg-rose-500/15 transition-all"
              >
                Reset Ledger Sandbox
              </button>
            </div>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
}

interface KPICardProps {
  title: string;
  amount: number;
  icon: React.ReactNode;
  subtext: string;
  amountColor?: string;
}

function KPICard({ title, amount, icon, subtext, amountColor = "text-white" }: KPICardProps) {
  return (
    <div className="bg-[#111726]/60 backdrop-blur-md rounded-xl border border-[#1F293D] p-5 shadow-xl relative overflow-hidden transition-all duration-200 hover:border-[#1F293D]/80">
      <div className="absolute top-4 right-4 p-2 bg-[#090D16]/50 border border-[#1F293D]/40 rounded-lg">
        {icon}
      </div>
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{title}</h3>
      <p className={`mt-3.5 text-2xl font-bold ${amountColor}`}>
        ₹{amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
      </p>
      <p className="mt-2 text-[10px] text-gray-500">{subtext}</p>
    </div>
  );
}
