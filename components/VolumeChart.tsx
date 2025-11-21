import React from 'react';
import {
  ComposedChart,
  Bar,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { DataPoint } from '../types';

interface VolumeChartProps {
  data: DataPoint[];
}

export const VolumeChart: React.FC<VolumeChartProps> = ({ data }) => {
  return (
    <div className="w-full h-[400px] bg-white p-4 rounded-xl shadow-sm border border-slate-100">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">
        Supply & Demand: Invitations vs Applications
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
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
            yAxisId="left"
            orientation="left"
            stroke="#64748b" 
            fontSize={12}
            tickLine={false} 
            label={{ value: 'Active Applications', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#94a3b8' } }}
          />
          <YAxis 
            yAxisId="right"
            orientation="right"
            stroke="#6366f1" 
            fontSize={12}
            tickLine={false} 
            label={{ value: 'Invitations Issued', angle: 90, position: 'insideRight', style: { textAnchor: 'middle', fill: '#6366f1' } }}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            itemStyle={{ fontSize: '12px', fontWeight: 500 }}
          />
          <Legend verticalAlign="top" height={36}/>
          
          <Area
            yAxisId="left"
            type="monotone"
            dataKey="applications"
            name="Backlog (Applications)"
            fill="#f1f5f9"
            stroke="#94a3b8"
            strokeWidth={2}
          />
          <Bar
            yAxisId="right"
            dataKey="invitations"
            name="Invitations Issued"
            fill="#6366f1"
            barSize={24}
            radius={[4, 4, 0, 0]}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};