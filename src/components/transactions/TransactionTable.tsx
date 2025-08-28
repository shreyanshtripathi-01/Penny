import React, { useState } from 'react';

export type Transaction = {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
  type: 'expense' | 'income';
};

const CATEGORY_DOT: Record<string, string> = {
  'Food & Dining': 'bg-pink-400',
  'Transportation': 'bg-amber-400',
  'Shopping': 'bg-cyan-400',
  'Entertainment': 'bg-purple-400',
  'Groceries': 'bg-emerald-400',
  'Utilities': 'bg-slate-400',
  'Housing': 'bg-blue-400',
  'Healthcare': 'bg-red-400',
  'Income': 'bg-green-500',
  'Miscellaneous': 'bg-gray-300',
};

interface TransactionTableProps {
  transactions: Transaction[];
  onDeleteTransaction?: (id: string) => void;
  showAllLink?: boolean;
  onViewAllClick?: () => void;
}

export default function TransactionTable({
  transactions,
  onDeleteTransaction,
  showAllLink = false,
  onViewAllClick,
}: TransactionTableProps) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'expense' | 'income'>('all');

  const filtered = transactions.filter((tx) => {
    const matchSearch =
      tx.description.toLowerCase().includes(search.toLowerCase()) ||
      tx.category.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || tx.type === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-gray-100 flex flex-wrap items-center gap-3">
        <h3 className="text-sm font-semibold text-gray-900 flex-1 min-w-0">
          Transactions
          <span className="ml-2 text-xs font-medium text-gray-400">{transactions.length}</span>
        </h3>

        {/* Search */}
        <div className="relative">
          <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-300" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="pl-7 pr-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-44 transition-all"
          />
        </div>

        {/* Filter pills */}
        <div className="flex bg-gray-100 rounded-lg p-0.5 gap-0.5">
          {(['all', 'expense', 'income'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors capitalize ${
                filter === f ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {showAllLink && onViewAllClick && (
          <button onClick={onViewAllClick} className="text-xs font-medium text-indigo-600 hover:text-indigo-700">
            View all →
          </button>
        )}
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="py-14 text-center">
          <p className="text-sm text-gray-400">No transactions yet.</p>
          <p className="text-xs text-gray-300 mt-1">Add one above or import from a bank statement.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-5 py-2.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Description</th>
                <th className="text-left px-5 py-2.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Category</th>
                <th className="text-left px-5 py-2.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Date</th>
                <th className="text-right px-5 py-2.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Amount</th>
                <th className="px-4 py-2.5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((tx) => (
                <tr key={tx.id} className="group hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    <span className="text-sm text-gray-900 font-medium">{tx.description}</span>
                  </td>
                  <td className="px-5 py-3">
                    <span className="inline-flex items-center gap-1.5 text-xs text-gray-600">
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${CATEGORY_DOT[tx.category] ?? 'bg-gray-300'}`} />
                      {tx.category}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-400">
                    {new Date(tx.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <span className={`text-sm font-semibold ${tx.type === 'income' ? 'text-emerald-600' : 'text-gray-900'}`}>
                      {tx.type === 'income' ? '+' : '−'}₹{tx.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {onDeleteTransaction && (
                      <button
                        onClick={() => onDeleteTransaction(tx.id)}
                        className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 transition-all"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polyline points="3,6 5,6 21,6"/><path d="M19,6l-1,14H6L5,6"/><path d="M10,11v6M14,11v6"/><path d="M9,6V4h6v2"/>
                        </svg>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
