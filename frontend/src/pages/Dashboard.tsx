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
          <p className="mt-4 text-slate-600 dark:text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 px-4 md:px-0">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">Welcome back! Here's your financial overview</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md dark:shadow-lg p-6 hover:shadow-lg dark:hover:shadow-xl transition-all animate-slide-in border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Total Balance</p>
              <p className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mt-2">
                ${summary?.totalBalance?.toFixed(2) || "0.00"}
              </p>
            </div>
            <div className="p-3 md:p-4 bg-gradient-to-br from-primary to-green-600 rounded-full flex-shrink-0">
              <Wallet className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md dark:shadow-lg p-6 hover:shadow-lg dark:hover:shadow-xl transition-all animate-slide-in border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Linked Accounts</p>
              <p className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mt-2">{summary?.totalAccounts || 0}</p>
              <p className="text-xs text-primary mt-1">{summary?.activeAccounts} Active</p>
            </div>
            <div className="p-3 md:p-4 bg-gradient-to-br from-primary to-green-600 rounded-full flex-shrink-0">
              <CreditCard className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md dark:shadow-lg p-6 hover:shadow-lg dark:hover:shadow-xl transition-all animate-slide-in border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Total Spent</p>
              <p className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mt-2">
                ${summary?.totalSpent?.toFixed(2) || "0.00"}
              </p>
            </div>
            <div className="p-3 md:p-4 bg-gradient-to-br from-primary to-green-600 rounded-full flex-shrink-0">
              <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md dark:shadow-lg p-6 hover:shadow-lg dark:hover:shadow-xl transition-all animate-slide-in border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Recent Activity</p>
              <p className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mt-2">
                {summary?.recentTransactions?.length || 0}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">Last 10 transactions</p>
            </div>
            <div className="p-3 md:p-4 bg-gradient-to-br from-primary to-green-600 rounded-full flex-shrink-0">
              <Activity className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md dark:shadow-lg p-6 md:p-8 animate-slide-in border border-slate-200 dark:border-slate-700">
        <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-6">Recent Transactions</h2>
        {summary?.recentTransactions && summary.recentTransactions.length > 0 ? (
          <div className="space-y-3 md:space-y-4">
            {summary.recentTransactions.map((tx: any) => (
              <div key={tx._id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition border border-slate-200 dark:border-slate-600">
                <div className="flex items-center gap-3 md:gap-4 mb-3 sm:mb-0">
                  <div className={`p-2 md:p-3 rounded-full flex-shrink-0 ${tx.type === "debit" ? "bg-red-100 dark:bg-red-900/30" : "bg-green-100 dark:bg-green-900/30"}`}>
                    <Activity className={`w-4 h-4 md:w-5 md:h-5 ${tx.type === "debit" ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}`} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white text-sm md:text-base">{tx.description || "Transaction"}</p>
                    <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">{new Date(tx.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <p className={`text-lg font-bold ${tx.type === "debit" ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}`}>
                  {tx.type === "debit" ? "-" : "+"} ${tx.amount.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-500 dark:text-slate-400 text-center py-8">No transactions yet</p>
        )}
      </div>
    </div>
  );
}
