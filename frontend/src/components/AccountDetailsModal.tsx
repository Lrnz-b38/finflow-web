import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import { transactionApi, accountApi } from "@/services/api";
import { X, CreditCard, TrendingUp, History, DollarSign, Phone, Mail, Edit, Save, Trash2, AlertTriangle } from "lucide-react";
import { convertCurrency, formatCurrency } from "@/utils/currency";
import { useNavigate } from "react-router-dom";

interface AccountDetailsModalProps {
  account: any;
  onClose: () => void;
}

export default function AccountDetailsModal({ account, onClose }: AccountDetailsModalProps) {
  const navigate = useNavigate();
  const { token, userCurrency } = useContext(AuthContext);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    nickname: account.nickname || "",
    accountContact: account.accountContact || "",
  });
  const [showUnlinkConfirm, setShowUnlinkConfirm] = useState(false);
  const [unlinkPassword, setUnlinkPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

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

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleSaveEdit = async () => {
    setSaving(true);
    setMessage("");
    try {
      await accountApi.updateAccount(account._id, editForm, token!);
      setMessage("Account updated successfully!");
      setEditing(false);
      // Update the account in the parent component if needed
      setTimeout(() => setMessage(""), 3000);
    } catch (err: any) {
      setMessage(err.message || "Failed to update account");
    } finally {
      setSaving(false);
    }
  };

  const handleUnlink = async () => {
    if (!unlinkPassword) {
      setMessage("Please enter your password");
      return;
    }
    setSaving(true);
    setMessage("");
    try {
      await accountApi.unlinkAccount(account._id, unlinkPassword, token!);
      setMessage("Account unlinked successfully!");
      setShowUnlinkConfirm(false);
      setTimeout(() => {
        onClose();
        // Refresh accounts in parent component if needed
      }, 2000);
    } catch (err: any) {
      setMessage(err.message || "Failed to unlink account");
    } finally {
      setSaving(false);
    }
  };

  const startEditing = () => {
    setEditForm({
      nickname: account.nickname || "",
      accountContact: account.accountContact || "",
    });
    setEditing(true);
    setMessage("");
  };

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
          <div className="flex items-center gap-2">
            {!editing ? (
              <>
                <button
                  onClick={startEditing}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-slate-600 dark:text-slate-400"
                  title="Edit account"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setShowUnlinkConfirm(true)}
                  className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors text-red-600 dark:text-red-400"
                  title="Unlink account"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </>
            ) : (
              <button
                onClick={handleSaveEdit}
                disabled={saving}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {saving ? "Saving..." : "Save"}
              </button>
            )}
            <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
              <X className="w-6 h-6 text-slate-500 dark:text-slate-400" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {message && (
            <div className={`mb-4 p-4 rounded-lg ${message.includes('successfully') ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400' : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'}`}>
              {message}
            </div>
          )}

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
              {editing ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nickname</label>
                    <input
                      type="text"
                      name="nickname"
                      value={editForm.nickname}
                      onChange={handleEditChange}
                      placeholder="Account nickname"
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      {contactLabel} (Cannot be edited)
                    </label>
                    <input
                      type="text"
                      value={contactValue || ""}
                      disabled
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-600 text-slate-500 dark:text-slate-400 rounded-lg text-sm cursor-not-allowed"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-slate-900 dark:text-white">
                    {contactLabel}: {contactValue || "N/A"}
                  </p>
                  {account.nickname && (
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      Nickname: {account.nickname}
                    </p>
                  )}
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Status: <span className={`font-medium ${account.accountStatus === "active" ? "text-green-600 dark:text-green-400" : "text-yellow-600 dark:text-yellow-400"}`}>
                      {account.accountStatus === "active" ? "Active" : "Pending"}
                    </span>
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => {
                  onClose();
                  navigate('/cash-in');
                }}
                className="bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-900 dark:text-white p-4 rounded-lg transition-colors flex items-center gap-3"
              >
                <TrendingUp className="w-5 h-5" />
                <div className="text-left">
                  <p className="font-semibold">Cash In</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Add money to account</p>
                </div>
              </button>
              <button
                onClick={() => {
                  onClose();
                  navigate('/transfer');
                }}
                className="bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-900 dark:text-white p-4 rounded-lg transition-colors flex items-center gap-3"
              >
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

      {/* Unlink Confirmation Modal */}
      {showUnlinkConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Unlink Account</h3>
              </div>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                Are you sure you want to unlink this account? This action cannot be undone.
              </p>
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Enter your password to confirm
                </label>
                <input
                  type="password"
                  value={unlinkPassword}
                  onChange={(e) => setUnlinkPassword(e.target.value)}
                  placeholder="Your password"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              {message && (
                <p className={`text-sm mb-4 ${message.includes('successfully') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {message}
                </p>
              )}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowUnlinkConfirm(false)}
                  className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUnlink}
                  disabled={saving || !unlinkPassword}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? "Unlinking..." : "Unlink Account"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}