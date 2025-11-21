import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { DataPoint, VisaSubclass } from '../types';

interface TrendChartProps {
  data: DataPoint[];
}

export const TrendChart: React.FC<TrendChartProps> = ({ data }) => {
  return (
    <div className="w-full h-[400px] bg-white p-4 rounded-xl shadow-sm border border-slate-100">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">
        Minimum Invitation Score (Last 12 Months)
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 0,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis 
            dataKey="month" 
            stroke="#64748b" 
            fontSize={12} 
            tickLine={false}
          />
          <YAxis 
            domain={[60, 100]} 
            stroke="#64748b" 
            fontSize={12}
            tickLine={false} 
            label={{ value: 'Points', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#94a3b8' } }}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            itemStyle={{ fontSize: '12px', fontWeight: 500 }}
          />
          <Legend verticalAlign="top" height={36}/>
          <Line
            type="monotone"
            dataKey="score189"
            name="189 Visa"
            stroke="#2563eb"
            strokeWidth={3}
            activeDot={{ r: 8 }}
            dot={{ r: 4, fill: '#2563eb', strokeWidth: 2 }}
          />
          <Line
            type="monotone"
            dataKey="score190"
            name="190 Visa (NSW/VIC)"
            stroke="#059669"
            strokeWidth={3}
            dot={{ r: 4, fill: '#059669', strokeWidth: 2 }}
          />
          <Line
            type="monotone"
            dataKey="score491"
            name="491 Regional"
            stroke="#d97706"
            strokeWidth={3}
            strokeDasharray="5 5"
            dot={{ r: 4, fill: '#d97706', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};