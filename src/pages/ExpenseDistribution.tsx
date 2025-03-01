import React from 'react';
import { ExpenseChart } from '../components/dashboard/ExpenseChart';
import { ExpenseBarChart } from '../components/dashboard/ExpenseBarChart';
import { GaugeChart } from '../components/dashboard/GaugeChart';
import { fetchData } from '../lib/api';
import { Expense, Budget } from '../types/expense';
import { toast } from 'react-hot-toast';

export function ExpenseDistribution() {
  const [expenses, setExpenses] = React.useState<Expense[]>([]);
  const [budgets, setBudgets] = React.useState<Budget[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadData() {
      try {
        const [expensesData, budgetsData] = await Promise.all([
          fetchData<Expense>('expenses', {
            order: { column: 'date', ascending: false }
          }),
          fetchData<Budget>('budgets')
        ]);

        setExpenses(expensesData);
        setBudgets(budgetsData);
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

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

  const totalBudget = React.useMemo(() => 
    budgets.reduce((sum, budget) => sum + budget.amount, 0)
  , [budgets]);

  const totalExpenses = React.useMemo(() => 
    expenses.reduce((sum, expense) => sum + expense.amount, 0)
  , [expenses]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
            Expense Distribution (Pie Chart)
          </h3>
          <ExpenseChart data={chartData} />
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
            Expense Distribution (Bar Chart)
          </h3>
          <ExpenseBarChart data={chartData} />
        </div>
      </div>
      
      <div className="mt-6">
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
            Budget Overview
          </h3>
          <GaugeChart totalBudget={totalBudget} totalExpenses={totalExpenses} />
        </div>
      </div>
    </div>
  );
}