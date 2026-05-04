import "@/styles/global.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthContext, AuthProvider } from "@/context/AuthContext";
import { useContext, useEffect } from "react";
import { Analytics } from "@vercel/analytics/react";

// Pages
import Login from "@/pages/Auth/Login";
import Register from "@/pages/Auth/Register";
import Dashboard from "@/pages/Dashboard";
import Accounts from "@/pages/Accounts";
import Transactions from "@/pages/Transactions";
import Expenses from "@/pages/Expenses";
import Payment from "@/pages/Payment";
import Profile from "@/pages/Profile";

// Layout
import MainLayout from "@/layouts/MainLayout";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { token } = useContext(AuthContext);
  return token ? children : <Navigate to="/login" />;
};

function App() {
  useEffect(() => {
    const savedTheme = localStorage.getItem("finflow-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const theme = savedTheme ?? (prefersDark ? "dark" : "light");
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, []);

  return (
    <Router>
      <AuthProvider>
        <Analytics />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/accounts"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Accounts />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/transactions"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Transactions />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/expenses"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Expenses />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/payment"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Payment />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Profile />
                </MainLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
