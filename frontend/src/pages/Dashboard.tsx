import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import { transactionApi } from "@/services/api";
import { Wallet, TrendingUp, CreditCard, Activity } from "lucide-react";

export default function Dashboard() {
  const { token } = useContext(AuthContext);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadSummary();
  }, [token]);

  const loadSummary = async () => {
    try {
      const data = await transactionApi.getSummary(token!);
      setSummary(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's your financial overview</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow animate-slide-in">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Balance</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">
                ${summary?.totalBalance?.toFixed(2) || "0.00"}
              </p>
            </div>
            <div className="p-4 bg-gradient-to-br from-primary to-purple-600 rounded-full">
              <Wallet className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow animate-slide-in">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Linked Accounts</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{summary?.totalAccounts || 0}</p>
              <p className="text-xs text-secondary mt-1">{summary?.activeAccounts} Active</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-secondary to-emerald-600 rounded-full">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow animate-slide-in">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Spent</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">
                ${summary?.totalSpent?.toFixed(2) || "0.00"}
              </p>
            </div>
            <div className="p-4 bg-gradient-to-br from-accent to-yellow-600 rounded-full">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow animate-slide-in">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Recent Activity</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">
                {summary?.recentTransactions?.length || 0}
              </p>
              <p className="text-xs text-gray-500 mt-1">Last 10 transactions</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full">
              <Activity className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-2xl shadow-lg p-6 animate-slide-in">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Recent Transactions</h2>
        {summary?.recentTransactions && summary.recentTransactions.length > 0 ? (
          <div className="space-y-4">
            {summary.recentTransactions.map((tx: any) => (
              <div key={tx._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-full ${tx.type === "debit" ? "bg-red-100" : "bg-green-100"}`}>
                    <Activity className={`w-5 h-5 ${tx.type === "debit" ? "text-red-600" : "text-green-600"}`} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{tx.description || "Transaction"}</p>
                    <p className="text-sm text-gray-500">{new Date(tx.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <p className={`text-lg font-bold ${tx.type === "debit" ? "text-red-600" : "text-green-600"}`}>
                  {tx.type === "debit" ? "-" : "+"} ${tx.amount.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No transactions yet</p>
        )}
      </div>
    </div>
  );
}
