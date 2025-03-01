import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Line } from 'recharts';

interface GaugeChartProps {
  totalBudget: number;
  totalExpenses: number;
}

export function GaugeChart({ totalBudget, totalExpenses }: GaugeChartProps) {
  const ratio = totalExpenses / totalBudget;
  const percentage = Math.min(ratio * 100, 100);
  
  // Create gradient data with more segments for smoother gradient
  const data = Array.from({ length: 36 }, (_, i) => ({
    value: 1,
    color: `hsl(${120 - (i * 3.33)}, 70%, 50%)`
  }));
  
  // Calculate needle angle
  const needleAngle = -180 + (percentage * 1.8);
  
  return (
    <div className="h-80 relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          {/* Gradient gauge */}
          <Pie
            data={data}
            cx="50%"
            cy="100%"
            startAngle={180}
            endAngle={0}
            innerRadius={80}
            outerRadius={120}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          
          {/* Needle */}
          <Line
            x1="50%"
            y1="100%"
            x2={`${50 + Math.cos(needleAngle * Math.PI / 180) * 100}%`}
            y2={`${100 - Math.sin(needleAngle * Math.PI / 180) * 100}%`}
            stroke="#374151"
            strokeWidth={4}
          />
          
          {/* Needle center point */}
          <circle
            cx="50%"
            cy="100%"
            r={6}
            fill="#374151"
          />
        </PieChart>
      </ResponsiveContainer>
      
      <div className="absolute bottom-0 left-0 right-0 text-center mb-4">
        <span className="text-xl font-semibold">
          ₹{totalExpenses.toFixed(0)} / ₹{totalBudget.toFixed(0)}
        </span>
      </div>
    </div>
  );
}