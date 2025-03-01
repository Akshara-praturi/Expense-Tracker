import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const COLORS = {
  Housing: '#FF8042',
  Transportation: '#00C49F',
  Food: '#FFBB28',
  Utilities: '#0088FE',
  Insurance: '#8884d8',
  Healthcare: '#82ca9d',
  Entertainment: '#ffc658',
  Other: '#8dd1e1'
};

interface ExpenseBarChartProps {
  data: {
    category: string;
    amount: number;
  }[];
}

export function ExpenseBarChart({ data }: ExpenseBarChartProps) {
  return (
    <div className="h-96 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 40, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="category" 
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis 
            label={{ 
              value: 'Amount (₹)', 
              angle: -90, 
              position: 'insideLeft',
              style: { textAnchor: 'middle' }
            }}
          />
          <Tooltip 
            formatter={(value) => `₹${value}`}
          />
          <Bar 
            dataKey="amount"
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[entry.category as keyof typeof COLORS] || '#8884d8'} 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}