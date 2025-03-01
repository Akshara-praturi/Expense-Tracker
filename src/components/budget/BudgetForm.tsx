import React from 'react';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';
import { Budget } from '../../types/expense';

const categories = [
  'Housing',
  'Transportation',
  'Food',
  'Utilities',
  'Insurance',
  'Healthcare',
  'Entertainment',
  'Other'
];

interface BudgetFormProps {
  editingBudget: Budget | null;
  onBudgetSaved: () => void;
  onCancelEdit: () => void;
}

export function BudgetForm({ editingBudget, onBudgetSaved, onCancelEdit }: BudgetFormProps) {
  const [amount, setAmount] = React.useState(editingBudget?.amount.toString() || '');
  const [category, setCategory] = React.useState(editingBudget?.category || categories[0]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('User not authenticated');

      const budgetData = {
        category,
        amount: parseFloat(amount),
        user_id: user.id,
        period: 'monthly'
      };

      // First, delete any existing budget for this category
      if (!editingBudget) {
        const { error: deleteError } = await supabase
          .from('budgets')
          .delete()
          .eq('category', category)
          .eq('user_id', user.id);

        if (deleteError) throw deleteError;
      }

      // Then insert/update the new budget
      const { error } = editingBudget
        ? await supabase
            .from('budgets')
            .update(budgetData)
            .eq('id', editingBudget.id)
        : await supabase
            .from('budgets')
            .insert([budgetData]);

      if (error) throw error;

      toast.success(editingBudget ? 'Budget updated successfully!' : 'Budget set successfully!');
      setAmount('');
      setCategory(categories[0]);
      onBudgetSaved();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium leading-6 text-gray-900">
        {editingBudget ? 'Edit Budget' : 'Set Monthly Budget'}
      </h3>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
            Amount
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        {editingBudget && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
        >
          {editingBudget ? 'Update Budget' : 'Set Budget'}
        </button>
      </div>
    </form>
  );
}