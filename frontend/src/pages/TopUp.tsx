import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@/context/AuthContext";
import { transactionApi } from "@/services/api";
import { ArrowLeft, Smartphone, Gamepad2, CreditCard, AlertCircle, CheckCircle, Plus } from "lucide-react";

interface TopUpProvider {
  id: string;
  name: string;
  category: string;
  icon: React.ReactNode;
  description: string;
  denominations: number[];
}

export default function TopUp() {
  const navigate = useNavigate();
  const { token, userCurrency } = useContext(AuthContext);
  const [selectedProvider, setSelectedProvider] = useState<TopUpProvider | null>(null);
  const [recipientNumber, setRecipientNumber] = useState("");
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [selectedAccount, setSelectedAccount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Mock top-up providers
  const providers: TopUpProvider[] = [
    {
      id: "1",
      name: "GCash",
      category: "E-Wallet",
      icon: <Smartphone className="w-6 h-6" />,
      description: "Load GCash wallet",
      denominations: [100, 200, 300, 500, 1000]
    },
    {
      id: "2",
      name: "Maya",
      category: "E-Wallet",
      icon: <Smartphone className="w-6 h-6" />,
      description: "Load Maya wallet",
      denominations: [100, 200, 300, 500, 1000]
    },
    {
      id: "3",
      name: "Mobile Load",
      category: "Mobile",
      icon: <Smartphone className="w-6 h-6" />,
      description: "Prepaid mobile load",
      denominations: [20, 30, 50, 100, 200, 300, 500]
    },
    {
      id: "4",
      name: "Steam Wallet",
      category: "Gaming",
      icon: <Gamepad2 className="w-6 h-6" />,
      description: "Steam gaming credits",
      denominations: [100, 200, 500, 1000, 2000]
    },
    {
      id: "5",
      name: "Garena",
      category: "Gaming",
      icon: <Gamepad2 className="w-6 h-6" />,
      description: "Garena Shells",
      denominations: [50, 100, 200, 500, 1000]
    },
    {
      id: "6",
      name: "PayPal",
      category: "E-Wallet",
      icon: <CreditCard className="w-6 h-6" />,
      description: "Load PayPal balance",
      denominations: [50, 100, 200, 500, 1000]
    },
    {
      id: "7",
      name: "Coins.ph",
      category: "E-Wallet",
      icon: <Smartphone className="w-6 h-6" />,
      description: "Load Coins.ph wallet",
      denominations: [100, 200, 300, 500, 1000]
    },
    {
      id: "8",
      name: "Mobile Legends",
      category: "Gaming",
      icon: <Gamepad2 className="w-6 h-6" />,
      description: "Mobile Legends diamonds",
      denominations: [50, 100, 200, 500, 1000]
    }
  ];

  // Mock accounts
  const mockAccounts = [
    { id: "1", provider: "GCash", balance: 1500, currency: "PHP" },
    { id: "2", provider: "Maya", balance: 2500, currency: "PHP" },
    { id: "3", provider: "PayPal", balance: 100, currency: "USD" },
  ];

  const handleTopUp = async () => {
    const amount = selectedAmount || parseFloat(customAmount);
    if (!selectedProvider || !recipientNumber || !amount || !selectedAccount) {
      setError("Please fill in all fields");
      return;
    }

    if (!amount || amount <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    const selectedFromAccount = mockAccounts.find(acc => acc.id === selectedAccount);
    if (selectedFromAccount && amount > selectedFromAccount.balance) {
      setError("Insufficient balance");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await transactionApi.create({
        type: "debit",
        amount: amount,
        currency: userCurrency,
        description: `Top-up: ${selectedProvider.name} - ${recipientNumber}`,
        accountId: selectedAccount,
        category: "top-up"
      }, token!);

      setSuccess(true);
      setTimeout(() => {
        navigate("/transactions");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to process top-up");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto p-6">
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-600 dark:text-green-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-green-800 dark:text-green-200 mb-2">Top-up Successful!</h2>
          <p className="text-green-700 dark:text-green-300">
            Your top-up of ${(selectedAmount || parseFloat(customAmount)).toFixed(2)} to {selectedProvider?.name} has been processed.
          </p>
          <p className="text-sm text-green-600 dark:text-green-400 mt-2">
            Redirecting to transactions...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Top Up</h1>
          <p className="text-slate-600 dark:text-slate-400">Load e-wallets, buy mobile load, and more</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 space-y-6">
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {!selectedProvider ? (
          <>
            {/* Categories */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Choose Category</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {["E-Wallet", "Mobile", "Gaming"].map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      const provider = providers.find(p => p.category === category);
                      if (provider) setSelectedProvider(provider);
                    }}
                    className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600 hover:border-primary hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors text-center"
                  >
                    <div className="text-primary mb-2 flex justify-center">
                      {category === "E-Wallet" && <Smartphone className="w-6 h-6" />}
                      {category === "Mobile" && <Smartphone className="w-6 h-6" />}
                      {category === "Gaming" && <Gamepad2 className="w-6 h-6" />}
                    </div>
                    <p className="font-medium text-slate-900 dark:text-white">{category}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Popular Providers */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Popular Providers</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {providers.slice(0, 8).map((provider) => (
                  <button
                    key={provider.id}
                    onClick={() => setSelectedProvider(provider)}
                    className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600 hover:border-primary hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors text-center"
                  >
                    <div className="text-primary mb-2 flex justify-center">
                      {provider.icon}
                    </div>
                    <p className="font-medium text-slate-900 dark:text-white text-sm">{provider.name}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">{provider.category}</p>
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Selected Provider */}
            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 border border-slate-200 dark:border-slate-600">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="text-primary">
                    {selectedProvider.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">{selectedProvider.name}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{selectedProvider.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedProvider(null)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Top-up Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {selectedProvider.category === "Mobile" ? "Mobile Number" : "Recipient/Account Number"}
                </label>
                <input
                  type="text"
                  value={recipientNumber}
                  onChange={(e) => setRecipientNumber(e.target.value)}
                  placeholder={selectedProvider.category === "Mobile" ? "+63 9XX XXX XXXX" : "Enter recipient details"}
                  className="w-full px-3 py-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Amount ({userCurrency})
                </label>

                {/* Preset Amounts */}
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {selectedProvider.denominations.slice(0, 6).map((amount) => (
                    <button
                      key={amount}
                      onClick={() => {
                        setSelectedAmount(amount);
                        setCustomAmount("");
                      }}
                      className={`py-2 px-3 rounded-lg border text-sm font-medium transition-colors ${
                        selectedAmount === amount
                          ? "border-primary bg-primary text-white"
                          : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:border-primary hover:bg-primary/5 dark:hover:bg-primary/10"
                      }`}
                    >
                      {amount}
                    </button>
                  ))}
                </div>

                {/* Custom Amount */}
                <div className="relative">
                  <input
                    type="number"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      setSelectedAmount(null);
                    }}
                    placeholder="Enter custom amount"
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setCustomAmount("")}
                    className="absolute right-2 top-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    <Plus className="w-5 h-5 rotate-45" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Pay from Account
                </label>
                <div className="space-y-2">
                  {mockAccounts.map((account) => (
                    <label
                      key={account.id}
                      className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedAccount === account.id
                          ? "border-primary bg-primary/5 dark:bg-primary/10"
                          : "border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
                      }`}
                    >
                      <input
                        type="radio"
                        name="account"
                        value={account.id}
                        checked={selectedAccount === account.id}
                        onChange={(e) => setSelectedAccount(e.target.value)}
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
            </div>

            <button
              onClick={handleTopUp}
              disabled={loading || !recipientNumber || (!selectedAmount && !customAmount) || !selectedAccount}
              className="w-full bg-gradient-to-r from-primary to-green-600 text-white font-semibold py-3 rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  Top Up - ${(selectedAmount || parseFloat(customAmount || "0")).toFixed(2)}
                </>
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
}