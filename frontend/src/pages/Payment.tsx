import { useContext, useState, useEffect } from "react";
import { AuthContext } from "@/context/AuthContext";
import { accountApi, transactionApi } from "@/services/api";
import { Send, QrCode, AlertCircle } from "lucide-react";
import QRCodeScanner from "@/components/QRCodeScanner";

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
  const [showScanner, setShowScanner] = useState(false);

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

  const handleQRScan = (qrData: string) => {
    try {
      // Parse QR data format: merchant|amount|description
      const [merchant, amount, description] = qrData.split("|");
      setFormData({
        ...formData,
        merchant: merchant || "",
        amount: amount || "",
        description: description || "",
      });
      setSuccess("QR code scanned successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Invalid QR code format");
    }
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
    <div className="w-full space-y-6 px-0">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">Send Payment</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          Send money from any of your linked accounts
        </p>
      </div>

      {/* QR Scanner Modal */}
      {showScanner && (
        <QRCodeScanner onScan={handleQRScan} onClose={() => setShowScanner(false)} />
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment Form */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl shadow-md dark:shadow-lg p-6 md:p-8 border border-slate-200 dark:border-slate-700">
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-green-600 dark:text-green-400">{success}</p>
            </div>
          )}

          {accounts.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-yellow-600 dark:text-yellow-400 mx-auto mb-4" />
              <p className="text-slate-600 dark:text-slate-400">
                No active accounts found. Please link and activate an account first.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Account Selection */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                  Pay From <span className="text-red-600 dark:text-red-400">*</span>
                </label>
                <select
                  value={selectedAccount}
                  onChange={(e) => setSelectedAccount(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
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
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                  Amount <span className="text-red-600 dark:text-red-400">*</span>
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder-slate-400 dark:placeholder-slate-500"
                  required
                />
              </div>

              {/* Merchant */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                  Merchant Name
                </label>
                <input
                  type="text"
                  name="merchant"
                  value={formData.merchant}
                  onChange={handleChange}
                  placeholder="e.g., Starbucks, Amazon"
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder-slate-400 dark:placeholder-slate-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                  Description
                </label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="What is this payment for?"
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder-slate-400 dark:placeholder-slate-500"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="food">Food & Dining</option>
                  <option value="transportation">Transportation</option>
                  <option value="shopping">Shopping</option>
                  <option value="utilities">Utilities</option>
                  <option value="entertainment">Entertainment</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-primary to-green-600 text-white font-semibold py-3 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" /> Send Payment
                </button>
                <button
                  type="button"
                  onClick={() => setShowScanner(true)}
                  className="w-full sm:w-auto px-4 md:px-6 bg-gradient-to-r from-green-600 to-primary text-white font-semibold py-3 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <QrCode className="w-5 h-5" />
                  <span className="hidden sm:inline">Scan QR</span>
                  <span className="sm:hidden">QR</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Sidebar Info Cards */}
        <div className="space-y-4">
          {/* Quick Tips */}
          <div className="bg-gradient-to-br from-primary to-green-600 rounded-2xl shadow-md dark:shadow-lg p-6 text-white">
            <h3 className="text-lg font-semibold mb-4">💡 Quick Tips</h3>
            <ul className="space-y-2 text-sm">
              <li>✓ Use QR code for instant transfers</li>
              <li>✓ Check account balance</li>
              <li>✓ Add payment description</li>
              <li>✓ Select proper category</li>
              <li>✓ Instant across platforms</li>
            </ul>
          </div>

          {/* Features Card */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md dark:shadow-lg p-6 border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              🚀 Features
            </h3>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>🔐 Secure payments</li>
              <li>📱 Mobile-friendly</li>
              <li>🌙 Dark mode</li>
              <li>📊 Track history</li>
              <li>⚡ Real-time updates</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
