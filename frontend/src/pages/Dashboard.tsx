import { useContext, useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@/context/AuthContext";
import { transactionApi } from "@/services/api";
import {
  Wallet,
  TrendingUp,
  CreditCard,
  Activity,
  QrCode,
  PlusCircle,
  ArrowUpRight,
  ArrowDownLeft,
  Smartphone,
  MessageCircle,
  Shield,
  Zap,
  Send,
  PiggyBank,
  Banknote,
  Gift,
  Lightbulb
} from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
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

  const QuickActionButton = ({ icon, label, path }: { icon: ReactNode; label: string; path: string }) => (
    <button
      onClick={() => navigate(path)}
      className="flex flex-col items-center justify-center gap-2 rounded-3xl p-4 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors text-slate-900 dark:text-white"
    >
      {icon}
      <p className="text-sm font-medium">{label}</p>
    </button>
  );

  const ServiceCard = ({ icon, title, description, badge }: { icon: ReactNode; title: string; description: string; badge: string }) => (
    <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 hover:border-primary hover:shadow-lg transition-all">
      <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{description}</p>
      <span className="inline-flex px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">{badge}</span>
    </div>
  );

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

      {/* Quick Actions - GCash Style */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
        <QuickActionButton icon={<Send className="w-6 h-6" />} label="Send Money" path="/transfer" />
        <QuickActionButton icon={<QrCode className="w-6 h-6" />} label="QR Code" path="/payment" />
        <QuickActionButton icon={<Smartphone className="w-6 h-6" />} label="Mobile Load" path="/top-up" />
        <QuickActionButton icon={<MessageCircle className="w-6 h-6" />} label="Pay Bills" path="/pay-bills" />
        <QuickActionButton icon={<PiggyBank className="w-6 h-6" />} label="Savings" path="/savings" />
        <QuickActionButton icon={<Shield className="w-6 h-6" />} label="Insurance" path="/" />
      </div>

      {/* Featured Services */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md dark:shadow-lg p-6 md:p-8 border border-slate-200 dark:border-slate-700">
        <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-6">Featured Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ServiceCard
            icon={<Banknote className="w-8 h-8" />}
            title="Personal Loan"
            description="Get instant loans up to ₱500,000"
            badge="Quick Approval"
          />
          <ServiceCard
            icon={<Zap className="w-8 h-8" />}
            title="Buy Load & Promos"
            description="Purchase load & data promos for all networks"
            badge="All Networks"
          />
          <ServiceCard
            icon={<Gift className="w-8 h-8" />}
            title="Rewards Program"
            description="Earn cashback on every transaction"
            badge="Up to 10%"
          />
          <ServiceCard
            icon={<Lightbulb className="w-8 h-8" />}
            title="Financial Tips"
            description="Learn smart money management tips"
            badge="New Tips Daily"
          />
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
