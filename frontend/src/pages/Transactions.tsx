import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import { transactionApi, accountApi } from "@/services/api";
import { ArrowUpRight, ArrowDownLeft, Filter } from "lucide-react";

export default function Transactions() {
  const { token } = useContext(AuthContext);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAccount, setSelectedAccount] = useState("all");
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    loadData();
  }, [token]);

  const loadData = async () => {
    try {
      const [txData, accData] = await Promise.all([
        transactionApi.getAll(token!),
        accountApi.getAll(token!),
      ]);
      setTransactions(txData);
      setAccounts(accData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter((tx) => {
    if (selectedAccount !== "all" && tx.linkedAccountId._id !== selectedAccount) return false;
    if (filterType !== "all" && tx.type !== filterType) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 px-4 md:px-0">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">Transactions</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">View your transaction history across all accounts</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 flex-wrap">
        <div className="flex items-center gap-2 bg-white dark:bg-slate-800 rounded-lg shadow-md dark:shadow-lg p-4 border border-slate-200 dark:border-slate-700">
          <Filter className="w-5 h-5 text-primary flex-shrink-0" />
          <select
            value={selectedAccount}
            onChange={(e) => setSelectedAccount(e.target.value)}
            className="outline-none cursor-pointer font-medium bg-transparent text-slate-900 dark:text-white"
          >
            <option value="all">All Accounts</option>
            {accounts.map((acc) => (
              <option key={acc._id} value={acc._id}>
                {acc.nickname || acc.provider}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 bg-white dark:bg-slate-800 rounded-lg shadow-md dark:shadow-lg p-4 border border-slate-200 dark:border-slate-700">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="outline-none cursor-pointer font-medium bg-transparent text-slate-900 dark:text-white"
          >
            <option value="all">All Types</option>
            <option value="credit">Credit</option>
            <option value="debit">Debit</option>
            <option value="transfer">Transfer</option>
          </select>
        </div>
      </div>

      {/* Transactions List */}
      <div className="space-y-3 md:space-y-4">
        {filteredTransactions.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md dark:shadow-lg p-12 text-center border border-slate-200 dark:border-slate-700">
            <p className="text-slate-500 dark:text-slate-400">No transactions found</p>
          </div>
        ) : (
          filteredTransactions.map((tx) => (
            <div
              key={tx._id}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-md dark:shadow-lg p-4 md:p-5 hover:shadow-lg dark:hover:shadow-xl transition-all animate-slide-in border border-slate-200 dark:border-slate-700"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3 md:gap-4">
                  <div
                    className={`p-3 rounded-full flex-shrink-0 ${
                      tx.type === "debit"
                        ? "bg-red-100 dark:bg-red-900/30"
                        : tx.type === "credit"
                        ? "bg-green-100 dark:bg-green-900/30"
                        : "bg-blue-100 dark:bg-blue-900/30"
                    }`}
                  >
                    {tx.type === "debit" ? (
                      <ArrowUpRight className="w-5 h-5 text-red-600 dark:text-red-400" />
                    ) : (
                      <ArrowDownLeft className="w-5 h-5 text-green-600 dark:text-green-400" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900 dark:text-white truncate">{tx.description || tx.merchant || "Transaction"}</p>
                    <div className="flex gap-2 mt-1 flex-wrap">
                      <span className="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-slate-700 dark:text-slate-300">
                        {tx.linkedAccountId?.nickname || tx.linkedAccountId?.provider}
                      </span>
                      <span className="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-slate-700 dark:text-slate-300">{tx.category}</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                      {new Date(tx.date).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`text-lg md:text-xl font-bold ${
                      tx.type === "debit" ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"
                    }`}
                  >
                    {tx.type === "debit" ? "-" : "+"} ${tx.amount.toFixed(2)}
                  </p>
                  <p
                    className={`text-xs font-semibold mt-2 px-2 py-1 rounded inline-block ${
                      tx.status === "completed"
                        ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400"
                        : tx.status === "pending"
                        ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400"
                        : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400"
                    }`}
                  >
                    {tx.status.toUpperCase()}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
