import { useContext, useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { AuthContext } from "@/context/AuthContext";
import {
  LayoutDashboard,
  Wallet,
  History,
  Send,
  MessageCircle,
  Settings,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
  TrendingDown,
} from "lucide-react";
import Chatbot from "@/components/Chatbot";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);

  useEffect(() => {
    if (window.innerWidth >= 768) {
      setSidebarOpen(true);
    }
    const savedTheme = localStorage.getItem("finflow-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const theme = savedTheme ? savedTheme === "dark" : prefersDark;
    setDarkMode(theme);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("finflow-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const toggleTheme = () => setDarkMode((value) => !value);

  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/" },
    { label: "Accounts", icon: Wallet, path: "/accounts" },
    { label: "Transactions", icon: History, path: "/transactions" },
    { label: "Expenses", icon: TrendingDown, path: "/expenses" },
    { label: "Payment", icon: Send, path: "/payment" },
    { label: "Profile", icon: Settings, path: "/profile" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 relative">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 md:static md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:w-64 w-64 bg-gradient-to-b from-primary via-slate-100 to-slate-200 dark:via-slate-950 dark:to-slate-950 text-slate-900 dark:text-white flex flex-col`}
      >
        {/* Logo */}
        <div className="p-4 flex items-center justify-between border-b border-purple-700">
          <div className={`flex items-center gap-3 ${!sidebarOpen && "justify-center w-full"}`}>
            <div className="p-2 bg-white rounded-lg">
              <Wallet className="w-5 h-5 text-primary" />
            </div>
            {sidebarOpen && <span className="font-bold text-lg text-slate-900 dark:text-white">EWallet</span>}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? "bg-white text-primary font-semibold dark:bg-slate-900 dark:text-primary"
                    : "text-slate-900 dark:text-purple-100 hover:bg-slate-100 dark:hover:bg-purple-800"
                } ${!sidebarOpen && "justify-center"}`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Chatbot Button */}
        <div className="p-4 border-t border-purple-700">
          <button
            onClick={() => setShowChatbot(!showChatbot)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-purple-800 ${
              !sidebarOpen && "justify-center"
            }`}
          >
            <MessageCircle className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span>AI Assistant</span>}
          </button>
        </div>

        {/* Logout */}
        <div className="p-4 border-t border-purple-700">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-slate-900 dark:text-slate-100 hover:bg-red-600 ${
              !sidebarOpen && "justify-center"
            }`}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>

        {/* Toggle Sidebar */}
        <div className="p-4 border-t border-purple-700">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center justify-center p-2 hover:bg-purple-800 rounded-lg"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white/90 dark:bg-slate-900/95 border-b border-slate-200 dark:border-slate-800 shadow-sm px-4 py-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen((value) => !value)}
              className="p-2 rounded-2xl bg-slate-800/80 hover:bg-slate-700 transition md:hidden"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{user?.businessName || "FinFlow Dashboard"}</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">Manage payments, accounts, and connected wallets.</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <button
              onClick={toggleTheme}
              className="inline-flex items-center gap-2 rounded-full bg-slate-800/80 px-4 py-2 text-slate-100 hover:bg-slate-700 transition"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              <span className="text-sm">{darkMode ? "Light mode" : "Dark mode"}</span>
            </button>
            <div className="flex items-center gap-3 rounded-2xl bg-slate-800/80 px-4 py-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-green-600 rounded-full flex items-center justify-center text-white font-bold">
                {user?.username?.charAt(0).toUpperCase()}
              </div>
              <div className="text-sm text-slate-100">
                <p className="font-semibold">{user?.firstName} {user?.lastName}</p>
                <p className="text-slate-400">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="p-8">
            {children}
          </div>
        </div>
      </div>

      {/* Chatbot */}
      {showChatbot && <Chatbot onClose={() => setShowChatbot(false)} />}
    </div>
  );
}
