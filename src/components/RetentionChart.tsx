import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { CohortRow } from '../types';

interface RetentionChartProps {
  data: CohortRow[];
}

export const RetentionChart: React.FC<RetentionChartProps> = ({ data }) => {
  // Calculate average retention across all cohorts for each month
  const maxMonths = Math.max(...data.map(d => d.retention.length));
  const averageData = Array.from({ length: maxMonths }).map((_, mIdx) => {
    const values = data
      .map(d => d.retention[mIdx])
      .filter((v): v is number => v !== undefined);
    
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    return {
      month: `M${mIdx}`,
      retention: parseFloat((avg * 100).toFixed(1))
    };
  });

  // Calculate linear regression for trendline
  const n = averageData.length;
  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumXX = 0;

  averageData.forEach((d, i) => {
    sumX += i;
    sumY += d.retention;
    sumXY += i * d.retention;
    sumXX += i * i;
  });

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  const chartData = averageData.map((d, i) => ({
    ...d,
    trend: parseFloat((slope * i + intercept).toFixed(1))
  }));

  return (
    <div className="h-[300px] w-full border border-editorial-black p-4 bg-white">
      <h3 className="text-[10px] font-sans font-black uppercase tracking-widest mb-4 opacity-70">
        Average Decay Projection & Trend
      </h3>
      <ResponsiveContainer width="100%" height="90%">
        <AreaChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
          <XAxis 
            dataKey="month" 
            tick={{ fontSize: 9, fontFamily: 'monospace', fontWeight: 700 }} 
            axisLine={{ stroke: '#141414' }}
          />
          <YAxis 
            domain={[0, 100]} 
            tick={{ fontSize: 9, fontFamily: 'monospace', fontWeight: 700 }} 
            axisLine={{ stroke: '#141414' }}
            unit="%"
          />
          <Tooltip 
            contentStyle={{ 
              borderRadius: '0px', 
              border: '2px solid #141414',
              fontFamily: 'monospace',
              fontSize: '11px',
              backgroundColor: '#F9F7F2'
            }} 
          />
          <Area 
            type="stepAfter" 
            dataKey="retention" 
            name="Actual Average"
            stroke="#141414" 
            fill="#141414" 
            fillOpacity={0.1} 
            strokeWidth={3}
          />
          <Line
            type="monotone"
            dataKey="trend"
            name="Linear Trend"
            stroke="#ef4444"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
