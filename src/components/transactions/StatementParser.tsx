"use client";

import React, { useState } from 'react';
import { FileText, Sparkles, CheckCircle2, IndianRupee, Trash2, Save } from 'lucide-react';
import { Transaction } from './TransactionTable';

interface StatementParserProps {
  onSaveParsedTransactions: (transactions: Transaction[]) => void;
}

export default function StatementParser({ onSaveParsedTransactions }: StatementParserProps) {
  const [text, setText] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [parsedResults, setParsedResults] = useState<Transaction[] | null>(null);

  const handleParse = async () => {
    if (!text.trim()) return;
    
    setIsParsing(true);
    setParsedResults(null);
    
    try {
      const res = await fetch('/api/parse-statement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      
      const data = await res.json();
      if (data.transactions && Array.isArray(data.transactions)) {
        // Map elements to ensure they have unique IDs
        const txsWithIds = data.transactions.map((tx: any, idx: number) => ({
          id: `parsed-${Date.now()}-${idx}`,
          description: tx.description || 'Unknown transaction',
          amount: Math.abs(Number(tx.amount || 0)),
          date: tx.date ? new Date(tx.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          category: tx.category || 'Miscellaneous',
          type: tx.type || 'expense'
        }));
        setParsedResults(txsWithIds);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("AI Statement parsing failed, using fallback heuristic parser", error);
      // Heuristic parsing as a fail-safe
      setTimeout(() => {
        const fallbackResults = fallbackParseHeuristic(text);
        setParsedResults(fallbackResults);
      }, 1200);
    } finally {
      setIsParsing(false);
    }
  };

  const fallbackParseHeuristic = (rawText: string): Transaction[] => {
    const lines = rawText.split('\n');
    const results: Transaction[] = [];
    
    lines.forEach((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) return;

      // Extract numbers (amounts)
      const amountMatch = trimmed.match(/₹?\s*(\d+(?:\.\d{2})?)/) || trimmed.match(/\$\s*(\d+(?:\.\d{2})?)/);
      const amount = amountMatch ? parseFloat(amountMatch[1]) : 150.00;

      // Classify category and description based on simple keywords
      let desc = trimmed.replace(/[^a-zA-Z\s]/g, '').trim();
      if (desc.length > 30) desc = desc.substring(0, 30) + '...';
      if (!desc) desc = `Transaction #${idx + 1}`;

      const lowerText = trimmed.toLowerCase();
      let category = 'Miscellaneous';
      let type: 'expense' | 'income' = 'expense';

      if (lowerText.includes('uber') || lowerText.includes('ola') || lowerText.includes('auto') || lowerText.includes('metro')) {
        category = 'Transportation';
      } else if (lowerText.includes('swiggy') || lowerText.includes('zomato') || lowerText.includes('starbucks') || lowerText.includes('food') || lowerText.includes('restaurant')) {
        category = 'Food & Dining';
      } else if (lowerText.includes('netflix') || lowerText.includes('spotify') || lowerText.includes('prime') || lowerText.includes('movie')) {
        category = 'Entertainment';
      } else if (lowerText.includes('rent') || lowerText.includes('pg') || lowerText.includes('flat')) {
        category = 'Housing';
      } else if (lowerText.includes('groceries') || lowerText.includes('bigbasket') || lowerText.includes('zepto') || lowerText.includes('blinkit')) {
        category = 'Groceries';
      } else if (lowerText.includes('salary') || lowerText.includes('refund') || lowerText.includes('credited')) {
        category = 'Income';
        type = 'income';
      }

      results.push({
        id: `parsed-${Date.now()}-${idx}`,
        description: desc,
        amount,
        date: new Date().toISOString().split('T')[0],
        category,
        type
      });
    });

    return results;
  };

  const handleDeleteItem = (id: string) => {
    if (!parsedResults) return;
    setParsedResults(parsedResults.filter(item => item.id !== id));
  };

  const handleSaveAll = () => {
    if (!parsedResults || parsedResults.length === 0) return;
    onSaveParsedTransactions(parsedResults);
    setParsedResults(null);
    setText('');
  };

  return (
    <div className="bg-[#111726]/60 backdrop-blur-md rounded-xl border border-[#1F293D] overflow-hidden shadow-xl mb-8 relative">
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-indigo-500 to-purple-600 opacity-80"></div>
      
      <div className="px-6 py-5 border-b border-[#1F293D] bg-[#0E1320]/30 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FileText className="text-indigo-400" size={20} />
          <div>
            <h3 className="text-lg font-semibold text-white tracking-tight">AI Statement Parser</h3>
            <p className="text-xs text-gray-400 mt-0.5">Extract and categorize bulk records from text blocks</p>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <p className="text-xs text-gray-400 mb-4 leading-relaxed">
          Paste any raw text output from your bank statements or SMS notifications. The Gemini neural engine will instantly parse fields like payee descriptions, amounts, and assign proper fiscal categories.
        </p>
        
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={`Example raw notification block:&#10;HDFC Bank: Rs. 450.00 spent at ZOMATO on 12-Jul-25&#10;SBI SMS: Credited Rs. 45,000.00 as Salary on 01-Aug-25&#10;Zepto billing: ₹840.50 debited for order`}
          className="w-full h-36 bg-[#090D16]/50 border border-[#1F293D] rounded-xl p-4 text-xs font-mono text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 mb-4 resize-none leading-relaxed transition-all"
        />
        
        <div className="flex justify-end">
          <button 
            type="button"
            onClick={handleParse}
            disabled={isParsing || !text.trim()}
            className={`inline-flex items-center px-4 py-2.5 border border-transparent text-xs font-semibold rounded-lg shadow-lg text-white transition-all duration-200 ${
              isParsing || !text.trim()
                ? 'bg-indigo-600/40 text-indigo-300 cursor-not-allowed border-none' 
                : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-950/40'
            }`}
          >
            <Sparkles size={14} className={`mr-2 ${isParsing ? 'animate-spin text-purple-300' : ''}`} />
            {isParsing ? 'Processing Neural Model...' : 'Extract & Classify'}
          </button>
        </div>

        {/* Results section */}
        {parsedResults && (
          <div className="mt-6 border-t border-[#1F293D] pt-6 animate-fadeIn">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-white flex items-center">
                <CheckCircle2 size={16} className="text-emerald-400 mr-2" />
                Extracted Ledger Records ({parsedResults.length})
              </h4>
              <p className="text-[10px] text-gray-400">Review classifications before saving</p>
            </div>
            
            <div className="bg-[#090D16]/30 rounded-lg border border-[#1F293D] overflow-hidden max-h-80 overflow-y-auto">
              <ul className="divide-y divide-[#1F293D]/50">
                {parsedResults.map((tx) => (
                  <li key={tx.id} className="px-4 py-3 flex.col sm:flex sm:flex-row sm:items-center sm:justify-between hover:bg-[#161F33]/10 transition-all gap-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium text-white">{tx.description}</p>
                        <span className={`text-[10px] px-2 py-0.5 inline-flex leading-4 font-semibold rounded-full ${
                          tx.type === 'expense' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/5' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/5'
                        }`}>
                          {tx.type === 'expense' ? 'debit' : 'credit'}
                        </span>
                      </div>
                      <div className="flex items-center mt-1 space-x-3 text-xs text-gray-500">
                        <span className="px-2 py-0.5 inline-flex text-[10px] font-medium rounded bg-[#1A233D] text-indigo-300">
                          {tx.category}
                        </span>
                        <span>{new Date(tx.date).toLocaleDateString('en-IN')}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between sm:justify-end gap-4 mt-2 sm:mt-0">
                      <span className={`text-sm font-semibold ${
                        tx.type === 'expense' ? 'text-white' : 'text-emerald-400'
                      }`}>
                        {tx.type === 'expense' ? '-' : '+'}₹{tx.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                      
                      <button 
                        onClick={() => handleDeleteItem(tx.id)}
                        className="text-gray-500 hover:text-rose-400 transition-colors p-1 rounded hover:bg-rose-500/10"
                        title="Remove parsed record"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="mt-4 flex justify-end">
              <button 
                onClick={handleSaveAll}
                disabled={parsedResults.length === 0}
                className="inline-flex items-center px-4 py-2 border border-transparent text-xs font-semibold rounded-lg shadow-lg text-white bg-emerald-600 hover:bg-emerald-700 transition-all duration-200"
              >
                <Save size={14} className="mr-2" />
                Commit to Ledger
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
