import React from 'react';
import { Edit2, Trash2, Save, X } from 'lucide-react';
import { Budget } from '../../types/expense';
import { toast } from 'react-hot-toast';
import { supabase } from '../../lib/supabase';

interface BudgetTableProps {
  budgets: Budget[];
  onBudgetDeleted: () => void;
  onEditBudget: (budget: Budget) => void;
}

export function BudgetTable({ budgets, onBudgetDeleted, onEditBudget }: BudgetTableProps) {
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editAmount, setEditAmount] = React.useState<string>('');
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setShowDeleteConfirm(id);
  };

  const confirmDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('budgets')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Budget deleted successfully');
      onBudgetDeleted();
    } catch (error) {
      toast.error('Failed to delete budget');
    } finally {
      setShowDeleteConfirm(null);
    }
  };

  const handleEdit = (budget: Budget) => {
    setEditingId(budget.id);
    setEditAmount(budget.amount.toString());
  };

  const handleSave = async (budget: Budget) => {
    try {
      const amount = parseFloat(editAmount);
      if (isNaN(amount) || amount < 0) {
        throw new Error('Invalid amount');
      }

      const { error } = await supabase
        .from('budgets')
        .update({ amount })
        .eq('id', budget.id);

      if (error) throw error;

      toast.success('Budget updated successfully');
      onBudgetDeleted(); // Refresh the list
      setEditingId(null);
    } catch (error) {
      toast.error('Failed to update budget');
    }
  };

  return (
    <div className="mt-8">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Current Budget Allocations</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Monthly Budget
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Updated
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {budgets.map((budget) => (
              <tr key={budget.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {budget.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {editingId === budget.id ? (
                    <input
                      type="number"
                      value={editAmount}
                      onChange={(e) => setEditAmount(e.target.value)}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  ) : (
                    `₹${budget.amount.toFixed(2)}`
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(budget.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex space-x-3">
                    {editingId === budget.id ? (
                      <>
                        <button
                          onClick={() => handleSave(budget)}
                          className="text-green-600 hover:text-green-900"
                        >
                          <Save className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEdit(budget)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(budget.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                  {showDeleteConfirm === budget.id && (
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
                      <div className="bg-white rounded-lg p-6 max-w-sm w-full">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                          Confirm Delete
                        </h3>
                        <p className="text-sm text-gray-500 mb-4">
                          Are you sure you want to delete the budget for {budget.category}?
                        </p>
                        <div className="flex justify-end space-x-4">
                          <button
                            onClick={() => setShowDeleteConfirm(null)}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => confirmDelete(budget.id)}
                            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}