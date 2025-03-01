import React from 'react';
import { AlertTriangle, AlertOctagon } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Budget, Expense } from '../types/expense';
import { generateAlerts } from '../lib/alerts';
import { toast } from 'react-hot-toast';

interface Alert {
  type: 'warning' | 'danger';
  message: string;
  category?: string;
}

export function AlertsPage() {
  const [alerts, setAlerts] = React.useState<Alert[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [expensesData, budgetsData] = await Promise.all([
        supabase.from('expenses').select('*'),
        supabase.from('budgets').select('*')
      ]);

      if (expensesData.error) throw expensesData.error;
      if (budgetsData.error) throw budgetsData.error;

      const alerts = generateAlerts(expensesData.data || [], budgetsData.data || []);
      setAlerts(alerts);
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
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
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Budget Alerts</h2>
      
      {alerts.length === 0 ? (
        <div className="bg-green-50 p-4 rounded-md">
          <p className="text-green-700">No alerts at this time. Your spending is within budget!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert, index) => (
            <div
              key={index}
              className={`p-4 rounded-md flex items-start space-x-3 ${
                alert.type === 'danger' 
                  ? 'bg-red-50 text-red-700' 
                  : 'bg-orange-50 text-orange-700'
              }`}
            >
              {alert.type === 'danger' ? (
                <AlertOctagon className="h-5 w-5 mt-0.5" />
              ) : (
                <AlertTriangle className="h-5 w-5 mt-0.5" />
              )}
              <div>
                {alert.category && (
                  <h3 className="font-semibold mb-1">{alert.category}</h3>
                )}
                <p>{alert.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}