import { TrendingUp, TrendingDown } from "lucide-react";
import { Transaction } from "./types";

interface BalanceCardsProps {
  transactions: Transaction[];
}

export function BalanceCards({ transactions }: BalanceCardsProps) {
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const balance = totalIncome - totalExpense;

  const fmt = (n: number) => `₹${n.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
  const [balanceInt, balanceDec] = fmt(Math.abs(balance)).split('.');

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Hero balance card */}
      <div className="md:col-span-2 bg-white rounded-2xl p-7 border border-slate-100">
        <p className="text-[12px] uppercase tracking-widest text-slate-400 mb-3" style={{ fontWeight: 600 }}>
          Total balance
        </p>
        <div className="flex items-end gap-4 mb-5">
          <span
            className={`text-[42px] leading-none ${balance < 0 ? 'text-rose-500' : 'text-slate-900'}`}
            style={{ fontWeight: 700, letterSpacing: "-0.03em" }}
          >
            {balance < 0 ? '−' : ''}{balanceInt}<span className="text-slate-400">.{balanceDec || '00'}</span>
          </span>
          <span
            className="text-emerald-600 text-[13px] mb-1 flex items-center gap-1"
            style={{ fontWeight: 600 }}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            2.4% this month
          </span>
        </div>
        <div className="flex items-center gap-6 pt-4 border-t border-slate-100">
          <div>
            <p className="text-[11px] text-slate-400 uppercase tracking-wider mb-0.5" style={{ fontWeight: 600 }}>
              In
            </p>
            <p className="text-[15px] text-emerald-600" style={{ fontWeight: 600 }}>
              +{fmt(totalIncome)}
            </p>
          </div>
          <div className="w-px h-8 bg-slate-100" />
          <div>
            <p className="text-[11px] text-slate-400 uppercase tracking-wider mb-0.5" style={{ fontWeight: 600 }}>
              Out
            </p>
            <p className="text-[15px] text-slate-800" style={{ fontWeight: 600 }}>
              −{fmt(totalExpense)}
            </p>
          </div>
          <div className="w-px h-8 bg-slate-100" />
          <div>
            <p className="text-[11px] text-slate-400 uppercase tracking-wider mb-0.5" style={{ fontWeight: 600 }}>
              Saved
            </p>
            <p className="text-[15px] text-slate-800" style={{ fontWeight: 600 }}>
              {fmt(Math.max(0, balance))}
            </p>
          </div>
        </div>
      </div>

      {/* Right column: income + expenses stacked */}
      <div className="flex flex-col gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-100 flex-1">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[12px] uppercase tracking-widest text-slate-400 mb-2" style={{ fontWeight: 600 }}>
                Total income
              </p>
              <p className="text-[24px] text-slate-900" style={{ fontWeight: 700, letterSpacing: "-0.02em" }}>
                {fmt(totalIncome).split('.')[0]}
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
            </div>
          </div>
          <p className="text-[12px] text-slate-400 mt-2">+1.2% from September</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 flex-1">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[12px] uppercase tracking-widest text-slate-400 mb-2" style={{ fontWeight: 600 }}>
                Total spend
              </p>
              <p className="text-[24px] text-slate-900" style={{ fontWeight: 700, letterSpacing: "-0.02em" }}>
                {fmt(totalExpense).split('.')[0]}
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center">
              <TrendingDown className="w-4 h-4 text-rose-400" />
            </div>
          </div>
          <p className="text-[12px] text-slate-400 mt-2">↓ 4.5% from last month</p>
        </div>
      </div>
    </div>
  );
}
