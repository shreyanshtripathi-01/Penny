import { Transaction } from "./types";

interface BudgetProgressProps {
  transactions: Transaction[];
}

const BUDGET_LIMITS: Record<string, number> = {
  'Food & Dining': 8000,
  'Transportation': 4000,
  'Shopping': 10000,
  'Entertainment': 5000,
  'Groceries': 12000,
  'Utilities': 5000,
};

export function BudgetProgress({ transactions }: BudgetProgressProps) {
  const catTotals: Record<string, number> = {};
  transactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => { catTotals[t.category] = (catTotals[t.category] ?? 0) + t.amount; });

  const budgets = Object.entries(BUDGET_LIMITS).map(([category, limit]) => {
    const spent = catTotals[category] || 0;
    const remaining = limit - spent;
    let note = "";
    if (remaining < 0) note = `Over by ₹${Math.abs(remaining).toLocaleString('en-IN')}`;
    else if (spent > 0) note = `₹${remaining.toLocaleString('en-IN')} to spare`;
    else note = "No spending yet";
    
    return { category, spent, limit, note };
  }).filter(b => b.spent > 0).slice(0, 4);

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 flex flex-col h-full">
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-[15px] text-slate-800" style={{ fontWeight: 600 }}>
          Budget limits
        </h3>
        <button className="text-[12px] text-slate-400 hover:text-slate-600 transition-colors" style={{ fontWeight: 500 }}>
          Edit budgets
        </button>
      </div>

      <div className="flex flex-col gap-5 flex-1 justify-center">
        {budgets.map((budget) => {
          const percent = Math.min((budget.spent / budget.limit) * 100, 100);
          const isOver = budget.spent > budget.limit;
          const remaining = budget.limit - budget.spent;

          return (
            <div key={budget.category}>
              <div className="flex justify-between items-baseline mb-1.5">
                <span className="text-[13px] text-slate-700" style={{ fontWeight: 600 }}>
                  {budget.category}
                </span>
                <span className={`text-[12px] ${isOver ? 'text-rose-500' : 'text-slate-400'}`} style={{ fontWeight: 500 }}>
                  {budget.note}
                </span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${percent}%`,
                    backgroundColor: isOver ? '#f87171' : percent > 80 ? '#fb923c' : '#334155',
                  }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-[11px] text-slate-400">
                  ₹{budget.spent.toLocaleString('en-IN')} spent
                </span>
                <span className="text-[11px] text-slate-400">
                  ₹{budget.limit.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
