import React from 'react';
import { Edit2, Trash2, Download } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Expense } from '../types/expense';
import { DeleteConfirmationModal } from '../components/expenses/DeleteConfirmationModal';
import { generateExpensesPDF } from '../utils/pdfGenerator';
import { toast } from 'react-hot-toast';

export function ExpenseList() {
  const [expenses, setExpenses] = React.useState<Expense[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [editingExpense, setEditingExpense] = React.useState<Expense | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const [expenseToDelete, setExpenseToDelete] = React.useState<string | null>(null);

  React.useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      setExpenses(data || []);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      toast.error('Failed to load expenses');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setExpenseToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!expenseToDelete) return;
    
    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', expenseToDelete);

      if (error) throw error;

      setExpenses((prev) => prev.filter((expense) => expense.id !== expenseToDelete));
      toast.success('Expense deleted successfully');
      setDeleteModalOpen(false);
    } catch (error) {
      console.error('Error deleting expense:', error);
      toast.error('Failed to delete expense');
    }
  };

  const handleUpdate = async (expense: Expense) => {
    try {
      const { error } = await supabase
        .from('expenses')
        .update({
          amount: expense.amount,
          category: expense.category,
          description: expense.description,
          date: expense.date,
        })
        .eq('id', expense.id);

      if (error) throw error;

      setEditingExpense(null);
      fetchExpenses();
      toast.success('Expense updated successfully');
    } catch (error) {
      console.error('Error updating expense:', error);
      toast.error('Failed to update expense');
    }
  };

  const handleExportPDF = () => {
    try {
      generateExpensesPDF(expenses);
      toast.success('PDF generated successfully');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Expense List</h2>
        <button
          onClick={handleExportPDF}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Download className="h-4 w-4 mr-2" />
          Export PDF
        </button>
      </div>

      <div className="overflow-x-auto">
        <div className="align-middle inline-block min-w-full">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {expenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {editingExpense?.id === expense.id ? (
                        <input
                          type="date"
                          value={editingExpense.date}
                          onChange={(e) =>
                            setEditingExpense({
                              ...editingExpense,
                              date: e.target.value,
                            })
                          }
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      ) : (
                        new Date(expense.date).toLocaleDateString()
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {editingExpense?.id === expense.id ? (
                        <input
                          type="text"
                          value={editingExpense.description}
                          onChange={(e) =>
                            setEditingExpense({
                              ...editingExpense,
                              description: e.target.value,
                            })
                          }
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      ) : (
                        expense.description
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {editingExpense?.id === expense.id ? (
                        <select
                          value={editingExpense.category}
                          onChange={(e) =>
                            setEditingExpense({
                              ...editingExpense,
                              category: e.target.value,
                            })
                          }
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        >
                          {['Housing', 'Transportation', 'Food', 'Utilities', 'Insurance', 'Healthcare', 'Entertainment', 'Other'].map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                      ) : (
                        expense.category
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {editingExpense?.id === expense.id ? (
                        <input
                          type="number"
                          step="0.01"
                          value={editingExpense.amount}
                          onChange={(e) =>
                            setEditingExpense({
                              ...editingExpense,
                              amount: parseFloat(e.target.value),
                            })
                          }
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      ) : (
                        `₹${expense.amount.toFixed(2)}`
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3">
                        {editingExpense?.id === expense.id ? (
                          <>
                            <button
                              onClick={() => handleUpdate(editingExpense)}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingExpense(null)}
                              className="text-gray-600 hover:text-gray-900"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => setEditingExpense(expense)}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(expense.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}