import { useContext, useEffect, useState, useRef } from "react";
import { AuthContext } from "@/context/AuthContext";
import { authApi } from "@/services/api";
import { User, Mail, Phone, Building2, Save, Camera, X, Fingerprint, Upload, Grid3X3 } from "lucide-react";

export default function Profile() {
  const { token, user, logout } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    businessName: "",
  });
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [pictureError, setPictureError] = useState("");
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [showPictureSelector, setShowPictureSelector] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Predefined profile pictures
  const predefinedPictures = [
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Buster",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Dusty",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Fluffy",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Garfield",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Henry",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Izzy",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Jasper",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Katie",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Luna",
  ];

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
      setProfilePicture(data.profilePicture || null);
      setBiometricEnabled(data.biometricEnabled || false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setPictureError("");

    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setPictureError("Please upload a valid image file (PNG, JPG, JPEG).");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setProfilePicture(event.target?.result as string);
      setShowPictureSelector(false);
    };
    reader.readAsDataURL(file);
  };

  const selectPredefinedPicture = (pictureUrl: string) => {
    setProfilePicture(pictureUrl);
    setPictureError("");
    setShowPictureSelector(false);
  };

  const removeProfilePicture = () => {
    setProfilePicture(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const toggleBiometric = () => {
    setBiometricEnabled(!biometricEnabled);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      await authApi.updateProfile({
        ...formData,
        profilePicture,
        biometricEnabled
      }, token!);
      setMessage("Profile updated successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err: any) {
      setMessage(err.message || "Failed to update profile");
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
    <div className="space-y-8 px-4 md:px-0">
      {/* Profile Picture Header */}
      <div className="bg-gradient-to-r from-primary via-green-500 to-primary rounded-2xl shadow-lg p-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-slate-950/10"></div>
        <div className="relative z-10">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-4 border-white shadow-2xl bg-white dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                {profilePicture ? (
                  <img
                    src={profilePicture}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-16 h-16 text-slate-400 dark:text-slate-500" />
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 flex gap-1">
                <button
                  type="button"
                  onClick={() => setShowPictureSelector(!showPictureSelector)}
                  className="w-10 h-10 bg-white text-primary rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors shadow-lg"
                  title="Choose from gallery"
                >
                  <Grid3X3 className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-10 h-10 bg-white text-primary rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors shadow-lg"
                  title="Upload photo"
                >
                  <Camera className="w-5 h-5" />
                </button>
                {profilePicture && (
                  <button
                    type="button"
                    onClick={removeProfilePicture}
                    className="w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                    title="Remove photo"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Picture Selector */}
          {showPictureSelector && (
            <div className="mb-6 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <h3 className="text-white font-semibold mb-4">Choose a profile picture</h3>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 max-h-48 overflow-y-auto">
                {predefinedPictures.map((pic, index) => (
                  <button
                    key={index}
                    onClick={() => selectPredefinedPicture(pic)}
                    className="w-12 h-12 rounded-full border-2 border-white/50 hover:border-white transition-colors overflow-hidden"
                  >
                    <img
                      src={pic}
                      alt={`Avatar ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
              <div className="mt-4 flex justify-center">
                <button
                  onClick={() => setShowPictureSelector(false)}
                  className="text-white/80 hover:text-white text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <h1 className="text-3xl font-bold text-white mb-2">
            {formData.firstName} {formData.lastName}
          </h1>
          <p className="text-white/90">{user?.email}</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleProfilePictureChange}
            className="hidden"
          />
          {pictureError && (
            <div className="mt-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 text-sm text-red-600 dark:text-red-400">
              {pictureError}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
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

        {/* Biometric Login */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Security</h3>
          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600">
            <div className="flex items-center gap-3">
              <Fingerprint className="w-6 h-6 text-slate-600 dark:text-slate-400" />
              <div>
                <p className="font-medium text-slate-900 dark:text-white">Biometric Login</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Use face recognition or fingerprint to log in
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={biometricEnabled}
                onChange={toggleBiometric}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 dark:peer-focus:ring-primary/25 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>

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
