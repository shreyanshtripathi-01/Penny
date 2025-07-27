import React from 'react';
import { MoreHorizontal, ArrowDownRight, ArrowUpRight } from 'lucide-react';

export type Transaction = {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
  type: 'expense' | 'income';
};

const mockTransactions: Transaction[] = [
  { id: '1', description: 'Whole Foods Market', amount: 120.50, date: '2025-07-14', category: 'Groceries', type: 'expense' },
  { id: '2', description: 'Netflix Subscription', amount: 15.99, date: '2025-07-13', category: 'Entertainment', type: 'expense' },
  { id: '3', description: 'Uber Rides', amount: 24.50, date: '2025-07-12', category: 'Transportation', type: 'expense' },
  { id: '4', description: 'Salary Deposit', amount: 3200.00, date: '2025-07-01', category: 'Income', type: 'income' },
];

export default function TransactionTable() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Recent Transactions</h3>
        <button className="text-sm text-blue-600 font-medium hover:text-blue-700">View All</button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th scope="col" className="relative px-6 py-3"><span className="sr-only">Edit</span></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mockTransactions.map((tx) => (
              <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${tx.type === 'expense' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                      {tx.type === 'expense' ? <ArrowDownRight size={16} /> : <ArrowUpRight size={16} />}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{tx.description}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {tx.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-right ${tx.type === 'expense' ? 'text-gray-900' : 'text-green-600'}`}>
                  {tx.type === 'expense' ? '-' : '+'}${tx.amount.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-gray-400 hover:text-gray-500">
                    <MoreHorizontal size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
