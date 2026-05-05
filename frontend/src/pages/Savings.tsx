import { useContext, useState, useEffect } from "react";
import { AuthContext } from "@/context/AuthContext";
import { TrendingUp, Target, PiggyBank, Plus, Edit, Trash2, AlertCircle, CheckCircle } from "lucide-react";

interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: string;
}

interface Investment {
  id: string;
  name: string;
  type: string;
  amount: number;
  returns: number;
  risk: 'Low' | 'Medium' | 'High';
  description: string;
}

export default function Savings() {
  const { userCurrency } = useContext(AuthContext);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showInvestModal, setShowInvestModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<SavingsGoal | null>(null);
  const [newGoal, setNewGoal] = useState({
    name: "",
    targetAmount: 0,
    deadline: "",
    category: "Emergency Fund"
  });
  const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(null);

  // Mock data
  useEffect(() => {
    setSavingsGoals([
      {
        id: "1",
        name: "Emergency Fund",
        targetAmount: 50000,
        currentAmount: 15000,
        deadline: "2025-12-31",
        category: "Emergency"
      },
      {
        id: "2",
        name: "Vacation to Japan",
        targetAmount: 100000,
        currentAmount: 25000,
        deadline: "2025-08-15",
        category: "Travel"
      }
    ]);

    setInvestments([
      {
        id: "1",
        name: "High-Yield Savings",
        type: "Savings",
        amount: 50000,
        returns: 5.5,
        risk: "Low",
        description: "Safe savings with competitive interest rates"
      },
      {
        id: "2",
        name: "Balanced Fund",
        type: "Mutual Fund",
        amount: 25000,
        returns: 8.2,
        risk: "Medium",
        description: "Mix of stocks and bonds for moderate growth"
      }
    ]);
  }, []);

  const handleSaveGoal = () => {
    if (!newGoal.name || !newGoal.targetAmount || !newGoal.deadline) return;

    if (editingGoal) {
      setSavingsGoals(goals =>
        goals.map(goal =>
          goal.id === editingGoal.id
            ? { ...goal, ...newGoal }
            : goal
        )
      );
    } else {
      const goal: SavingsGoal = {
        id: Date.now().toString(),
        ...newGoal,
        currentAmount: 0
      };
      setSavingsGoals([...savingsGoals, goal]);
    }

    setNewGoal({ name: "", targetAmount: 0, deadline: "", category: "Emergency Fund" });
    setEditingGoal(null);
    setShowGoalModal(false);
  };

  const handleEditGoal = (goal: SavingsGoal) => {
    setEditingGoal(goal);
    setNewGoal({
      name: goal.name,
      targetAmount: goal.targetAmount,
      deadline: goal.deadline,
      category: goal.category
    });
    setShowGoalModal(true);
  };

  const handleDeleteGoal = (id: string) => {
    setSavingsGoals(goals => goals.filter(goal => goal.id !== id));
  };

  const handleInvest = (investment: Investment) => {
    setSelectedInvestment(investment);
    setShowInvestModal(true);
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-green-500";
    if (progress >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low": return "text-green-600 dark:text-green-400";
      case "Medium": return "text-yellow-600 dark:text-yellow-400";
      case "High": return "text-red-600 dark:text-red-400";
      default: return "text-slate-600 dark:text-slate-400";
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-primary/10 rounded-lg">
          <PiggyBank className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Savings & Investments</h1>
          <p className="text-slate-600 dark:text-slate-400">Grow your money with smart saving and investing</p>
        </div>
      </div>

      {/* Savings Goals */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Target className="w-5 h-5" />
            Savings Goals
          </h2>
          <button
            onClick={() => {
              setEditingGoal(null);
              setNewGoal({ name: "", targetAmount: 0, deadline: "", category: "Emergency Fund" });
              setShowGoalModal(true);
            }}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Goal
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {savingsGoals.map((goal) => {
            const progress = (goal.currentAmount / goal.targetAmount) * 100;
            return (
              <div key={goal.id} className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-slate-900 dark:text-white">{goal.name}</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditGoal(goal)}
                      className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteGoal(goal.id)}
                      className="p-1 text-slate-400 hover:text-red-600 dark:hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">Progress</span>
                    <span className="font-medium text-slate-900 dark:text-white">
                      {goal.currentAmount.toLocaleString()} / {goal.targetAmount.toLocaleString()} {userCurrency}
                    </span>
                  </div>

                  <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(progress)}`}
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    ></div>
                  </div>

                  <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>{progress.toFixed(1)}% complete</span>
                    <span>Due: {new Date(goal.deadline).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Investments */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Your Investments
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {investments.map((investment) => (
            <div key={investment.id} className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 border border-slate-200 dark:border-slate-600">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-slate-900 dark:text-white">{investment.name}</h3>
                <span className={`text-sm font-medium ${getRiskColor(investment.risk)}`}>
                  {investment.risk} Risk
                </span>
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{investment.description}</p>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Invested Amount</span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {investment.amount.toLocaleString()} {userCurrency}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Annual Returns</span>
                  <span className="font-medium text-green-600 dark:text-green-400">
                    {investment.returns}%
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleInvest(investment)}
                className="w-full mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Manage Investment
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600 hover:border-primary hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors text-center">
            <PiggyBank className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="font-medium text-slate-900 dark:text-white">Auto Save</p>
            <p className="text-xs text-slate-600 dark:text-slate-400">Set up automatic savings</p>
          </button>

          <button className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600 hover:border-primary hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors text-center">
            <TrendingUp className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="font-medium text-slate-900 dark:text-white">Invest More</p>
            <p className="text-xs text-slate-600 dark:text-slate-400">Add to investments</p>
          </button>

          <button className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600 hover:border-primary hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors text-center">
            <Target className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="font-medium text-slate-900 dark:text-white">Track Goals</p>
            <p className="text-xs text-slate-600 dark:text-slate-400">Monitor progress</p>
          </button>

          <button className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600 hover:border-primary hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors text-center">
            <CheckCircle className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="font-medium text-slate-900 dark:text-white">Financial Tips</p>
            <p className="text-xs text-slate-600 dark:text-slate-400">Learn to save better</p>
          </button>
        </div>
      </div>

      {/* Savings Goal Modal */}
      {showGoalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                {editingGoal ? "Edit Savings Goal" : "Create Savings Goal"}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Goal Name
                  </label>
                  <input
                    type="text"
                    value={newGoal.name}
                    onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                    placeholder="e.g., Emergency Fund"
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Target Amount ({userCurrency})
                  </label>
                  <input
                    type="number"
                    value={newGoal.targetAmount}
                    onChange={(e) => setNewGoal({ ...newGoal, targetAmount: parseFloat(e.target.value) || 0 })}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Target Date
                  </label>
                  <input
                    type="date"
                    value={newGoal.deadline}
                    onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Category
                  </label>
                  <select
                    value={newGoal.category}
                    onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="Emergency Fund">Emergency Fund</option>
                    <option value="Travel">Travel</option>
                    <option value="Education">Education</option>
                    <option value="Home">Home Purchase</option>
                    <option value="Car">Car Purchase</option>
                    <option value="Retirement">Retirement</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowGoalModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveGoal}
                  disabled={!newGoal.name || !newGoal.targetAmount || !newGoal.deadline}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editingGoal ? "Update Goal" : "Create Goal"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Investment Modal */}
      {showInvestModal && selectedInvestment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Manage {selectedInvestment.name}
              </h3>

              <div className="space-y-4">
                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Current Investment</span>
                    <span className="font-medium text-slate-900 dark:text-white">
                      {selectedInvestment.amount.toLocaleString()} {userCurrency}
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Annual Returns</span>
                    <span className="font-medium text-green-600 dark:text-green-400">
                      {selectedInvestment.returns}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Risk Level</span>
                    <span className={`font-medium ${getRiskColor(selectedInvestment.risk)}`}>
                      {selectedInvestment.risk}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                    Add Money
                  </button>
                  <button className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                    Withdraw
                  </button>
                </div>
              </div>

              <button
                onClick={() => setShowInvestModal(false)}
                className="w-full mt-4 px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}