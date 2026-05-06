import React, { createContext, useState, useEffect } from "react";
import { apiCall } from "@/services/api";

const getCurrencyFromCountry = (country: string) => {
  const currencyMap: { [key: string]: string } = {
    PH: 'PHP',
    US: 'USD',
    GB: 'GBP',
    EU: 'EUR',
    SG: 'SGD',
    MY: 'MYR',
    TH: 'THB',
    VN: 'VND',
    ID: 'IDR',
    AU: 'AUD',
    CA: 'CAD',
    JP: 'JPY',
    KR: 'KRW',
    CN: 'CNY',
    HK: 'HKD',
    TW: 'TWD',
  };
  return currencyMap[country] || 'USD';
};

export interface AuthContextType {
  token: string | null;
  user: any | null;
  loading: boolean;
  userCurrency: string;
  pinEnabled: boolean;
  setPinEnabled: (enabled: boolean) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  token: null,
  user: null,
  loading: true,
  userCurrency: 'USD',
  pinEnabled: false,
  setPinEnabled: () => {},
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("token");
  });
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [pinEnabled, setPinEnabled] = useState(() => {
    const stored = localStorage.getItem("pinEnabled");
    console.log("AuthContext - Initializing pinEnabled from localStorage:", stored);
    return stored === "true";
  });

  const userCurrency = user?.country ? getCurrencyFromCountry(user.country) : 'USD';

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  useEffect(() => {
    if (pinEnabled) {
      localStorage.setItem("pinEnabled", "true");
    } else {
      localStorage.removeItem("pinEnabled");
    }
  }, [pinEnabled]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const data = await apiCall("/auth/login", "POST", { email, password });
      setToken(data.token);
      setUser(data.user);
    } finally {
      setLoading(false);
    }
  };

  const register = async (formData: any) => {
    setLoading(true);
    try {
      const data = await apiCall("/auth/register", "POST", formData);
      setToken(data.token);
      setUser(data.user);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setPinEnabled(false);
  };

  return (
    <AuthContext.Provider value={{ token, user, loading, userCurrency, pinEnabled, setPinEnabled, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
