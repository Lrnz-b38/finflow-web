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
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-800">Profile Settings</h1>
        <p className="text-gray-600 mt-2">Manage your account information</p>
      </div>

      {/* Profile Info */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <User className="w-6 h-6" /> Account Information
        </h2>

        <div className="space-y-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="text-sm text-gray-600">Username</p>
            <p className="text-lg font-semibold text-gray-800">{user?.username}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Email</p>
            <p className="text-lg font-semibold text-gray-800">{user?.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Member Since</p>
            <p className="text-lg font-semibold text-gray-800">
              {new Date(user?.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Edit Profile */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Profile</h2>

        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.includes("successfully")
                ? "bg-green-50 border border-green-200 text-green-600"
                : "bg-red-50 border border-red-200 text-red-600"
            }`}
          >
            <p className="text-sm font-semibold">{message}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Business Name</label>
            <div className="relative">
              <Building2 className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                placeholder="Your Business Inc."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-gradient-to-r from-primary to-purple-600 text-white font-semibold py-3 rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Save className="w-5 h-5" /> {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>

      {/* Logout */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <button
          onClick={() => {
            logout();
            window.location.href = "/login";
          }}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg transition-all"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
