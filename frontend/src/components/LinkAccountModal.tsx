import { useContext, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import { accountApi } from "@/services/api";
import { AlertCircle, CheckCircle, Lock, FileText, X } from "lucide-react";

interface LinkAccountModalProps {
  token: string;
  onAccountLinked: (account: any) => void;
  onClose: () => void;
}

export default function LinkAccountModal({ token, onAccountLinked, onClose }: LinkAccountModalProps) {
  const [step, setStep] = useState<"select" | "link" | "verify">("select");
  const [provider, setProvider] = useState("");
  const [accountEmail, setAccountEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [linkedAccount, setLinkedAccount] = useState<any>(null);

  const providers = ["PayPal", "GCash", "Maya", "Stripe", "Square", "Other"];

  const handleLink = async () => {
    if (!provider || !accountEmail) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const account = await accountApi.link({ provider, accountEmail }, token);
      setLinkedAccount(account.account);
      setStep("verify");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setLoading(true);
    setError("");

    try {
      await accountApi.verifyAgreement(linkedAccount._id, token);
      onAccountLinked({ ...linkedAccount, accountStatus: "active", thirdPartyAgreement: true });
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-96 animate-slide-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Link Account</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
            <X className="w-6 h-6" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {step === "select" && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Select Provider</label>
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Choose a provider...</option>
                {providers.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Account Email</label>
              <input
                type="email"
                value={accountEmail}
                onChange={(e) => setAccountEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <button
              onClick={() => setStep("link")}
              disabled={!provider || !accountEmail}
              className="w-full bg-gradient-to-r from-primary to-purple-600 text-white font-semibold py-2 rounded-lg hover:shadow-lg disabled:opacity-50 transition-all"
            >
              Continue
            </button>
          </div>
        )}

        {step === "link" && (
          <div className="space-y-4">
            <div className="text-center py-6">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Linking your {provider} account...</p>
            </div>

            <button
              onClick={handleLink}
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary to-purple-600 text-white font-semibold py-2 rounded-lg hover:shadow-lg disabled:opacity-50 transition-all"
            >
              {loading ? "Linking..." : "Confirm Link"}
            </button>
          </div>
        )}

        {step === "verify" && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
              <div className="flex items-start gap-3">
                <Lock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-800">
                  <strong>Third-Party Agreement Required</strong>
                  <br />
                  To complete the linking process, you need to authorize the connection to your {provider} account. This allows us to secure access to your account details and transaction history.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-800">
                  By proceeding, you agree to our terms and the third-party API agreement with {provider}.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-700">Account Details:</p>
              <div className="bg-gray-50 p-3 rounded-lg text-sm space-y-1">
                <p><strong>Provider:</strong> {linkedAccount?.provider}</p>
                <p><strong>Email:</strong> {linkedAccount?.accountEmail}</p>
                <p><strong>Status:</strong> <span className="text-yellow-600">Pending Verification</span></p>
              </div>
            </div>

            <button
              onClick={handleVerify}
              disabled={loading}
              className="w-full bg-gradient-to-r from-secondary to-emerald-600 text-white font-semibold py-2 rounded-lg hover:shadow-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-5 h-5" /> {loading ? "Verifying..." : "I Agree & Verify"}
            </button>

            <button
              onClick={() => setStep("select")}
              className="w-full border border-gray-300 text-gray-700 font-semibold py-2 rounded-lg hover:bg-gray-50 transition-all"
            >
              Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
