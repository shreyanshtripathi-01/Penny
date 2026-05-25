import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Transaction } from '@/app/dashboard/page';

const COLORS = [
  '#030213', // Charcoal/Black
  '#10b981', // Emerald
  '#d4183d', // Red
  '#f59e0b', // Amber
  '#3b82f6', // Blue
  '#8b5cf6', // Violet
  '#6b7280'  // Gray
];

interface ExpenseChartProps {
  transactions: Transaction[];
}

export function ExpenseChart({ transactions }: ExpenseChartProps) {
  const expenses = transactions.filter(t => t.type === 'expense');
  const catMap: Record<string, number> = {};
  expenses.forEach(t => { catMap[t.category] = (catMap[t.category] || 0) + t.amount; });
  
  const data = Object.entries(catMap)
    .map(([name, value], idx) => ({ name, value, color: COLORS[idx % COLORS.length] }))
    .sort((a, b) => b.value - a.value);

  const total = data.reduce((sum, item) => sum + item.value, 0);
  const biggest = data.length > 0 ? data[0] : { name: 'None', value: 0 };

  return (
    <div className="bg-[#f5f5f2] border border-[#030213] p-6 flex flex-col h-full shadow-[4px_4px_0px_0px_#030213]">
      <div className="mb-4 pb-4 border-b border-[#030213]">
        <span className="font-mono text-xs uppercase tracking-widest text-gray-500 block mb-1">
          [ SPENDING.DISTRIBUTION ]
        </span>
        <span className="text-sm font-bold uppercase tracking-wide">
          PRIMARY DRAIN: <span className="font-mono text-[#d4183d]">{biggest.name.toUpperCase()}</span>
        </span>
      </div>

      <div className="relative flex-1 min-h-[220px] flex items-center justify-center">
        {data.length === 0 ? (
          <div className="font-mono text-xs uppercase text-gray-400">NO EXPENDITURE REGISTERED</div>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={0}
                  dataKey="value"
                  stroke="#030213"
                  strokeWidth={2}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, '']}
                  contentStyle={{
                    backgroundColor: '#f5f5f2',
                    borderRadius: '0px',
                    border: '1px solid #030213',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                    color: '#030213'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center justify-center pointer-events-none">
              <span className="font-mono text-[9px] uppercase tracking-widest text-gray-400">
                total
              </span>
              <span className="text-xl font-black font-mono">
                ₹{total.toLocaleString('en-IN')}
              </span>
            </div>
          </>
        )}
      </div>

      <div className="mt-6 border-t border-[#030213] pt-4 space-y-2 max-h-[140px] overflow-y-auto pr-1">
        {data.map((item) => {
          const pct = Math.round((item.value / total) * 100);
          return (
            <div key={item.name} className="flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 border border-[#030213]" style={{ backgroundColor: item.color }} />
                <span className="uppercase font-bold text-gray-700">{item.name}</span>
              </div>
              <span className="font-bold text-[#030213]">₹{item.value.toLocaleString('en-IN')} ({pct}%)</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
