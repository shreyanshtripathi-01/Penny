import { BalanceCards } from './BalanceCards';
import { ExpenseChart } from './ExpenseChart';
import { BudgetProgress } from './BudgetProgress';
import { MagicParser } from './MagicParser';
import { RecentTransactions } from './RecentTransactions';
import { QuickAddTransaction } from './QuickAddTransaction';
import { Transaction } from './types';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

interface DashboardProps {
  userEmail: string;
  userName?: string;
  transactions: Transaction[];
  onAddTransaction: (tx: Omit<Transaction, 'id' | 'date'>) => Promise<void>;
  onDeleteTransaction: (id: string) => void;
  onSaveParsedTransactions: (transactions: Transaction[]) => Promise<void>;
}

export function Dashboard({ 
  userEmail, 
  userName,
  transactions, 
  onAddTransaction, 
  onDeleteTransaction, 
  onSaveParsedTransactions 
}: DashboardProps) {

  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const fmt = (n: number) => `₹${n.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

  const displayName = userName || userEmail.split('@')[0];
  const firstName = displayName.split(' ')[0];

  return (
    <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto pb-12">
      <div>
        <h1 className="text-[28px] text-slate-900 leading-tight" style={{ fontWeight: 700, letterSpacing: "-0.02em" }}>
          {getGreeting()}, {firstName}.
        </h1>
        <p className="text-slate-400 text-[14px] mt-1" style={{ fontWeight: 400 }}>
          You've spent <span className="text-slate-600" style={{ fontWeight: 600 }}>{fmt(totalExpense)}</span> this month — keep tracking to stay on budget.
        </p>
      </div>

      <BalanceCards transactions={transactions} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ExpenseChart transactions={transactions} />
            <BudgetProgress transactions={transactions} />
          </div>
          <RecentTransactions 
            transactions={transactions} 
            onDeleteTransaction={onDeleteTransaction} 
          />
        </div>
        <div className="flex flex-col gap-6">
          <MagicParser onSaveParsedTransactions={onSaveParsedTransactions} />
          <QuickAddTransaction onAddTransaction={onAddTransaction} />
        </div>
      </div>
    </div>
  );
}
