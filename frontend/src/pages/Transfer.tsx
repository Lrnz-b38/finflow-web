import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@/context/AuthContext";
import { transactionApi } from "@/services/api";
import { ArrowLeft, CreditCard, DollarSign, AlertCircle, CheckCircle, Send } from "lucide-react";

export default function Transfer() {
  const navigate = useNavigate();
  const { token, userCurrency } = useContext(AuthContext);
  const [amount, setAmount] = useState("");
  const [fromAccount, setFromAccount] = useState("");
  const [toAccount, setToAccount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Mock accounts - in real app, fetch from API
  const mockAccounts = [
    { id: "1", provider: "GCash", balance: 1500, currency: "PHP" },
    { id: "2", provider: "Maya", balance: 2500, currency: "PHP" },
    { id: "3", provider: "PayPal", balance: 100, currency: "USD" },
  ];

  const handleTransfer = async () => {
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) {
      setError("Please enter a valid amount");
      return;
    }
    if (!fromAccount) {
      setError("Please select source account");
      return;
    }
    if (!recipient) {
      setError("Please enter recipient details");
      return;
    }

    const selectedFromAccount = mockAccounts.find(acc => acc.id === fromAccount);
    if (selectedFromAccount && numAmount > selectedFromAccount.balance) {
      setError("Insufficient balance");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Create transfer transaction (debit from source)
      await transactionApi.create({
        type: "debit",
        amount: numAmount,
        currency: userCurrency,
        description: `Transfer to ${recipient}: ${description || "No description"}`,
        accountId: fromAccount,
        category: "transfer"
      }, token!);

      // In real app, also create credit transaction for recipient
      setSuccess(true);
      setTimeout(() => {
        navigate("/transactions");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to process transfer");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto p-6">
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-600 dark:text-green-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-green-800 dark:text-green-200 mb-2">Transfer Successful!</h2>
          <p className="text-green-700 dark:text-green-300">
            ${amount} has been sent successfully.
          </p>
          <p className="text-sm text-green-600 dark:text-green-400 mt-2">
            Redirecting to transactions...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Transfer Money</h1>
          <p className="text-slate-600 dark:text-slate-400">Send money to another account</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 space-y-6">
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            From Account
          </label>
          <div className="space-y-2">
            {mockAccounts.map((account) => (
              <label
                key={account.id}
                className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                  fromAccount === account.id
                    ? "border-primary bg-primary/5 dark:bg-primary/10"
                    : "border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
                }`}
              >
                <input
                  type="radio"
                  name="fromAccount"
                  value={account.id}
                  checked={fromAccount === account.id}
                  onChange={(e) => setFromAccount(e.target.value)}
                  className="sr-only"
                />
                <CreditCard className="w-5 h-5 text-slate-600 dark:text-slate-400 mr-3" />
                <div className="flex-1">
                  <p className="font-medium text-slate-900 dark:text-white">{account.provider}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Balance: ${account.balance} {account.currency}
                  </p>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Recipient
          </label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="Phone number, email, or account ID"
            className="w-full px-3 py-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Amount ({userCurrency})
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-3 w-5 h-5 text-slate-400 dark:text-slate-500" />
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              min="0"
              step="0.01"
              className="w-full pl-10 pr-3 py-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Description (Optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What's this transfer for?"
            rows={3}
            className="w-full px-3 py-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          />
        </div>

        <button
          onClick={handleTransfer}
          disabled={loading || !amount || !fromAccount || !recipient}
          className="w-full bg-gradient-to-r from-primary to-green-600 text-white font-semibold py-3 rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Processing...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Transfer ${amount || "0.00"}
            </>
          )}
        </button>
      </div>
    </div>
  );
}