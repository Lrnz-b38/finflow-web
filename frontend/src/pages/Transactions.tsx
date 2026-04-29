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
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-800">Transactions</h1>
        <p className="text-gray-600 mt-2">View your transaction history across all accounts</p>
      </div>

      {/* Filters */}
      <div className="flex gap-4 flex-wrap">
        <div className="flex items-center gap-2 bg-white rounded-lg shadow p-4">
          <Filter className="w-5 h-5 text-primary" />
          <select
            value={selectedAccount}
            onChange={(e) => setSelectedAccount(e.target.value)}
            className="outline-none cursor-pointer font-medium"
          >
            <option value="all">All Accounts</option>
            {accounts.map((acc) => (
              <option key={acc._id} value={acc._id}>
                {acc.nickname || acc.provider}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 bg-white rounded-lg shadow p-4">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="outline-none cursor-pointer font-medium"
          >
            <option value="all">All Types</option>
            <option value="credit">Credit</option>
            <option value="debit">Debit</option>
            <option value="transfer">Transfer</option>
          </select>
        </div>
      </div>

      {/* Transactions List */}
      <div className="space-y-4">
        {filteredTransactions.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <p className="text-gray-500">No transactions found</p>
          </div>
        ) : (
          filteredTransactions.map((tx) => (
            <div
              key={tx._id}
              className="bg-white rounded-xl shadow p-4 hover:shadow-lg transition-shadow animate-slide-in"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className={`p-3 rounded-full ${
                      tx.type === "debit"
                        ? "bg-red-100"
                        : tx.type === "credit"
                        ? "bg-green-100"
                        : "bg-blue-100"
                    }`}
                  >
                    {tx.type === "debit" ? (
                      <ArrowUpRight className="w-5 h-5 text-red-600" />
                    ) : (
                      <ArrowDownLeft className="w-5 h-5 text-green-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{tx.description || tx.merchant || "Transaction"}</p>
                    <div className="flex gap-2 mt-1">
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {tx.linkedAccountId?.nickname || tx.linkedAccountId?.provider}
                      </span>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">{tx.category}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(tx.date).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div>
                  <p
                    className={`text-xl font-bold ${
                      tx.type === "debit" ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {tx.type === "debit" ? "-" : "+"} ${tx.amount.toFixed(2)}
                  </p>
                  <p
                    className={`text-xs font-semibold mt-2 px-2 py-1 rounded ${
                      tx.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : tx.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
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
