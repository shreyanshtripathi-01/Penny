import React from 'react';
import { Transaction } from '@/app/dashboard/page';

const categoryColors: Record<string, string> = {
  "Food & Dining": "#f59e0b",
  "Groceries": "#10b981",
  "Transportation": "#64748b",
  "Shopping": "#8b5cf6",
  "Entertainment": "#ec4899",
  "Housing": "#334155",
  "Income": "#10b981",
  "Healthcare": "#d4183d",
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
    const d = new Date(tx.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase();
    if (!groupsObj[d]) groupsObj[d] = [];
    groupsObj[d].push(tx);
  });

  const groups = Object.entries(groupsObj).map(([label, txs]) => ({ label, transactions: txs })).slice(0, 3); // show latest 3 days of transactions on dash

  return (
    <div className="bg-[#f5f5f2] border border-[#030213] overflow-hidden shadow-[4px_4px_0px_0px_#030213]">
      <div className="px-6 py-5 flex justify-between items-center border-b border-[#030213]">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-gray-500 block mb-1">
            [ LEDGER.RECENT_RECORDS ]
          </span>
          <span className="text-sm font-bold uppercase tracking-wide">
            REALTIME AUDIT
          </span>
        </div>
        {onViewAll && (
          <button 
            onClick={onViewAll} 
            className="font-mono text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 border border-[#030213] bg-[#f5f5f2] hover:bg-[#030213] hover:text-[#f5f5f2] transition-none"
          >
            [ LEDGER ]
          </button>
        )}
      </div>

      <div className="divide-y divide-[#030213]">
        {groups.length === 0 ? (
          <div className="py-12 text-center font-mono text-xs uppercase text-gray-400">NO TRANSACTIONS COMMITTED</div>
        ) : groups.map((group) => (
          <div key={group.label} className="border-b border-[#030213] last:border-b-0">
            <div className="px-6 py-2 bg-[#030213]/5 border-b border-[#030213]">
              <span className="font-mono text-[10px] text-gray-500 uppercase tracking-widest font-black">
                TIMESTAMP: {group.label}
              </span>
            </div>
            <div className="divide-y divide-[#030213]/10">
              {group.transactions.map((tx) => {
                const isIncome = tx.type === 'income';
                const color = categoryColors[tx.category] ?? "#94a3b8";
                return (
                  <div
                    key={tx.id}
                    className="group flex items-center justify-between px-6 py-4 hover:bg-[#030213]/5 transition-none"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-2.5 h-2.5 border border-[#030213] shrink-0"
                        style={{ backgroundColor: color }}
                      />
                      <div className="min-w-0">
                        <p className="font-bold text-xs uppercase tracking-wider text-[#030213] truncate">
                          {tx.description}
                        </p>
                        <p className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mt-0.5">{tx.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span
                        className={`font-mono text-xs font-bold shrink-0 ml-4 tabular-nums ${isIncome ? "text-[#10b981]" : "text-[#030213]"}`}
                      >
                        {isIncome ? "+" : "−"}₹{tx.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                      {onDeleteTransaction && (
                        <button
                          onClick={() => onDeleteTransaction(tx.id)}
                          className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-[#d4183d] transition-opacity p-1 font-mono text-[10px] font-bold"
                          title="Wipe record"
                        >
                          [x]
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
