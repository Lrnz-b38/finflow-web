const rawApiUrl = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.toString().trim()
  : "";

const normalizeApiUrl = (url: string) => {
  const cleaned = url.replace(/\/+$/, "");
  return cleaned.endsWith("/api") ? cleaned : `${cleaned}/api`;
};

const isVercelHost = (host: string) =>
  host.endsWith(".vercel.app") || host.includes("vercel") || host.endsWith(".vercel.sh");

const isLocalHost = (host: string) =>
  host.startsWith("localhost") || host.startsWith("127.0.0.1") || host.startsWith("[::1]");

const getDefaultApiBase = () => {
  if (rawApiUrl) {
    const normalized = normalizeApiUrl(rawApiUrl);
    console.log("[API] Using VITE_API_URL:", normalized);
    return normalized;
  }

  if (import.meta.env.MODE === "development") {
    console.warn(
      "[API] VITE_API_URL is not set. Using local proxy /api for development."
    );
    return "/api";
  }

  if (typeof window !== "undefined") {
    const host = window.location.host;
    if (isVercelHost(host)) {
      console.warn(
        "[API] VITE_API_URL is not set. Using Vercel backend path /_/backend/api."
      );
      return "/_/backend/api";
    }

    if (isLocalHost(host)) {
      console.warn(
        "[API] VITE_API_URL is not set. Using same-origin path /api for localhost production build."
      );
      return "/api";
    }

    console.warn(
      "[API] VITE_API_URL is not set. Using same-origin API path /api by default. " +
        "If your backend is deployed elsewhere, set VITE_API_URL to the backend root (without /api)."
    );
    return "/api";
  }

  console.warn(
    "[API] VITE_API_URL is not set and window is undefined. Falling back to /api."
  );
  return "/api";
};

const API_BASE = getDefaultApiBase();

console.log("[API] API_BASE=", API_BASE);

export const apiCall = async (
  endpoint: string,
  method: string = "GET",
  body?: any,
  token?: string
) => {
  const headers: any = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const config: any = {
    method,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE}${endpoint}`, config);
  const text = await response.text();
  let data: any = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!response.ok) {
    throw new Error(data?.error || (typeof data === "string" ? data : "API request failed"));
  }

  return data;

};

// Account related APIs
export const accountApi = {
  getAll: (token: string) => apiCall("/accounts", "GET", undefined, token),
  get: (id: string, token: string) => apiCall(`/accounts/${id}`, "GET", undefined, token),
  link: (data: any, token: string) => apiCall("/accounts/link", "POST", data, token),
  verifyAgreement: (id: string, token: string) =>
    apiCall(`/accounts/${id}/verify-agreement`, "POST", { agree: true }, token),
  updateNickname: (id: string, nickname: string, token: string) =>
    apiCall(`/accounts/${id}/nickname`, "PUT", { nickname }, token),
  unlink: (id: string, token: string) => apiCall(`/accounts/${id}`, "DELETE", undefined, token),
};

// Transaction related APIs
export const transactionApi = {
  getAll: (token: string, accountId?: string) => {
    const query = accountId ? `?accountId=${accountId}` : "";
    return apiCall(`/transactions${query}`, "GET", undefined, token);
  },
  getSummary: (token: string) => apiCall("/transactions/summary", "GET", undefined, token),
  record: (data: any, token: string) => apiCall("/transactions", "POST", data, token),
};

// Chatbot APIs
export const chatbotApi = {
  sendMessage: (message: string, token: string) =>
    apiCall("/chatbot/message", "POST", { message }, token),
};

// Auth APIs
export const authApi = {
  getProfile: (token: string) => apiCall("/auth/me", "GET", undefined, token),
  updateProfile: (data: any, token: string) =>
    apiCall("/auth/profile", "PUT", data, token),
};
