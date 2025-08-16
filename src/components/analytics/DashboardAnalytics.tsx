"use client";

import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Transaction } from '../transactions/TransactionTable';
import { Sparkles, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface DashboardAnalyticsProps {
  transactions: Transaction[];
}

const CATEGORY_COLORS: { [key: string]: string } = {
  'Housing': '#3b82f6',        // Blue
  'Groceries': '#10b981',      // Emerald
  'Transportation': '#f59e0b', // Amber
  'Entertainment': '#8b5cf6',  // Purple
  'Food & Dining': '#ec4899',  // Pink
  'Utilities': '#64748b',      // Slate
  'Shopping': '#06b6d4',       // Cyan
  'Healthcare': '#ef4444',     // Red
  'Miscellaneous': '#6b7280',  // Grey
  'Income': '#10b981',         // Green
};

const BUDGET_LIMITS: { [key: string]: number } = {
  'Groceries': 12000,
  'Food & Dining': 8000,
  'Entertainment': 6000,
  'Transportation': 4000,
  'Shopping': 10000,
  'Utilities': 5000,
};

export default function DashboardAnalytics({ transactions }: DashboardAnalyticsProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return <div className="h-64 bg-[#111726]/40 rounded-xl animate-pulse border border-[#1F293D]"></div>;

  // 1. Dynamic Pie Chart data from transactions
  const expenses = transactions.filter(t => t.type === 'expense');
  const categoryTotals: { [key: string]: number } = {};

  expenses.forEach(tx => {
    categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + tx.amount;
  });

  const pieData = Object.keys(categoryTotals).map(cat => ({
    name: cat,
    value: categoryTotals[cat],
    color: CATEGORY_COLORS[cat] || '#6b7280'
  })).sort((a, b) => b.value - a.value);

  // Fallback pie data if no expenses exist yet
  const displayPieData = pieData.length > 0 ? pieData : [
    { name: 'No Expenses Recoded', value: 1, color: '#1F293D' }
  ];

  // 2. Budget summaries
  const budgetTracker = Object.keys(BUDGET_LIMITS).map(cat => {
    const spent = transactions
      .filter(t => t.type === 'expense' && t.category === cat)
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      category: cat,
      spent,
      limit: BUDGET_LIMITS[cat]
    };
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Spending Breakdown */}
      <div className="bg-[#111726]/60 backdrop-blur-md rounded-xl border border-[#1F293D] p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <TrendingUp size={80} className="text-gray-400" />
        </div>
        <h3 className="text-base font-semibold text-white mb-4 flex items-center">
          <TrendingUp size={16} className="text-indigo-400 mr-2" />
          Spending Breakdown
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={displayPieData}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
              >
                {displayPieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: any) => pieData.length > 0 ? `₹${Number(value).toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : 'N/A'}
                contentStyle={{ 
                  backgroundColor: '#111726', 
                  borderRadius: '12px', 
                  border: '1px solid #1F293D', 
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.5)',
                  color: '#fff' 
                }}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px', color: '#9ca3af' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Budget Tracker */}
      <div className="bg-[#111726]/60 backdrop-blur-md rounded-xl border border-[#1F293D] p-6 shadow-xl relative overflow-hidden">
        <h3 className="text-base font-semibold text-white mb-4 flex items-center">
          <Sparkles size={16} className="text-indigo-400 mr-2" />
          Budget Tracker (INR)
        </h3>
        
        <div className="space-y-4 max-h-64 overflow-y-auto pr-1">
          {budgetTracker.map((budget, idx) => {
            const percentage = Math.min(100, Math.round((budget.spent / budget.limit) * 100));
            const isOver = budget.spent > budget.limit;
            const isWarning = percentage >= 85 && !isOver;

            let colorClass = "bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.4)]";
            if (isOver) colorClass = "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]";
            else if (isWarning) colorClass = "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]";

            return (
              <div key={idx} className="bg-[#090D16]/30 border border-[#1F293D]/30 rounded-lg p-3 hover:border-[#1F293D]/80 transition-all duration-200">
                <div className="flex justify-between text-xs font-semibold mb-2">
                  <span className="text-gray-200">{budget.category}</span>
                  <span className={isOver ? 'text-rose-400 font-bold' : 'text-gray-400'}>
                    ₹{budget.spent.toLocaleString('en-IN')} / ₹{budget.limit.toLocaleString('en-IN')}
                  </span>
                </div>
                
                <div className="w-full bg-[#111726] rounded-full h-2 overflow-hidden border border-gray-800/50">
                  <div 
                    className={`h-2 rounded-full ${colorClass} transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                
                {isOver && (
                  <p className="text-[10px] text-rose-400 mt-1.5 flex items-center">
                    <AlertTriangle size={10} className="mr-1" />
                    Over budget limit by ₹{(budget.spent - budget.limit).toLocaleString('en-IN')}
                  </p>
                )}
                {isWarning && (
                  <p className="text-[10px] text-amber-400 mt-1.5 flex items-center">
                    <AlertTriangle size={10} className="mr-1" />
                    Approaching allocated threshold limit
                  </p>
                )}
                {!isOver && !isWarning && budget.spent > 0 && (
                  <p className="text-[10px] text-emerald-400 mt-1.5 flex items-center">
                    <CheckCircle2 size={10} className="mr-1" />
                    Within target limit ({percentage}%)
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
