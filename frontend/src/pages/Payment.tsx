import { useContext, useState, useEffect } from "react";
import { AuthContext } from "@/context/AuthContext";
import { accountApi, transactionApi } from "@/services/api";
import { Send, AlertCircle } from "lucide-react";

export default function Payment() {
  const { token } = useContext(AuthContext);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [formData, setFormData] = useState({
    amount: "",
    merchant: "",
    description: "",
    category: "other",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadAccounts();
  }, [token]);

  const loadAccounts = async () => {
    try {
      const data = await accountApi.getAll(token!);
      setAccounts(data.filter((acc: any) => acc.accountStatus === "active"));
      if (data.length > 0) {
        setSelectedAccount(data[0]._id);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.amount || !selectedAccount) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      await transactionApi.record(
        {
          linkedAccountId: selectedAccount,
          type: "debit",
          amount: parseFloat(formData.amount),
          merchant: formData.merchant,
          description: formData.description,
          category: formData.category,
        },
        token!
      );

      setSuccess("Payment processed successfully!");
      setFormData({ amount: "", merchant: "", description: "", category: "other" });
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-800">Make Payment</h1>
        <p className="text-gray-600 mt-2">Send money from any of your linked accounts</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-600 font-semibold">{success}</p>
          </div>
        )}

        {accounts.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
            <p className="text-gray-600">No active accounts found. Please link and activate an account first.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Account Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Pay From <span className="text-red-600">*</span>
              </label>
              <select
                value={selectedAccount}
                onChange={(e) => setSelectedAccount(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-gray-800"
              >
                {accounts.map((acc) => (
                  <option key={acc._id} value={acc._id}>
                    {acc.nickname || acc.provider} - ${acc.balance.toFixed(2)} {acc.currency}
                  </option>
                ))}
              </select>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Amount <span className="text-red-600">*</span>
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            {/* Merchant */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Merchant Name</label>
              <input
                type="text"
                name="merchant"
                value={formData.merchant}
                onChange={handleChange}
                placeholder="e.g., Starbucks, Amazon"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Description</label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="What is this payment for?"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="food">Food & Dining</option>
                <option value="transportation">Transportation</option>
                <option value="shopping">Shopping</option>
                <option value="utilities">Utilities</option>
                <option value="entertainment">Entertainment</option>
                <option value="other">Other</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-purple-600 text-white font-semibold py-3 rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" /> Process Payment
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
