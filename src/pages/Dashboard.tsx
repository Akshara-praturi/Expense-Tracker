import React from 'react';
import { ExpenseChart } from '../components/dashboard/ExpenseChart';
import { BudgetProgressBar } from '../components/dashboard/BudgetProgressBar';
import { GaugeChart } from '../components/dashboard/GaugeChart';
import { supabase } from '../lib/supabase';
import { Expense, Budget } from '../types/expense';
import { toast } from 'react-hot-toast';

export function Dashboard() {
  const [expenses, setExpenses] = React.useState<Expense[]>([]);
  const [budgets, setBudgets] = React.useState<Budget[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [expensesData, budgetsData] = await Promise.all([
        supabase.from('expenses').select('*').order('date', { ascending: false }),
        supabase.from('budgets').select('*')
      ]);

      if (expensesData.error) throw expensesData.error;
      if (budgetsData.error) throw budgetsData.error;

      setExpenses(expensesData.data || []);
      setBudgets(budgetsData.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const totalBudget = React.useMemo(() => 
    budgets.reduce((sum, budget) => sum + budget.amount, 0)
  , [budgets]);

  const totalExpenses = React.useMemo(() => 
    expenses.reduce((sum, expense) => sum + expense.amount, 0)
  , [expenses]);

  const chartData = React.useMemo(() => {
    const categoryTotals = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(categoryTotals).map(([category, amount]) => ({
      category,
      amount,
    }));
  }, [expenses]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Budget Overview</h2>
          <div className="grid grid-cols-1 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <BudgetProgressBar totalBudget={totalBudget} totalExpenses={totalExpenses} />
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <GaugeChart totalBudget={totalBudget} totalExpenses={totalExpenses} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
              Expense Distribution
            </h3>
            <ExpenseChart data={chartData} />
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
              Recent Expenses
            </h3>
            <div className="overflow-hidden">
              <ul className="divide-y divide-gray-200">
                {expenses.slice(0, 5).map((expense) => (
                  <li key={expense.id} className="py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <p className="text-sm font-medium text-gray-900">
                          {expense.description}
                        </p>
                        <p className="text-sm text-gray-500">{expense.category}</p>
                      </div>
                      <div className="flex flex-col items-end">
                        <p className="text-sm font-medium text-gray-900">
                          ₹{expense.amount.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(expense.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}