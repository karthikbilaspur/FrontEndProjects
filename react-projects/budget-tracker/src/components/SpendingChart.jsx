// src/components/SpendingChart.jsx
import React from 'react';
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from 'recharts';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

function SpendingChart({ data }) {
  if (data.length === 0) {
    return (
      <div className="empty-state" style={{marginTop: '0'}}>
        No expenses to display for this month.
      </div>
    );
  }

  const formatCurrency = (value) => `$${value.toFixed(2)}`;

  return (
    <div className="card" style={{padding: '20px', height: '400px'}}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={150}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={formatCurrency} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default SpendingChart;