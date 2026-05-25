import React from 'react';
import { Transaction } from '@/app/dashboard/page';

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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Hero balance card */}
      <div className="md:col-span-2 bg-[#f5f5f2] border border-[#030213] p-6 shadow-[4px_4px_0px_0px_#030213] flex flex-col justify-between">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-gray-500 block mb-2">
            [ SYSTEM.BALANCE ]
          </span>
          <div className="flex items-baseline gap-2 mb-4">
            <span
              className={`text-4xl md:text-5xl font-black font-mono tracking-tighter ${balance < 0 ? 'text-[#d4183d]' : 'text-[#030213]'}`}
            >
              {balance < 0 ? '−' : ''}{balanceInt}<span className="text-gray-400 text-2xl">.{balanceDec || '00'}</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 border-t border-[#030213] pt-4 mt-4 gap-4">
          <div className="border-r border-[#030213] pr-2">
            <span className="font-mono text-[9px] uppercase tracking-widest text-gray-500 block mb-1">
              SYS.INFLOW
            </span>
            <span className="text-sm font-black font-mono text-[#10b981] truncate block">
              +{fmt(totalIncome).split('.')[0]}
            </span>
          </div>
          <div className="border-r border-[#030213] pr-2">
            <span className="font-mono text-[9px] uppercase tracking-widest text-gray-500 block mb-1">
              SYS.OUTFLOW
            </span>
            <span className="text-sm font-black font-mono text-[#d4183d] truncate block">
              −{fmt(totalExpense).split('.')[0]}
            </span>
          </div>
          <div>
            <span className="font-mono text-[9px] uppercase tracking-widest text-gray-500 block mb-1">
              SYS.SURPLUS
            </span>
            <span className="text-sm font-black font-mono text-[#030213] truncate block">
              {fmt(Math.max(0, balance)).split('.')[0]}
            </span>
          </div>
        </div>
      </div>

      {/* Stacked statistics */}
      <div className="flex flex-col gap-6">
        <div className="bg-[#f5f5f2] border border-[#030213] p-4 flex flex-col justify-between hover:bg-[#030213] hover:text-[#f5f5f2] group transition-none">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-gray-500 group-hover:text-gray-400 block mb-1">
              INFLOW_TOTAL
            </span>
            <span className="text-2xl font-black font-mono text-[#10b981]">
              +{fmt(totalIncome).split('.')[0]}
            </span>
          </div>
          <span className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mt-2 block">
            LEDGER SECURE // 100% OK
          </span>
        </div>

        <div className="bg-[#f5f5f2] border border-[#030213] p-4 flex flex-col justify-between hover:bg-[#030213] hover:text-[#f5f5f2] group transition-none">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-gray-500 group-hover:text-gray-400 block mb-1">
              OUTFLOW_TOTAL
            </span>
            <span className="text-2xl font-black font-mono text-[#d4183d]">
              −{fmt(totalExpense).split('.')[0]}
            </span>
          </div>
          <span className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mt-2 block">
            RATE RATIO // NORMAL
          </span>
        </div>
      </div>
    </div>
  );
}
