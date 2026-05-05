import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@/context/AuthContext";
import { transactionApi } from "@/services/api";
import { ArrowLeft, Receipt, Search, CreditCard, AlertCircle, CheckCircle, Zap, Droplets, Wifi, Phone, Building } from "lucide-react";

interface Biller {
  id: string;
  name: string;
  category: string;
  icon: React.ReactNode;
  description: string;
}

export default function PayBills() {
  const navigate = useNavigate();
  const { token, userCurrency } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBiller, setSelectedBiller] = useState<Biller | null>(null);
  const [accountNumber, setAccountNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedAccount, setSelectedAccount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Mock billers
  const billers: Biller[] = [
    {
      id: "1",
      name: "Meralco",
      category: "Electricity",
      icon: <Zap className="w-6 h-6" />,
      description: "Manila Electric Company"
    },
    {
      id: "2",
      name: "Maynilad",
      category: "Water",
      icon: <Droplets className="w-6 h-6" />,
      description: "West Zone Water Utility"
    },
    {
      id: "3",
      name: "PLDT",
      category: "Internet/Phone",
      icon: <Wifi className="w-6 h-6" />,
      description: "Philippine Long Distance Telephone"
    },
    {
      id: "4",
      name: "Globe",
      category: "Phone",
      icon: <Phone className="w-6 h-6" />,
      description: "Globe Telecom"
    },
    {
      id: "5",
      name: "Smart",
      category: "Phone",
      icon: <Phone className="w-6 h-6" />,
      description: "Smart Communications"
    },
    {
      id: "6",
      name: "Converge ICT",
      category: "Internet",
      icon: <Wifi className="w-6 h-6" />,
      description: "Converge Internet"
    },
    {
      id: "7",
      name: "Sky Cable",
      category: "Cable TV",
      icon: <Building className="w-6 h-6" />,
      description: "Sky Cable Corporation"
    },
    {
      id: "8",
      name: "Landbank",
      category: "Bank",
      icon: <Building className="w-6 h-6" />,
      description: "Land Bank of the Philippines"
    }
  ];

  // Mock accounts
  const mockAccounts = [
    { id: "1", provider: "GCash", balance: 1500, currency: "PHP" },
    { id: "2", provider: "Maya", balance: 2500, currency: "PHP" },
    { id: "3", provider: "PayPal", balance: 100, currency: "USD" },
  ];

  const filteredBillers = billers.filter(biller =>
    biller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    biller.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePayBill = async () => {
    if (!selectedBiller || !accountNumber || !amount || !selectedAccount) {
      setError("Please fill in all fields");
      return;
    }

    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    const selectedFromAccount = mockAccounts.find(acc => acc.id === selectedAccount);
    if (selectedFromAccount && numAmount > selectedFromAccount.balance) {
      setError("Insufficient balance");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await transactionApi.create({
        type: "debit",
        amount: numAmount,
        currency: userCurrency,
        description: `Bill Payment: ${selectedBiller.name} - ${accountNumber}`,
        accountId: selectedAccount,
        category: "bill-payment"
      }, token!);

      setSuccess(true);
      setTimeout(() => {
        navigate("/transactions");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to process bill payment");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto p-6">
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-600 dark:text-green-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-green-800 dark:text-green-200 mb-2">Payment Successful!</h2>
          <p className="text-green-700 dark:text-green-300">
            Your bill payment of ${amount} to {selectedBiller?.name} has been processed.
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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Pay Bills</h1>
          <p className="text-slate-600 dark:text-slate-400">Pay your utility bills and more</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 space-y-6">
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {!selectedBiller ? (
          <>
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                placeholder="Search billers (e.g., Meralco, PLDT, water bill)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Popular Billers */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Popular Billers</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {filteredBillers.slice(0, 8).map((biller) => (
                  <button
                    key={biller.id}
                    onClick={() => setSelectedBiller(biller)}
                    className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600 hover:border-primary hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors text-center"
                  >
                    <div className="text-primary mb-2 flex justify-center">
                      {biller.icon}
                    </div>
                    <p className="font-medium text-slate-900 dark:text-white text-sm">{biller.name}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">{biller.category}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {["Electricity", "Water", "Internet", "Phone", "Cable TV", "Bank"].map((category) => (
                  <button
                    key={category}
                    onClick={() => setSearchTerm(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      searchTerm === category
                        ? "bg-primary text-white"
                        : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Selected Biller */}
            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 border border-slate-200 dark:border-slate-600">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="text-primary">
                    {selectedBiller.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">{selectedBiller.name}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{selectedBiller.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedBiller(null)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Payment Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Account/Reference Number
                </label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="Enter your account number"
                  className="w-full px-3 py-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Amount ({userCurrency})
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
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
              onClick={handlePayBill}
              disabled={loading || !accountNumber || !amount || !selectedAccount}
              className="w-full bg-gradient-to-r from-primary to-green-600 text-white font-semibold py-3 rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Receipt className="w-5 h-5" />
                  Pay Bill - ${amount || "0.00"}
                </>
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
}