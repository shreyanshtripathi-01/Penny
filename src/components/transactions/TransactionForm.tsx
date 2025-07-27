"use client";

import React, { useState } from 'react';
import { PlusCircle, Sparkles } from 'lucide-react';

export default function TransactionForm() {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [isCategorizing, setIsCategorizing] = useState(false);

  const handleAutoCategorize = async () => {
    if (!description) {
      alert("Please enter a description first.");
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
        alert(`AI classified "${description}" as: ${data.category}`);
        // In the next step, we'll actually save this to the DB
      }
    } catch (error) {
      console.error("Categorization failed", error);
    } finally {
      setIsCategorizing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ description, amount, type, date: new Date().toISOString() });
    setDescription('');
    setAmount('');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-8">
      <div className="px-6 py-5 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Add Transaction</h3>
        <button 
          type="button"
          onClick={handleAutoCategorize}
          disabled={isCategorizing}
          className={`inline-flex items-center px-3 py-1.5 border border-purple-200 text-sm font-medium rounded-md transition-colors ${
            isCategorizing 
              ? 'text-purple-400 bg-purple-50 cursor-not-allowed' 
              : 'text-purple-700 bg-purple-50 hover:bg-purple-100'
          }`}
        >
          <Sparkles size={16} className={`mr-2 ${isCategorizing ? 'animate-pulse' : ''}`} />
          {isCategorizing ? 'Analyzing...' : 'Auto-categorize with AI'}
        </button>
      </div>
      
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4 sm:flex sm:space-y-0 sm:space-x-4 items-end">
          <div className="flex-1">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <input
              type="text"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Whole Foods Market"
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>
          
          <div className="sm:w-32">
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
              Amount
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                step="0.01"
                min="0"
                className="w-full rounded-md border border-gray-300 pl-7 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              />
            </div>
          </div>

          <div className="sm:w-32">
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value as 'expense' | 'income')}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <PlusCircle size={18} className="mr-2" />
            Add
          </button>
        </form>
      </div>
    </div>
  );
}
