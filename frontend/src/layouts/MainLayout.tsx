import { useContext, useState } from "react";
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
  Home,
} from "lucide-react";
import Chatbot from "@/components/Chatbot";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showChatbot, setShowChatbot] = useState(false);

  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/" },
    { label: "Accounts", icon: Wallet, path: "/accounts" },
    { label: "Transactions", icon: History, path: "/transactions" },
    { label: "Payment", icon: Send, path: "/payment" },
    { label: "Profile", icon: Settings, path: "/profile" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-gradient-to-b from-primary to-purple-900 text-white transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="p-4 flex items-center justify-between border-b border-purple-700">
          <div className={`flex items-center gap-3 ${!sidebarOpen && "justify-center w-full"}`}>
            <div className="p-2 bg-white rounded-lg">
              <Wallet className="w-5 h-5 text-primary" />
            </div>
            {sidebarOpen && <span className="font-bold text-lg">EWallet</span>}
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
                    ? "bg-white text-primary font-semibold"
                    : "hover:bg-purple-800 text-purple-100"
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
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all hover:bg-purple-800 ${
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
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all hover:bg-red-600 text-purple-100 ${
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
        <div className="bg-white shadow-md px-8 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">{user?.businessName || "My Dashboard"}</h2>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-semibold text-gray-800">{user?.firstName} {user?.lastName}</p>
              <p className="text-sm text-gray-600">{user?.email}</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
              {user?.username?.charAt(0).toUpperCase()}
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
