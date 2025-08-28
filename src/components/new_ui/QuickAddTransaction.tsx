import { useState } from "react";
import { Transaction } from "./types";

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
    <div className="bg-white rounded-2xl border border-slate-100 p-6">
      <h3 className="text-[15px] text-slate-800 mb-4" style={{ fontWeight: 600 }}>
        Add a transaction
      </h3>

      <div className="flex gap-1 p-1 bg-slate-100 rounded-lg mb-5">
        <button
          onClick={() => setType("expense")}
          className={`flex-1 py-1.5 rounded-md text-[12px] transition-all ${
            type === "expense" ? "bg-white text-slate-800 shadow-sm" : "text-slate-400"
          }`}
          style={{ fontWeight: 600 }}
        >
          Expense
        </button>
        <button
          onClick={() => setType("income")}
          className={`flex-1 py-1.5 rounded-md text-[12px] transition-all ${
            type === "income" ? "bg-white text-slate-800 shadow-sm" : "text-slate-400"
          }`}
          style={{ fontWeight: 600 }}
        >
          Income
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
        <div>
          <label className="block text-[11px] text-slate-400 mb-1.5 uppercase tracking-wider" style={{ fontWeight: 600 }}>
            Amount
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[14px]" style={{ fontWeight: 500 }}>
              ₹
            </span>
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="0.00"
              step="0.01"
              required
              className="w-full pl-6 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[14px] text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-slate-400 focus:bg-white transition-all"
              style={{ fontWeight: 600, fontFamily: "inherit" }}
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] text-slate-400 mb-1.5 uppercase tracking-wider" style={{ fontWeight: 600 }}>
            {type === "expense" ? "Where?" : "From where?"}
          </label>
          <input
            type="text"
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
            placeholder={type === "expense" ? "Merchant name" : "Source"}
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[13px] text-slate-700 placeholder:text-slate-300 focus:outline-none focus:border-slate-400 focus:bg-white transition-all"
            style={{ fontFamily: "inherit" }}
          />
        </div>

        {type === "expense" && (
          <div>
            <label className="block text-[11px] text-slate-400 mb-1.5 uppercase tracking-wider" style={{ fontWeight: 600 }}>
              Category
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[13px] text-slate-700 focus:outline-none focus:border-slate-400 focus:bg-white transition-all"
            >
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2.5 rounded-xl text-[13px] mt-1 transition-colors disabled:opacity-50"
          style={{
            fontWeight: 600,
            backgroundColor: '#111827',
            color: 'white',
            fontFamily: 'inherit',
          }}
        >
          {isSubmitting ? "Saving..." : "Save transaction"}
        </button>
      </form>
    </div>
  );
}
