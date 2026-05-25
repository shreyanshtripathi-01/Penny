import React, { useState } from 'react';
import { Transaction } from '@/app/dashboard/page';

const CATEGORIES = [
  'Food & Dining', 'Transportation', 'Shopping', 'Entertainment',
  'Groceries', 'Utilities', 'Housing', 'Healthcare', 'Income', 'Miscellaneous'
];

interface QuickAddTransactionProps {
  onAddTransaction: (tx: Omit<Transaction, 'id' | 'date'>) => Promise<void>;
}

export function QuickAddTransaction({ onAddTransaction }: QuickAddTransactionProps) {
  const [type, setType] = useState<"expense" | "income">("expense");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Food & Dining");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description) return;
    setIsSubmitting(true);
    await onAddTransaction({
      description,
      amount: parseFloat(amount),
      type,
      category: type === 'income' ? 'Income' : category
    });
    setAmount("");
    setDescription("");
    setIsSubmitting(false);
  };

  return (
    <div className="bg-[#f5f5f2] border border-[#030213] p-6 shadow-[4px_4px_0px_0px_#030213]">
      <div className="mb-4 pb-4 border-b border-[#030213]">
        <span className="font-mono text-xs uppercase tracking-widest text-gray-500 block mb-1">
          [ TRANSACTION.ADD_ENTRY ]
        </span>
        <span className="text-sm font-bold uppercase tracking-wide">
          MANUAL DISPATCH
        </span>
      </div>

      <div className="flex border border-[#030213] mb-5">
        <button
          type="button"
          onClick={() => setType("expense")}
          className={`flex-1 py-2 font-mono text-xs font-bold uppercase tracking-widest transition-none ${
            type === "expense" ? "bg-[#030213] text-[#f5f5f2]" : "bg-transparent text-[#030213]"
          }`}
        >
          EXPENSE
        </button>
        <button
          type="button"
          onClick={() => setType("income")}
          className={`flex-1 py-2 font-mono text-xs font-bold uppercase tracking-widest border-l border-[#030213] transition-none ${
            type === "income" ? "bg-[#030213] text-[#f5f5f2]" : "bg-transparent text-[#030213]"
          }`}
        >
          INCOME
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-mono text-[10px] text-gray-500 mb-1.5 uppercase tracking-widest">
            VAL_AMOUNT (INR)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-mono text-xs">
              ₹
            </span>
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="0.00"
              step="0.01"
              required
              className="w-full pl-7 pr-3 py-2.5 bg-[#f5f5f2] border border-[#030213] font-mono text-sm text-[#030213] placeholder:text-gray-400 focus:outline-none focus:border-[2px]"
            />
          </div>
        </div>

        <div>
          <label className="block font-mono text-[10px] text-gray-500 mb-1.5 uppercase tracking-widest">
            {type === "expense" ? "VAL_MERCHANT" : "VAL_SOURCE"}
          </label>
          <input
            type="text"
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
            placeholder={type === "expense" ? "e.g. Swiggy" : "e.g. Salary"}
            className="w-full px-3 py-2.5 bg-[#f5f5f2] border border-[#030213] font-mono text-xs text-[#030213] placeholder:text-gray-400 focus:outline-none focus:border-[2px]"
          />
        </div>

        {type === "expense" && (
          <div>
            <label className="block font-mono text-[10px] text-gray-500 mb-1.5 uppercase tracking-widest">
              VAL_CATEGORY
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full px-3 py-2.5 bg-[#f5f5f2] border border-[#030213] font-mono text-xs text-[#030213] focus:outline-none focus:border-[2px] rounded-none appearance-none"
              style={{ backgroundImage: `url("data:image/svg+xml;utf8,<svg fill='black' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/><path d='M0 0h24v24H0z' fill='none'/></svg>")`, backgroundPosition: 'calc(100% - 10px) 50%', backgroundRepeat: 'no-repeat' }}
            >
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 mt-2 bg-[#030213] text-[#f5f5f2] border border-[#030213] font-mono text-xs font-bold uppercase tracking-widest hover:bg-[#f5f5f2] hover:text-[#030213] disabled:opacity-50 transition-none"
        >
          {isSubmitting ? "COMMIT_TRANSACTION..." : "[ SAVE RECORD ]"}
        </button>
      </form>
    </div>
  );
}
