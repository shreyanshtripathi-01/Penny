import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Transaction } from "./types";

const COLORS = ['#334155', '#64748b', '#10b981', '#f59e0b', '#e2e8f0', '#ef4444', '#8b5cf6'];

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
  const biggest = data.length > 0 ? data[0] : { name: 'Nothing', value: 0 };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 flex flex-col h-full">
      <div className="mb-4">
        <h3 className="text-[15px] text-slate-800" style={{ fontWeight: 600 }}>
          Where it went
        </h3>
        <p className="text-[12px] text-slate-400 mt-0.5">
          Most of it went to <span className="text-slate-600" style={{ fontWeight: 600 }}>{biggest.name}</span>
        </p>
      </div>

      <div className="relative flex-1 min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={64}
              outerRadius={82}
              paddingAngle={3}
              dataKey="value"
              stroke="none"
              cornerRadius={3}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: any) => [`₹${Number(value).toLocaleString()}`, '']}
              contentStyle={{
                borderRadius: '10px',
                border: '1px solid #f1f5f9',
                boxShadow: '0 4px 12px rgb(0 0 0 / 0.08)',
                fontSize: '13px',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider" style={{ fontWeight: 600 }}>
            total
          </span>
          <span className="text-[22px] text-slate-900" style={{ fontWeight: 700, letterSpacing: '-0.02em' }}>
            ₹{total.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {data.map((item) => {
          const pct = Math.round((item.value / total) * 100);
          return (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-[13px] text-slate-600">{item.name}</span>
              </div>
              <span className="text-[13px] text-slate-400">{pct}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
