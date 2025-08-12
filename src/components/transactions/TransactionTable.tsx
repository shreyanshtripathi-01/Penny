import React, { useState } from 'react';
import { MoreHorizontal, ArrowDownRight, ArrowUpRight, Search, Trash2 } from 'lucide-react';

export type Transaction = {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
  type: 'expense' | 'income';
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
  showAllLink = true,
  onViewAllClick
}: TransactionTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'expense' | 'income'>('all');

  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          tx.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || tx.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="bg-[#111726]/60 backdrop-blur-md rounded-xl border border-[#1F293D] overflow-hidden shadow-xl">
      {/* Header and Controls */}
      <div className="px-6 py-5 border-b border-[#1F293D] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-white tracking-tight">Financial Ledger</h3>
          <p className="text-xs text-gray-400 mt-0.5">Real-time overview of incoming and outgoing flows</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-[#090D16]/50 border border-[#1F293D] rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 w-48 transition-all"
            />
          </div>

          {/* Filter options */}
          <div className="flex bg-[#090D16]/50 border border-[#1F293D] rounded-lg p-0.5">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                filterType === 'all' ? 'bg-[#1F293D] text-white' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterType('expense')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                filterType === 'expense' ? 'bg-rose-500/10 text-rose-400' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              Expenses
            </button>
            <button
              onClick={() => setFilterType('income')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                filterType === 'income' ? 'bg-emerald-500/10 text-emerald-400' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              Income
            </button>
          </div>

          {showAllLink && onViewAllClick && (
            <button 
              onClick={onViewAllClick}
              className="text-xs text-indigo-400 font-semibold hover:text-indigo-300 transition-colors px-2 py-1.5"
            >
              View Full History
            </button>
          )}
        </div>
      </div>
      
      {/* Table grid */}
      <div className="overflow-x-auto">
        {filteredTransactions.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            No transaction records found matching the active criteria.
          </div>
        ) : (
          <table className="min-w-full divide-y divide-[#1F293D]">
            <thead className="bg-[#0E1320]/40">
              <tr>
                <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Transaction</th>
                <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Category</th>
                <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-3.5 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">Amount</th>
                <th scope="col" className="relative px-6 py-3.5"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F293D]/50 bg-transparent">
              {filteredTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-[#161F33]/20 transition-all duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`flex-shrink-0 h-9 w-9 rounded-lg flex items-center justify-center ${
                        tx.type === 'expense' 
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' 
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}>
                        {tx.type === 'expense' ? <ArrowDownRight size={16} /> : <ArrowUpRight size={16} />}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-white">{tx.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2.5 py-1 inline-flex text-xs leading-4 font-medium rounded-full bg-[#1A233D] text-indigo-300 border border-indigo-500/10">
                      {tx.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-400">
                    {new Date(tx.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold text-right ${
                    tx.type === 'expense' ? 'text-white' : 'text-emerald-400'
                  }`}>
                    {tx.type === 'expense' ? '-' : '+'}₹{tx.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-medium">
                    {onDeleteTransaction && (
                      <button 
                        onClick={() => onDeleteTransaction(tx.id)}
                        className="text-gray-500 hover:text-rose-400 transition-colors p-1.5 rounded-lg hover:bg-rose-500/10"
                        title="Delete Record"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
