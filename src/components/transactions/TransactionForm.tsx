"use client";

import React, { useState } from 'react';
import { Transaction } from './TransactionTable';

interface TransactionFormProps {
  onAddTransaction: (tx: Omit<Transaction, 'id' | 'date'>) => void;
}

const CATEGORIES = [
  'Food & Dining', 'Transportation', 'Shopping', 'Entertainment',
  'Groceries', 'Utilities', 'Housing', 'Healthcare', 'Income', 'Miscellaneous'
];

export default function TransactionForm({ onAddTransaction }: TransactionFormProps) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food & Dining');
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [isCategorizing, setIsCategorizing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAutoCategorize = async () => {
    if (!description.trim()) return;
    setIsCategorizing(true);
    try {
      const res = await fetch('/api/categorize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description }),
      });
      const data = await res.json();
      if (data.category) {
        setCategory(data.category);
        setType(data.category === 'Income' ? 'income' : 'expense');
      }
    } catch {}
    finally { setIsCategorizing(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !amount) return;
    setIsSubmitting(true);
    await onAddTransaction({ description: description.trim(), amount: parseFloat(amount), category, type });
    setDescription('');
    setAmount('');
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900">Add transaction</h3>
        <button
          type="button"
          onClick={handleAutoCategorize}
          disabled={isCategorizing || !description.trim()}
          className="text-xs text-indigo-600 hover:text-indigo-700 font-medium disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {isCategorizing ? 'Categorizing...' : '✦ Auto-categorize'}
        </button>
      </div>

      <div className="grid grid-cols-12 gap-3 items-end">
        {/* Description */}
        <div className="col-span-4">
          <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Swiggy delivery"
            required
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Amount */}
        <div className="col-span-2">
          <label className="block text-xs font-medium text-gray-500 mb-1">Amount (₹)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            step="0.01"
            min="0"
            required
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Type */}
        <div className="col-span-2">
          <label className="block text-xs font-medium text-gray-500 mb-1">Type</label>
          <div className="flex rounded-lg border border-gray-200 overflow-hidden">
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`flex-1 py-2 text-xs font-medium transition-colors ${
                type === 'expense' ? 'bg-gray-900 text-white' : 'bg-white text-gray-500 hover:bg-gray-50'
              }`}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => setType('income')}
              className={`flex-1 py-2 text-xs font-medium transition-colors ${
                type === 'income' ? 'bg-gray-900 text-white' : 'bg-white text-gray-500 hover:bg-gray-50'
              }`}
            >
              Income
            </button>
          </div>
        </div>

        {/* Category */}
        <div className="col-span-3">
          <label className="block text-xs font-medium text-gray-500 mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          >
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>

        {/* Submit */}
        <div className="col-span-1">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
          >
            {isSubmitting ? (
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
