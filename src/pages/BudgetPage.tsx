import React from 'react';
import { BudgetForm } from '../components/budget/BudgetForm';
import { BudgetTable } from '../components/budget/BudgetTable';
import { Budget } from '../types/expense';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';

export function BudgetPage() {
  const [budgets, setBudgets] = React.useState<Budget[]>([]);
  const [editingBudget, setEditingBudget] = React.useState<Budget | null>(null);
  const [loading, setLoading] = React.useState(true);

  const fetchBudgets = async () => {
    try {
      const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .order('category');

      if (error) throw error;
      setBudgets(data || []);
    } catch (error) {
      toast.error('Failed to load budgets');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchBudgets();
  }, []);

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
        <BudgetForm
          editingBudget={editingBudget}
          onBudgetSaved={() => {
            fetchBudgets();
            setEditingBudget(null);
          }}
          onCancelEdit={() => setEditingBudget(null)}
        />
        <BudgetTable
          budgets={budgets}
          onBudgetDeleted={fetchBudgets}
          onEditBudget={setEditingBudget}
        />
      </div>
    </div>
  );
}