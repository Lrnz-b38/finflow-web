import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import { accountApi } from "@/services/api";
import { Plus, Trash2, Edit2, CheckCircle, Clock, AlertCircle } from "lucide-react";
import LinkAccountModal from "@/components/LinkAccountModal";

export default function Accounts() {
  const { token } = useContext(AuthContext);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState<any>(null);
  const [newNickname, setNewNickname] = useState("");

  useEffect(() => {
    loadAccounts();
  }, [token]);

  const loadAccounts = async () => {
    try {
      const data = await accountApi.getAll(token!);
      setAccounts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async (id: string) => {
    if (confirm("Are you sure you want to unlink this account?")) {
      try {
        await accountApi.unlink(id, token!);
        setAccounts(accounts.filter(acc => acc._id !== id));
      } catch (err) {
        alert("Failed to unlink account");
      }
    }
  };

  const handleUpdateNickname = async (id: string) => {
    if (newNickname.trim()) {
      try {
        await accountApi.updateNickname(id, newNickname, token!);
        setAccounts(accounts.map(acc =>
          acc._id === id ? { ...acc, nickname: newNickname } : acc
        ));
        setEditingAccount(null);
        setNewNickname("");
      } catch (err) {
        alert("Failed to update nickname");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading accounts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">Linked Accounts</h1>
          <p className="text-gray-600 mt-2">Manage your e-wallet and e-bank accounts</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-gradient-to-r from-primary to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" /> Link Account
        </button>
      </div>

      {showModal && (
        <LinkAccountModal
          token={token!}
          onAccountLinked={(newAccount: any) => {
            setAccounts([...accounts, newAccount]);
            setShowModal(false);
          }}
          onClose={() => setShowModal(false)}
        />
      )}

      {accounts.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center animate-slide-in">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Accounts Linked Yet</h3>
          <p className="text-gray-600 mb-6">Start by linking your first e-wallet or e-bank account</p>
          <button
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-primary to-purple-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all"
          >
            Link Your First Account
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {accounts.map((account, idx) => (
            <div key={account._id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow animate-slide-in">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-gray-800">
                      {account.nickname || account.provider}
                    </h3>
                    {account.accountStatus === "active" ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <Clock className="w-5 h-5 text-yellow-600" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Provider: {account.provider}</p>
                  <p className="text-sm text-gray-600">Email: {account.accountEmail}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    account.accountStatus === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {account.accountStatus.toUpperCase()}
                </span>
              </div>

              <div className="py-4 border-t border-b border-gray-200 mb-4">
                <p className="text-sm text-gray-600">Balance</p>
                <p className="text-3xl font-bold text-primary">
                  ${account.balance.toFixed(2)} <span className="text-lg text-gray-600">{account.currency}</span>
                </p>
              </div>

              {editingAccount === account._id ? (
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={newNickname}
                    onChange={(e) => setNewNickname(e.target.value)}
                    placeholder="Enter nickname"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    onClick={() => handleUpdateNickname(account._id)}
                    className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-opacity-90"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div></div>
              )}

              <div className="flex gap-2">
                {account.accountStatus !== "active" && (
                  <button
                    onClick={async () => {
                      try {
                        await accountApi.verifyAgreement(account._id, token!);
                        setAccounts(accounts.map(acc =>
                          acc._id === account._id
                            ? { ...acc, accountStatus: "active", thirdPartyAgreement: true }
                            : acc
                        ));
                      } catch (err) {
                        alert("Failed to verify agreement");
                      }
                    }}
                    className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 font-semibold"
                  >
                    Verify & Activate
                  </button>
                )}
                {account.accountStatus === "active" && (
                  <button
                    onClick={() => {
                      setEditingAccount(account._id);
                      setNewNickname(account.nickname || "");
                    }}
                    className="flex-1 px-4 py-2 bg-accent text-white rounded-lg hover:bg-opacity-90 flex items-center justify-center gap-2"
                  >
                    <Edit2 className="w-4 h-4" /> Rename
                  </button>
                )}
                <button
                  onClick={() => handleDeleteAccount(account._id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
