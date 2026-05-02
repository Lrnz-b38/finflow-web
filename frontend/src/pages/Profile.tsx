import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import { authApi } from "@/services/api";
import { User, Mail, Phone, Building2, Save } from "lucide-react";

export default function Profile() {
  const { token, user, logout } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    businessName: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadProfile();
  }, [token]);

  const loadProfile = async () => {
    try {
      const data = await authApi.getProfile(token!);
      setFormData({
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        phoneNumber: data.phoneNumber || "",
        businessName: data.businessName || "",
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      await authApi.updateProfile(formData, token!);
      setMessage("Profile updated successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setSaving(false);
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
    <div className="max-w-2xl mx-auto space-y-8 px-4 md:px-0">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">Profile Settings</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">Manage your account information</p>
      </div>

      {/* Profile Info */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md dark:shadow-lg p-6 md:p-8 border border-slate-200 dark:border-slate-700">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
          <User className="w-6 h-6" /> Account Information
        </h2>

        <div className="space-y-4 mb-6 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600">
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400">Username</p>
            <p className="text-lg font-semibold text-slate-900 dark:text-white">{user?.username}</p>
          </div>
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400">Email</p>
            <p className="text-lg font-semibold text-slate-900 dark:text-white">{user?.email}</p>
          </div>
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400">Member Since</p>
            <p className="text-lg font-semibold text-slate-900 dark:text-white">
              {new Date(user?.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Edit Profile */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md dark:shadow-lg p-6 md:p-8 border border-slate-200 dark:border-slate-700">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Edit Profile</h2>

        {message && (
          <div
            className={`mb-6 p-4 rounded-lg border ${
              message.includes("successfully")
                ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-600 dark:text-green-400"
                : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400"
            }`}
          >
            <p className="text-sm font-semibold">{message}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">First Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-slate-400 dark:text-slate-500" />
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary placeholder-slate-400 dark:placeholder-slate-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary placeholder-slate-400 dark:placeholder-slate-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 w-5 h-5 text-slate-400 dark:text-slate-500" />
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
                className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary placeholder-slate-400 dark:placeholder-slate-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Business Name</label>
            <div className="relative">
              <Building2 className="absolute left-3 top-3 w-5 h-5 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                placeholder="Your Business Inc."
                className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary placeholder-slate-400 dark:placeholder-slate-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-gradient-to-r from-primary to-green-600 text-white font-semibold py-3 rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-5 h-5" /> {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>

      {/* Logout */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md dark:shadow-lg p-6 md:p-8 border border-slate-200 dark:border-slate-700">
        <button
          onClick={() => {
            logout();
            window.location.href = "/login";
          }}
          className="w-full bg-red-500 dark:bg-red-600 hover:bg-red-600 dark:hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition-all"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
