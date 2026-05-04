import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import { transactionApi } from "@/services/api";
import { X, CreditCard, TrendingUp, History, DollarSign, Phone, Mail } from "lucide-react";
import { getUserCurrency, convertCurrency, formatCurrency } from "@/utils/currency";

interface AccountDetailsModalProps {
  account: any;
  onClose: () => void;
}

export default function AccountDetailsModal({ account, onClose }: AccountDetailsModalProps) {
  const { token } = useContext(AuthContext);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const userCurrency = getUserCurrency();
  const convertedBalance = convertCurrency(account.balance || 0, account.currency || 'USD', userCurrency);

  useEffect(() => {
    loadAccountTransactions();
  }, [account._id]);

  const loadAccountTransactions = async () => {
    try {
      const data = await transactionApi.getByAccount(account._id, token!);
      setTransactions(data.slice(0, 10)); // Show last 10 transactions
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const isEWallet = ["GCash", "Maya"].includes(account.provider);
  const contactLabel = isEWallet ? "Phone" : "Email";
  const contactValue = isEWallet ? account.accountContact : account.accountEmail || account.accountContact;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CreditCard className="w-6 h-6 text-slate-600 dark:text-slate-400" />
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{account.nickname || account.provider}</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">{isEWallet ? "E-Wallet" : "Payment Provider"}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
            <X className="w-6 h-6 text-slate-500 dark:text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Account Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Account Balance
              </h3>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {formatCurrency(account.balance || 0, account.currency || 'USD')}
              </p>
              {userCurrency !== (account.currency || 'USD') && (
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  ≈ {formatCurrency(convertedBalance, userCurrency)}
                </p>
              )}
            </div>

            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                {isEWallet ? <Phone className="w-5 h-5" /> : <Mail className="w-5 h-5" />}
                Contact Info
              </h3>
              <p className="text-slate-900 dark:text-white">
                {contactLabel}: {contactValue || "N/A"}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Status: <span className={`font-medium ${account.accountStatus === "active" ? "text-green-600 dark:text-green-400" : "text-yellow-600 dark:text-yellow-400"}`}>
                  {account.accountStatus === "active" ? "Active" : "Pending"}
                </span>
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button className="bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-900 dark:text-white p-4 rounded-lg transition-colors flex items-center gap-3">
                <TrendingUp className="w-5 h-5" />
                <div className="text-left">
                  <p className="font-semibold">Cash In</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Add money to account</p>
                </div>
              </button>
              <button className="bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-900 dark:text-white p-4 rounded-lg transition-colors flex items-center gap-3">
                <History className="w-5 h-5" />
                <div className="text-left">
                  <p className="font-semibold">Transfer</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Send money</p>
                </div>
              </button>
            </div>
          </div>

          {/* Recent Transactions */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Recent Transactions</h3>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-slate-600 dark:text-slate-400">Loading transactions...</p>
              </div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-8 text-slate-600 dark:text-slate-400">
                No transactions yet
              </div>
            ) : (
              <div className="space-y-3">
                {transactions.map((tx) => (
                  <div key={tx._id} className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${tx.type === "debit" ? "bg-red-100 dark:bg-red-900/30" : "bg-green-100 dark:bg-green-900/30"}`}>
                        <History className={`w-4 h-4 ${tx.type === "debit" ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}`} />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{tx.description || "Transaction"}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{new Date(tx.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <p className={`font-bold ${tx.type === "debit" ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}`}>
                      {tx.type === "debit" ? "-" : "+"}${tx.amount?.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}