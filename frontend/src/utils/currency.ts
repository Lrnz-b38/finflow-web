// Currency conversion utilities
export const CURRENCY_RATES = {
  USD: 1,
  PHP: 56.5, // Approximate rate
  EUR: 0.85,
  GBP: 0.73,
};

export const getUserCurrency = () => {
  // For now, detect based on timezone or IP, but simplify to PHP for Philippines
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  if (timezone.includes('Asia/Manila')) {
    return 'PHP';
  }
  return 'USD'; // Default
};

export const convertCurrency = (amount: number, from: string, to: string) => {
  const amountInUSD = amount / CURRENCY_RATES[from as keyof typeof CURRENCY_RATES];
  return amountInUSD * CURRENCY_RATES[to as keyof typeof CURRENCY_RATES];
};

export const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};