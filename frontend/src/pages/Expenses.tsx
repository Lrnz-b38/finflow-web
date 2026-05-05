import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import { transactionApi } from "@/services/api";
import {
  TrendingDown,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  Plus,
  Target,
  Calendar,
  PieChart,
} from "lucide-react";
import { convertCurrency, formatCurrency } from "@/utils/currency";

interface Expense {
  _id: string;
  amount: number;
  currency: string;
  description: string;
  category: string;
  date: string;
  type: "expense" | "income";
}

interface Budget {
  category: string;
  limit: number;
  spent: number;
  currency: string;
}

export default function Expenses() {
  const { token, userCurrency } = useContext(AuthContext);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [newBudget, setNewBudget] = useState({
    category: "",
    limit: 0,
    currency: "USD",
  });

  useEffect(() => {
    loadExpenses();
    loadBudgets();
  }, []);

  const loadExpenses = async () => {
    try {
      const response = await transactionApi.getAll(token);
      const expenseData = response.data.filter((t: any) => t.type === "expense");
      setExpenses(expenseData);
    } catch (error) {
      console.error("Failed to load expenses:", error);
    }
  };

  const loadBudgets = async () => {
    // For now, use localStorage to store budgets
    const savedBudgets = localStorage.getItem("userBudgets");
    if (savedBudgets) {
      setBudgets(JSON.parse(savedBudgets));
    }
    setLoading(false);
  };

  const saveBudget = () => {
    const updatedBudgets = [...budgets, { ...newBudget, spent: 0 }];
    setBudgets(updatedBudgets);
    localStorage.setItem("userBudgets", JSON.stringify(updatedBudgets));
    setNewBudget({ category: "", limit: 0, currency: "USD" });
    setShowBudgetModal(false);
  };

  const totalExpenses = expenses.reduce((sum, expense) => {
    const converted = convertCurrency(expense.amount, expense.currency, userCurrency);
    return sum + converted;
  }, 0);

  const totalIncome = expenses
    .filter((e) => e.type === "income")
    .reduce((sum, expense) => {
      const converted = convertCurrency(expense.amount, expense.currency, userCurrency);
      return sum + converted;
    }, 0);

  const categoryExpenses = expenses.reduce((acc, expense) => {
    const converted = convertCurrency(expense.amount, expense.currency, userCurrency);
    acc[expense.category] = (acc[expense.category] || 0) + converted;
    return acc;
  }, {} as Record<string, number>);

  const budgetAlerts = budgets.filter((budget) => {
    const spent = categoryExpenses[budget.category] || 0;
    const convertedLimit = convertCurrency(budget.limit, budget.currency, userCurrency);
    return spent >= convertedLimit * 0.8; // Alert when 80% of budget is used
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Expense Tracking
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Monitor your spending, set budgets, and track your financial goals
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Total Expenses
              </p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {formatCurrency(totalExpenses, userCurrency)}
              </p>
            </div>
            <TrendingDown className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Total Income
              </p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {formatCurrency(totalIncome, userCurrency)}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Net Balance
              </p>
              <p className={`text-2xl font-bold ${totalIncome - totalExpenses >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {formatCurrency(totalIncome - totalExpenses, userCurrency)}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-slate-600 dark:text-slate-400" />
          </div>
        </div>
      </div>

      {/* Budget Alerts */}
      {budgetAlerts.length > 0 && (
        <div className="mb-8">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">
                Budget Alerts
              </h3>
            </div>
            <div className="space-y-2">
              {budgetAlerts.map((budget, index) => {
                const spent = categoryExpenses[budget.category] || 0;
                const convertedLimit = convertCurrency(budget.limit, budget.currency, userCurrency);
                const percentage = (spent / convertedLimit) * 100;
                return (
                  <p key={index} className="text-sm text-yellow-700 dark:text-yellow-300">
                    You're at {percentage.toFixed(1)}% of your {budget.category} budget
                    ({formatCurrency(spent, userCurrency)} / {formatCurrency(convertedLimit, userCurrency)})
                  </p>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Budgets Section */}
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Target className="w-5 h-5" />
              Budgets
            </h2>
            <button
              onClick={() => setShowBudgetModal(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Budget
            </button>
          </div>

          {budgets.length === 0 ? (
            <p className="text-slate-500 dark:text-slate-400 text-center py-8">
              No budgets set yet. Create your first budget to start tracking!
            </p>
          ) : (
            <div className="space-y-4">
              {budgets.map((budget, index) => {
                const spent = categoryExpenses[budget.category] || 0;
                const convertedLimit = convertCurrency(budget.limit, budget.currency, userCurrency);
                const percentage = Math.min((spent / convertedLimit) * 100, 100);

                return (
                  <div key={index} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-slate-900 dark:text-white">
                        {budget.category}
                      </h3>
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {formatCurrency(spent, userCurrency)} / {formatCurrency(convertedLimit, userCurrency)}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          percentage >= 90 ? 'bg-red-500' : percentage >= 70 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {percentage.toFixed(1)}% used
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Category Breakdown */}
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <PieChart className="w-5 h-5" />
            Spending by Category
          </h2>

          {Object.keys(categoryExpenses).length === 0 ? (
            <p className="text-slate-500 dark:text-slate-400 text-center py-8">
              No expenses recorded yet.
            </p>
          ) : (
            <div className="space-y-4">
              {Object.entries(categoryExpenses)
                .sort(([,a], [,b]) => b - a)
                .map(([category, amount]) => (
                  <div key={category} className="flex justify-between items-center">
                    <span className="text-slate-900 dark:text-white font-medium">
                      {category}
                    </span>
                    <span className="text-slate-600 dark:text-slate-400">
                      {formatCurrency(amount, userCurrency)}
                    </span>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Expenses */}
      <div className="mt-8 bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Recent Transactions
        </h2>

        {expenses.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-400 text-center py-8">
            No transactions recorded yet.
          </p>
        ) : (
          <div className="space-y-4">
            {expenses.slice(0, 10).map((expense) => (
              <div key={expense._id} className="flex justify-between items-center py-3 border-b border-slate-200 dark:border-slate-700 last:border-b-0">
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">
                    {expense.description}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {expense.category} • {new Date(expense.date).toLocaleDateString()}
                  </p>
                </div>
                <span className={`font-semibold ${expense.type === 'expense' ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                  {expense.type === 'expense' ? '-' : '+'}{formatCurrency(expense.amount, expense.currency)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Budget Modal */}
      {showBudgetModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
              Set New Budget
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  value={newBudget.category}
                  onChange={(e) => setNewBudget({ ...newBudget, category: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  placeholder="e.g., Food, Transportation"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Budget Limit
                </label>
                <input
                  type="number"
                  value={newBudget.limit}
                  onChange={(e) => setNewBudget({ ...newBudget, limit: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Currency
                </label>
                <select
                  value={newBudget.currency}
                  onChange={(e) => setNewBudget({ ...newBudget, currency: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                >
                  <option value="USD">USD</option>
                  <option value="PHP">PHP</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowBudgetModal(false)}
                className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveBudget}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Save Budget
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}