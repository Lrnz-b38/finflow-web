import { useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "@/context/AuthContext";
import { Fingerprint, Lock, AlertCircle, Check } from "lucide-react";

export default function PinVerification() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [useBiometric, setUseBiometric] = useState(false);
  const [verificationMethod, setVerificationMethod] = useState<"pin" | "biometric">("pin");

  useEffect(() => {
    // If no user is authenticated, redirect to login
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handlePinChange = (value: string) => {
    if (value.length <= 6 && /^\d*$/.test(value)) {
      setPin(value);
      setError("");
    }
  };

  const handlePinSubmit = async () => {
    if (pin.length !== 6) {
      setError("Please enter a 6-digit PIN");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Simulate PIN verification - in real app, verify with backend
      if (pin === "123456") {
        // PIN is correct, proceed to dashboard
        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        setError("Incorrect PIN. Please try again.");
        setPin("");
      }
    } catch (err: any) {
      setError(err.message || "PIN verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleBiometricAuth = async () => {
    setLoading(true);
    setError("");

    try {
      // Simulate biometric authentication
      if ("BiometricPrompt" in window || "webkitGetUserMedia" in navigator) {
        // Simulate successful biometric authentication
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        setError("Biometric authentication not available on this device");
      }
    } catch (err: any) {
      setError(err.message || "Biometric authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handlePinKeypad = (digit: string) => {
    if (pin.length < 6) {
      handlePinChange(pin + digit);
    }
  };

  const handleBackspace = () => {
    setPin(pin.slice(0, -1));
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 px-4 py-8">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-md border border-slate-200 dark:border-slate-700">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-gradient-to-br from-primary to-green-600 rounded-full mb-4">
            <Lock className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Secure Login</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">Verify your identity to continue</p>
          {user?.firstName && (
            <p className="text-slate-700 dark:text-slate-300 font-semibold mt-2">
              Welcome, {user.firstName}!
            </p>
          )}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Verification Method Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setVerificationMethod("pin")}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
              verificationMethod === "pin"
                ? "bg-primary text-white shadow-lg"
                : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
            }`}
          >
            <Lock className="w-4 h-4 inline mr-2" />
            PIN
          </button>
          <button
            onClick={() => setVerificationMethod("biometric")}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
              verificationMethod === "biometric"
                ? "bg-primary text-white shadow-lg"
                : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
            }`}
          >
            <Fingerprint className="w-4 h-4 inline mr-2" />
            Biometric
          </button>
        </div>

        {/* PIN Verification */}
        {verificationMethod === "pin" && (
          <div className="space-y-6">
            {/* PIN Display */}
            <div className="bg-slate-50 dark:bg-slate-700/50 p-6 rounded-xl border border-slate-200 dark:border-slate-600">
              <p className="text-center text-slate-600 dark:text-slate-400 text-sm mb-4">Enter your 6-digit PIN</p>
              <div className="flex justify-center gap-2">
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <div
                    key={index}
                    className="w-10 h-10 sm:w-12 sm:h-12 bg-white dark:bg-slate-600 border-2 border-slate-300 dark:border-slate-500 rounded-lg flex items-center justify-center text-xl font-bold"
                  >
                    {pin[index] ? "•" : ""}
                  </div>
                ))}
              </div>
            </div>

            {/* Numeric Keypad */}
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
                <button
                  key={digit}
                  onClick={() => handlePinKeypad(digit.toString())}
                  disabled={loading}
                  className="py-3 px-2 bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg font-semibold hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors disabled:opacity-50"
                >
                  {digit}
                </button>
              ))}
              <button
                onClick={() => handlePinKeypad("0")}
                className="col-span-1 py-3 px-2 bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg font-semibold hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors disabled:opacity-50"
              >
                0
              </button>
              <button
                onClick={handleBackspace}
                disabled={pin.length === 0 || loading}
                className="col-span-2 py-3 px-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg font-semibold hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors disabled:opacity-50"
              >
                Delete
              </button>
            </div>

            {/* Verify Button */}
            <button
              onClick={handlePinSubmit}
              disabled={pin.length !== 6 || loading}
              className="w-full bg-gradient-to-r from-primary to-green-600 text-white font-semibold py-3 rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Verifying...
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  Verify PIN
                </>
              )}
            </button>
          </div>
        )}

        {/* Biometric Verification */}
        {verificationMethod === "biometric" && (
          <div className="space-y-6">
            <div className="text-center py-8">
              <div className="inline-block p-6 bg-slate-100 dark:bg-slate-700 rounded-full mb-6 animate-pulse">
                <Fingerprint className="w-12 h-12 text-primary" />
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">
                Place your fingerprint on the sensor or look at your device camera
              </p>
              <button
                onClick={handleBiometricAuth}
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary to-green-600 text-white font-semibold py-3 rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Scanning...
                  </>
                ) : (
                  <>
                    <Fingerprint className="w-5 h-5" />
                    Start Biometric
                  </>
                )}
              </button>
            </div>

            <div className="text-center">
              <button
                onClick={() => setVerificationMethod("pin")}
                className="text-primary hover:text-primary/80 font-medium text-sm"
              >
                Use PIN instead
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <p className="text-center text-slate-600 dark:text-slate-400 text-xs mt-6">
          For security reasons, this login verification is required
        </p>
      </div>
    </div>
  );
}
