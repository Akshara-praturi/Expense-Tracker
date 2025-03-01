import React from 'react';

interface BudgetProgressBarProps {
  totalBudget: number;
  totalExpenses: number;
}

export function BudgetProgressBar({ totalBudget, totalExpenses }: BudgetProgressBarProps) {
  const ratio = totalExpenses / totalBudget;
  const percentage = Math.min((ratio * 100), 100);
  
  const getBarColor = () => {
    if (ratio <= 0.6) return 'bg-green-500';
    if (ratio <= 0.8) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="w-full">
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">Budget Usage</span>
        <span className="text-sm font-medium text-gray-700">{percentage.toFixed(1)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-6">
        <div
          className={`h-full rounded-full transition-all duration-500 ${getBarColor()}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="flex justify-between mt-2">
        <span className="text-sm text-gray-600">₹{totalExpenses.toFixed(2)}</span>
        <span className="text-sm text-gray-600">₹{totalBudget.toFixed(2)}</span>
      </div>
    </div>
  );
}