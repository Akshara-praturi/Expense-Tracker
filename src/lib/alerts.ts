import { Budget, Expense } from '../types/expense';

interface Alert {
  type: 'warning' | 'danger';
  message: string;
  category?: string;
}

export function generateAlerts(expenses: Expense[], budgets: Budget[]): Alert[] {
  const alerts: Alert[] = [];
  const categories = [...new Set(expenses.map(e => e.category))];
  
  // Calculate total budget and expenses
  const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalRatio = totalExpenses / totalBudget;

  // Overall budget alerts
  if (totalRatio > 0.9) {
    alerts.push({
      type: 'danger',
      message: `Overall expenses (₹${totalExpenses.toFixed(2)}) have exceeded 90% of total budget (₹${totalBudget.toFixed(2)})`
    });
  } else if (totalRatio > 0.75) {
    alerts.push({
      type: 'warning',
      message: `Overall expenses (₹${totalExpenses.toFixed(2)}) have reached ${(totalRatio * 100).toFixed(1)}% of total budget`
    });
  }

  // Category-wise alerts
  categories.forEach(category => {
    const categoryBudget = budgets.find(b => b.category === category);
    const categoryExpenses = expenses
      .filter(e => e.category === category)
      .reduce((sum, e) => sum + e.amount, 0);

    if (categoryBudget) {
      const ratio = categoryExpenses / categoryBudget.amount;
      
      if (ratio > 1) {
        alerts.push({
          type: 'danger',
          category,
          message: `${category} expenses (₹${categoryExpenses.toFixed(2)}) have exceeded budget by ₹${(categoryExpenses - categoryBudget.amount).toFixed(2)}`
        });
      } else if (ratio > 0.9) {
        alerts.push({
          type: 'danger',
          category,
          message: `${category} expenses (₹${categoryExpenses.toFixed(2)}) have reached ${(ratio * 100).toFixed(1)}% of budget`
        });
      } else if (ratio > 0.75) {
        alerts.push({
          type: 'warning',
          category,
          message: `${category} expenses (₹${categoryExpenses.toFixed(2)}) have reached ${(ratio * 100).toFixed(1)}% of budget`
        });
      }
    } else {
      alerts.push({
        type: 'warning',
        category,
        message: `No budget set for ${category} (Current expenses: ₹${categoryExpenses.toFixed(2)})`
      });
    }
  });

  return alerts;
}