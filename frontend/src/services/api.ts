const API_BASE = "/api";

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
