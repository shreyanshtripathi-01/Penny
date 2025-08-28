"use client";

import React, { useState } from 'react';
import { Transaction } from './TransactionTable';

interface StatementParserProps {
  onSaveParsedTransactions: (transactions: Transaction[]) => void;
}

export default function StatementParser({ onSaveParsedTransactions }: StatementParserProps) {
  const [text, setText] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [parsedResults, setParsedResults] = useState<Transaction[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleParse = async () => {
    if (!text.trim()) return;
    setIsParsing(true);
    setParsedResults(null);
    setError(null);

    try {
      const res = await fetch('/api/parse-statement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();
      
      if (!res.ok || data.error) {
        setError(data.error ?? 'Failed to parse. Please try again.');
        return;
      }

      if (!Array.isArray(data.transactions) || data.transactions.length === 0) {
        setError("No transactions found. Try pasting a bank SMS or statement text.");
        return;
      }

      const normalized: Transaction[] = data.transactions.map((tx: any, i: number) => ({
        id: `parsed-${Date.now()}-${i}`,
        description: String(tx.description ?? 'Transaction').substring(0, 60),
        amount: Math.abs(Number(tx.amount ?? 0)),
        date: tx.date ?? new Date().toISOString().split('T')[0],
        category: tx.category ?? 'Miscellaneous',
        type: tx.type === 'income' ? 'income' : 'expense',
      }));

      setParsedResults(normalized);
    } catch (e) {
      setError('Network error. Check your connection and try again.');
    } finally {
      setIsParsing(false);
    }
  };

  const handleRemove = (id: string) => {
    setParsedResults((prev) => prev?.filter((t) => t.id !== id) ?? null);
  };

  const handleSave = () => {
    if (!parsedResults || parsedResults.length === 0) return;
    onSaveParsedTransactions(parsedResults);
    setParsedResults(null);
    setText('');
  };

  return (
    <div className="space-y-5">
      {/* Input */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900">Paste bank statement or SMS</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Works with HDFC, SBI, ICICI, Axis, UPI messages, or any plain-text statement.
          </p>
        </div>
        <div className="p-5">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={6}
            placeholder={`Example:\nHDFC Bank: Rs.450.00 debited from A/c **1234 at SWIGGY on 15-05-25\nSBI: INR 15,000.00 credited to your account. Salary credit.\nUPI: Rs 320 paid to Zomato via PhonePe`}
            className="w-full resize-none border border-gray-200 rounded-lg px-3.5 py-3 text-sm font-mono text-gray-800 placeholder-gray-300 leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />

          {error && (
            <p className="mt-2 text-sm text-red-600">{error}</p>
          )}

          <div className="mt-4 flex justify-end">
            <button
              onClick={handleParse}
              disabled={isParsing || !text.trim()}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
            >
              {isParsing ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                  </svg>
                  Extracting...
                </>
              ) : 'Extract transactions'}
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      {parsedResults && parsedResults.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                {parsedResults.length} transaction{parsedResults.length > 1 ? 's' : ''} found
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">Review and remove any incorrect entries before saving.</p>
            </div>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-gray-900 hover:bg-black text-white text-sm font-medium rounded-lg transition-colors"
            >
              Save to ledger
            </button>
          </div>

          <div className="divide-y divide-gray-100">
            {parsedResults.map((tx) => (
              <div key={tx.id} className="px-5 py-3.5 flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{tx.description}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px] px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded font-medium">
                      {tx.category}
                    </span>
                    <span className="text-[11px] text-gray-400">
                      {new Date(tx.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    <span className={`text-[11px] font-medium ${tx.type === 'income' ? 'text-green-600' : 'text-gray-500'}`}>
                      {tx.type === 'income' ? 'Credit' : 'Debit'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className={`text-sm font-semibold ${tx.type === 'income' ? 'text-green-600' : 'text-gray-900'}`}>
                    {tx.type === 'income' ? '+' : '−'}₹{tx.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                  <button
                    onClick={() => handleRemove(tx.id)}
                    className="text-gray-300 hover:text-red-500 transition-colors"
                    title="Remove"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
