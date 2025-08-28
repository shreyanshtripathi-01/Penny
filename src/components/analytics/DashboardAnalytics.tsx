"use client";

import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Transaction } from '../transactions/TransactionTable';

const CAT_COLOR: Record<string, string> = {
  'Food & Dining':    '#f472b6',
  'Transportation':   '#fbbf24',
  'Shopping':         '#22d3ee',
  'Entertainment':    '#a78bfa',
  'Groceries':        '#34d399',
  'Utilities':        '#94a3b8',
  'Housing':          '#60a5fa',
  'Healthcare':       '#f87171',
  'Miscellaneous':    '#d1d5db',
};

const BUDGET_LIMITS: Record<string, number> = {
  'Food & Dining':    8000,
  'Transportation':   4000,
  'Shopping':         10000,
  'Entertainment':    5000,
  'Groceries':        12000,
  'Utilities':        5000,
};

interface DashboardAnalyticsProps {
  transactions: Transaction[];
}

export default function DashboardAnalytics({ transactions }: DashboardAnalyticsProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return <div className="h-[260px] bg-gray-50 rounded-xl border border-gray-100 animate-pulse" />;

  // Spending by category (pie)
  const catTotals: Record<string, number> = {};
  transactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => { catTotals[t.category] = (catTotals[t.category] ?? 0) + t.amount; });

  const pieData = Object.entries(catTotals)
    .map(([name, value]) => ({ name, value, color: CAT_COLOR[name] ?? '#d1d5db' }))
    .sort((a, b) => b.value - a.value);

  // Monthly bar data (last 6 months)
  const monthlyMap: Record<string, { income: number; expense: number }> = {};
  transactions.forEach((t) => {
    const d = new Date(t.date);
    const key = d.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' });
    if (!monthlyMap[key]) monthlyMap[key] = { income: 0, expense: 0 };
    if (t.type === 'income') monthlyMap[key].income += t.amount;
    else monthlyMap[key].expense += t.amount;
  });
  const barData = Object.entries(monthlyMap)
    .slice(-6)
    .map(([month, vals]) => ({ month, ...vals }));

  // Budget tracker
  const budgets = Object.entries(BUDGET_LIMITS).map(([cat, limit]) => {
    const spent = catTotals[cat] ?? 0;
    return { cat, spent, limit, pct: Math.min(100, Math.round((spent / limit) * 100)) };
  });

  const fmt = (n: number) => `₹${n.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* Spending breakdown */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Spending breakdown</h3>
        {pieData.length === 0 ? (
          <div className="h-[180px] flex items-center justify-center text-sm text-gray-400">No expenses recorded.</div>
        ) : (
          <div className="flex items-center gap-4">
            <div className="w-[140px] h-[140px] flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" innerRadius={42} outerRadius={64} paddingAngle={2} strokeWidth={0}>
                    {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip
                    formatter={(val: any) => fmt(val)}
                    contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-2 min-w-0">
              {pieData.slice(0, 5).map((d) => (
                <div key={d.name} className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: d.color }} />
                  <span className="text-xs text-gray-600 truncate flex-1">{d.name}</span>
                  <span className="text-xs font-semibold text-gray-900 flex-shrink-0">{fmt(d.value)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Budget tracker */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Budget tracker</h3>
        <div className="space-y-3">
          {budgets.map(({ cat, spent, limit, pct }) => {
            const over = spent > limit;
            const barColor = over ? '#ef4444' : pct >= 80 ? '#f59e0b' : '#6366f1';
            return (
              <div key={cat}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-700">{cat}</span>
                  <span className={`text-xs font-medium ${over ? 'text-red-500' : 'text-gray-500'}`}>
                    {fmt(spent)} <span className="text-gray-300">/</span> {fmt(limit)}
                  </span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, background: barColor }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Monthly overview bar chart */}
      {barData.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Monthly overview</h3>
          <div className="h-[160px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} barGap={3} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} width={48} />
                <Tooltip
                  formatter={(val: any, name: any) => [fmt(val), name === 'income' ? 'Income' : 'Expenses']}
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }}
                />
                <Bar dataKey="income" fill="#34d399" radius={[3, 3, 0, 0]} name="income" />
                <Bar dataKey="expense" fill="#6366f1" radius={[3, 3, 0, 0]} name="expense" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
