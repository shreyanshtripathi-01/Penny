import { Transaction } from './types';

const categoryColors: Record<string, string> = {
  "Food & Dining": "#f59e0b",
  "Groceries": "#10b981",
  "Transportation": "#64748b",
  "Shopping": "#8b5cf6",
  "Entertainment": "#ec4899",
  "Housing": "#334155",
  "Income": "#22c55e",
  "Healthcare": "#f87171",
  "Utilities": "#94a3b8",
  "Miscellaneous": "#d1d5db"
};

interface RecentTransactionsProps {
  transactions: Transaction[];
  onViewAll?: () => void;
  onDeleteTransaction?: (id: string) => void;
}

export function RecentTransactions({ transactions, onViewAll, onDeleteTransaction }: RecentTransactionsProps) {
  // Group by date
  const groupsObj: Record<string, Transaction[]> = {};
  transactions.forEach(tx => {
    const d = new Date(tx.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
    if (!groupsObj[d]) groupsObj[d] = [];
    groupsObj[d].push(tx);
  });

  const groups = Object.entries(groupsObj).map(([label, txs]) => ({ label, transactions: txs }));

  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
      <div className="px-6 py-5 flex justify-between items-center border-b border-slate-100">
        <h3 className="text-[15px] text-slate-800" style={{ fontWeight: 600 }}>
          Recent transactions
        </h3>
        {onViewAll && (
          <button onClick={onViewAll} className="text-[12px] text-slate-400 hover:text-slate-600 transition-colors" style={{ fontWeight: 500 }}>
            View all
          </button>
        )}
      </div>

      <div className="divide-y divide-slate-50">
        {groups.length === 0 ? (
          <div className="py-12 text-center text-sm text-slate-400">No transactions yet.</div>
        ) : groups.map((group) => (
          <div key={group.label}>
            <div className="px-6 py-2.5 bg-slate-50/50">
              <p className="text-[11px] text-slate-400 uppercase tracking-widest" style={{ fontWeight: 600 }}>
                {group.label}
              </p>
            </div>
            {group.transactions.map((tx) => {
              const isIncome = tx.type === 'income';
              const color = categoryColors[tx.category] ?? "#94a3b8";
              return (
                <div
                  key={tx.id}
                  className="group flex items-center justify-between px-6 py-3.5 hover:bg-slate-50/60 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: color }}
                    />
                    <div className="min-w-0">
                      <p className="text-[13px] text-slate-800 truncate" style={{ fontWeight: 600 }}>
                        {tx.description}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">{tx.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-[14px] shrink-0 ml-4 tabular-nums ${isIncome ? "text-emerald-600" : "text-slate-700"}`}
                      style={{ fontWeight: 600 }}
                    >
                      {isIncome ? "+" : "−"}₹{tx.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                    {onDeleteTransaction && (
                      <button
                        onClick={() => onDeleteTransaction(tx.id)}
                        className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-rose-500 transition-opacity"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
