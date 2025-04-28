// components/ProgressPie.tsx
'use client';

import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip
} from 'recharts';

export default function ProgressPie({ completed }: { completed: number }) {
  const COLORS = ['#4f46e5', '#e5e7eb'];
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={[
            { name: 'Completed', value: completed },
            { name: 'Remaining', value: 100 - completed }
          ]}
          cx="50%"
          cy="50%"
          innerRadius={40}
          outerRadius={60}
          dataKey="value"
        >
          <Cell fill={COLORS[0]} />
          <Cell fill={COLORS[1]} />
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}
