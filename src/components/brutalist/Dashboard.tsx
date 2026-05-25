import React, { useState, useEffect } from 'react';
import { BalanceCards } from './BalanceCards';
import { ExpenseChart } from './ExpenseChart';
import { BudgetProgress } from './BudgetProgress';
import { RecentTransactions } from './RecentTransactions';
import { Transaction } from '@/app/dashboard/page';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

interface DashboardProps {
  userEmail: string;
  userName?: string;
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
  onTabChange?: (tab: string) => void;
  budgetsRecord?: Record<string, number>;
}

export function Dashboard({ 
  userEmail, 
  userName,
  transactions, 
  onDeleteTransaction,
  onTabChange,
  budgetsRecord
}: DashboardProps) {

  const [greeting, setGreeting] = useState("Good morning");

  useEffect(() => {
    setGreeting(getGreeting());
    const interval = setInterval(() => {
      setGreeting(getGreeting());
    }, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const fmt = (n: number) => `₹${n.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

  const displayName = userName || userEmail.split('@')[0];
  const firstName = displayName.split(' ')[0];

  return (
    <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto">
      {/* Greetings Block */}
      <div className="bg-[#f5f5f2] border border-[#030213] p-6 md:p-8 shadow-[4px_4px_0px_0px_#030213]">
        <span className="font-mono text-xs uppercase tracking-widest text-gray-500 block mb-2">
          [ SESSION ACTIVE ]
        </span>
        <h1 className="text-3xl font-black uppercase tracking-tight text-[#030213]">
          {greeting}, {firstName}.
        </h1>
        <p className="font-mono text-xs uppercase tracking-wider text-gray-500 mt-2 leading-relaxed">
          TOTAL ACCUMULATED DEBIT THIS PERIOD: <span className="text-[#d4183d] font-bold">{fmt(totalExpense)}</span> — SYSTEMS BALANCED & OPERATIONAL.
        </p>
      </div>

      {/* Balance Statistics grid */}
      <BalanceCards transactions={transactions} />

      {/* Core Overview Content Grid (Chart + Budgets) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        <ExpenseChart transactions={transactions} />
        <BudgetProgress transactions={transactions} onTabChange={onTabChange} budgetsRecord={budgetsRecord} />
      </div>

      {/* Full-width Recent Transactions List */}
      <RecentTransactions 
        transactions={transactions} 
        onDeleteTransaction={onDeleteTransaction} 
        onViewAll={onTabChange ? () => onTabChange('transactions') : undefined}
      />
    </div>
  );
}
