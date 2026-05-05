import "@/styles/global.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthContext, AuthProvider } from "@/context/AuthContext";
import { useContext, useEffect } from "react";
import { Analytics } from "@vercel/analytics/react";

// Pages
import Login from "@/pages/Auth/Login";
import Register from "@/pages/Auth/Register";
import PinVerification from "@/pages/Auth/PinVerification";
import Dashboard from "@/pages/Dashboard";
import Accounts from "@/pages/Accounts";
import Transactions from "@/pages/Transactions";
import Expenses from "@/pages/Expenses";
import Payment from "@/pages/Payment";
import Profile from "@/pages/Profile";
import Settings from "@/pages/Settings";
import CashIn from "@/pages/CashIn";
import Transfer from "@/pages/Transfer";
import PayBills from "@/pages/PayBills";
import TopUp from "@/pages/TopUp";
import Savings from "@/pages/Savings";

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
          <Route path="/pin-verification" element={<PinVerification />} />
          
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
          
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Settings />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/cash-in"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <CashIn />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/transfer"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Transfer />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/pay-bills"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <PayBills />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/top-up"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <TopUp />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/savings"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Savings />
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
