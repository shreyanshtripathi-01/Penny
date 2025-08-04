"use client";

import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const data = [
  { name: 'Housing', value: 1200, color: '#3b82f6' },
  { name: 'Groceries', value: 450, color: '#10b981' },
  { name: 'Transportation', value: 180, color: '#f59e0b' },
  { name: 'Entertainment', value: 120, color: '#8b5cf6' },
  { name: 'Food & Dining', value: 320, color: '#ec4899' },
  { name: 'Utilities', value: 180, color: '#64748b' },
];

const budgets = [
  { category: 'Groceries', spent: 450, limit: 500 },
  { category: 'Food & Dining', spent: 320, limit: 300 }, // Over budget
  { category: 'Entertainment', spent: 120, limit: 200 },
];

export default function DashboardAnalytics() {
  const [isMounted, setIsMounted] = useState(false);

  // Prevent hydration errors with Recharts
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return <div className="h-64 bg-gray-50 rounded-lg animate-pulse"></div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Spending Breakdown */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Spending by Category</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: any) => `$${Number(value).toFixed(2)}`}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Budget Progress */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Budget Tracker</h3>
        <div className="space-y-6">
          {budgets.map((budget, idx) => {
            const percentage = Math.min(100, Math.round((budget.spent / budget.limit) * 100));
            const isOver = budget.spent > budget.limit;
            const isWarning = percentage >= 85 && !isOver;

            let colorClass = "bg-blue-500";
            if (isOver) colorClass = "bg-red-500";
            else if (isWarning) colorClass = "bg-yellow-500";

            return (
              <div key={idx}>
                <div className="flex justify-between text-sm font-medium mb-1">
                  <span className="text-gray-700">{budget.category}</span>
                  <span className={isOver ? 'text-red-600' : 'text-gray-500'}>
                    ${budget.spent} / ${budget.limit}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className={`h-2.5 rounded-full ${colorClass} transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                {isOver && <p className="text-xs text-red-600 mt-1">Over budget by ${(budget.spent - budget.limit).toFixed(2)}</p>}
                {isWarning && <p className="text-xs text-yellow-600 mt-1">Approaching limit</p>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
