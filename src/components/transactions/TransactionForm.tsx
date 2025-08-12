"use client";

import React, { useState } from 'react';
import { PlusCircle, Sparkles, IndianRupee } from 'lucide-react';

interface TransactionFormProps {
  onAddTransaction: (transaction: {
    description: string;
    amount: number;
    category: string;
    type: 'expense' | 'income';
  }) => void;
}

export default function TransactionForm({ onAddTransaction }: TransactionFormProps) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food & Dining');
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [isCategorizing, setIsCategorizing] = useState(false);

  const categories = [
    'Groceries', 'Entertainment', 'Transportation', 
    'Housing', 'Utilities', 'Food & Dining', 
    'Shopping', 'Healthcare', 'Income', 'Miscellaneous'
  ];

  const handleAutoCategorize = async () => {
    if (!description.trim()) {
      alert("Please enter a transaction description first (e.g. 'Lunch at Starbucks' or 'Uber ride to station')");
      return;
    }
    
    setIsCategorizing(true);
    try {
      const res = await fetch('/api/categorize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description })
      });
      
      const data = await res.json();
      if (data.category) {
        setCategory(data.category);
        // If the AI suggests income, set it to income automatically
        if (data.category === 'Income') {
          setType('income');
        } else {
          setType('expense');
        }
      }
    } catch (error) {
      console.error("AI Categorization failed, applying local fallback heuristics", error);
    } finally {
      setIsCategorizing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !amount.trim()) return;

    onAddTransaction({
      description: description.trim(),
      amount: parseFloat(amount),
      category,
      type
    });

    setDescription('');
    setAmount('');
  };

  return (
    <div className="bg-[#111726]/60 backdrop-blur-md rounded-xl border border-[#1F293D] overflow-hidden shadow-xl mb-8 relative">
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 opacity-80"></div>
      
      <div className="px-6 py-5 border-b border-[#1F293D] bg-[#0E1320]/30 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <div>
          <h3 className="text-lg font-semibold text-white tracking-tight">Record Entry</h3>
          <p className="text-xs text-gray-400 mt-0.5">Manually add details or trigger neural categorization</p>
        </div>
        
        <button 
          type="button" 
          onClick={handleAutoCategorize}
          disabled={isCategorizing || !description.trim()}
          className={`inline-flex items-center px-4 py-2 border border-indigo-500/20 text-xs font-semibold rounded-lg transition-all duration-200 ${
            isCategorizing || !description.trim()
              ? 'text-gray-500 bg-[#090D16]/30 cursor-not-allowed border-none' 
              : 'text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 shadow-md shadow-indigo-950/40'
          }`}
        >
          <Sparkles size={14} className={`mr-2 ${isCategorizing ? 'animate-spin text-purple-400' : 'text-indigo-400'}`} />
          {isCategorizing ? 'Predicting Class...' : 'Classify with Gemini'}
        </button>
      </div>
      
      <div className="p-6">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          {/* Description */}
          <div className="md:col-span-1">
            <label htmlFor="description" className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">
              Description / Payee
            </label>
            <input
              type="text"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Swiggy Lunch Order"
              className="w-full bg-[#090D16]/50 border border-[#1F293D] rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              required
            />
          </div>
          
          {/* Amount */}
          <div>
            <label htmlFor="amount" className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">
              Amount
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <IndianRupee size={14} className="text-gray-400" />
              </div>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                step="0.01"
                min="0"
                className="w-full bg-[#090D16]/50 border border-[#1F293D] rounded-lg pl-8 pr-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                required
              />
            </div>
          </div>

          {/* Type Selector */}
          <div>
            <label htmlFor="type" className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">
              Flow Type
            </label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value as 'expense' | 'income')}
              className="w-full bg-[#090D16]/50 border border-[#1F293D] rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-no-repeat appearance-none"
            >
              <option value="expense" className="bg-[#111726]">Expense (Debit)</option>
              <option value="income" className="bg-[#111726]">Income (Credit)</option>
            </select>
          </div>

          {/* Category Selector */}
          <div>
            <label htmlFor="category" className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">
              Class Category
            </label>
            <div className="flex space-x-2">
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="flex-1 bg-[#090D16]/50 border border-[#1F293D] rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-no-repeat appearance-none"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat} className="bg-[#111726]">
                    {cat}
                  </option>
                ))}
              </select>
              
              <button
                type="submit"
                className="inline-flex items-center justify-center p-2.5 border border-transparent rounded-lg shadow-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                title="Add Entry"
              >
                <PlusCircle size={20} />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
