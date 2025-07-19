import DashboardLayout from '@/components/layout/DashboardLayout';
import TransactionTable from '@/components/transactions/TransactionTable';
import TransactionForm from '@/components/transactions/TransactionForm';
import StatementParser from '@/components/transactions/StatementParser';
import DashboardAnalytics from '@/components/analytics/DashboardAnalytics';

export default function Home() {
  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
        
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <KPICard title="Total Spent" amount="$2,450.00" trend="+12% from last month" />
          <KPICard title="Remaining Budget" amount="$550.00" trend="18% of budget left" />
          <KPICard title="Top Category" amount="Food & Dining" trend="$850 spent" />
        </div>

        <DashboardAnalytics />

        <TransactionForm />

        <StatementParser />

        <TransactionTable />
      </div>
    </DashboardLayout>
  );
}

function KPICard({ title, amount, trend }: { title: string; amount: string; trend: string }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className="mt-2 text-3xl font-semibold text-gray-900">{amount}</p>
      <p className="mt-1 text-sm text-gray-500">{trend}</p>
    </div>
  );
}
