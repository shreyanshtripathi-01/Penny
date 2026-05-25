import React from 'react';
import { Transaction } from '@/app/dashboard/page';

interface BudgetProgressProps {
  transactions: Transaction[];
  onTabChange?: (tab: string) => void;
  budgetsRecord?: Record<string, number>;
}

const DEFAULT_BUDGETS: Record<string, number> = {
  'Food & Dining': 8000,
  'Transportation': 4000,
  'Shopping': 10000,
  'Entertainment': 5000,
  'Groceries': 12000,
  'Utilities': 5000,
};

export function BudgetProgress({ transactions, onTabChange, budgetsRecord }: BudgetProgressProps) {
  const catTotals: Record<string, number> = {};
  transactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => { catTotals[t.category] = (catTotals[t.category] ?? 0) + t.amount; });

  const activeLimits = budgetsRecord || DEFAULT_BUDGETS;

  const budgets = Object.entries(activeLimits).map(([category, limit]) => {
    const spent = catTotals[category] || 0;
    const remaining = limit - spent;
    let note = "";
    if (remaining < 0) note = `OVER BY ₹${Math.abs(remaining).toLocaleString('en-IN')}`;
    else if (spent > 0) note = `₹${remaining.toLocaleString('en-IN')} SPARE`;
    else note = "NO SPENDING";
    
    return { category, spent, limit, note };
  });

  // Only show budgets with spending or a few default ones
  const activeBudgets = budgets.filter(b => b.spent > 0).slice(0, 4);
  const displayBudgets = activeBudgets.length > 0 ? activeBudgets : budgets.slice(0, 4);

  return (
    <div className="bg-[#f5f5f2] border border-[#030213] p-6 flex flex-col h-full shadow-[4px_4px_0px_0px_#030213]">
      <div className="flex justify-between items-center mb-4 pb-4 border-b border-[#030213]">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-gray-500 block mb-1">
            [ SYSTEM.BUDGETS ]
          </span>
          <span className="text-sm font-bold uppercase tracking-wide">
            LIMIT AUDITING
          </span>
        </div>
        {onTabChange && (
          <button 
            onClick={() => onTabChange('budgets')}
            className="font-mono text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 border border-[#030213] bg-[#f5f5f2] hover:bg-[#030213] hover:text-[#f5f5f2] transition-none"
          >
            [ EDIT ]
          </button>
        )}
      </div>

      <div className="flex flex-col gap-6 flex-1 justify-center">
        {displayBudgets.map((budget) => {
          const percent = Math.min((budget.spent / budget.limit) * 100, 100);
          const isOver = budget.spent > budget.limit;

          return (
            <div key={budget.category} className="space-y-1.5">
              <div className="flex justify-between items-baseline font-mono text-[11px] uppercase tracking-wider font-bold">
                <span className="text-gray-700">{budget.category}</span>
                <span className={isOver ? 'text-[#d4183d]' : 'text-gray-500'}>
                  {budget.note}
                </span>
              </div>
              
              {/* Brutalist Meter Bar */}
              <div className="h-5 w-full bg-transparent border border-[#030213] overflow-hidden relative flex items-center">
                <div
                  className="h-full border-r border-[#030213]"
                  style={{
                    width: `${percent}%`,
                    backgroundColor: isOver ? '#d4183d' : percent > 80 ? '#f59e0b' : '#10b981',
                  }}
                />
                <span className="absolute right-2 font-mono text-[9px] font-bold text-[#030213] mix-blend-difference">
                  {Math.round(percent)}%
                </span>
              </div>

              <div className="flex justify-between font-mono text-[9px] text-gray-400">
                <span>₹{budget.spent.toLocaleString('en-IN')} USED</span>
                <span>₹{budget.limit.toLocaleString('en-IN')} MAX</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
