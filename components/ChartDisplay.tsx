
import React from 'react';
import { ChartType, DataKey } from '../types';

// This tells TypeScript that a 'Recharts' object will be available globally,
// which is true since we're loading it from a CDN in index.html.
declare const Recharts: any;

interface ChartDisplayProps {
  chartType: ChartType;
  data: any[];
  keys: DataKey[] | null;
}

const ChartDisplay: React.FC<ChartDisplayProps> = ({ chartType, data, keys }) => {
  if (!data || data.length === 0) {
    return <div className="text-center text-slate-500">No data to display.</div>;
  }

  const {
    ResponsiveContainer,
    BarChart, Bar,
    LineChart, Line,
    PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  } = Recharts;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-700 p-3 border border-slate-600 rounded-lg shadow-lg">
          <p className="text-slate-200 font-bold">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} style={{ color: entry.color || entry.payload.fill }}>
              {`${entry.name}: ${entry.value.toLocaleString()}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    switch (chartType) {
      case ChartType.BAR:
        return (
          <BarChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
            <XAxis dataKey="name" stroke="#94a3b8" tick={{ fill: '#94a3b8' }} />
            <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8' }} />
            <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(100, 116, 139, 0.3)'}} />
            <Legend wrapperStyle={{ color: '#e2e8f0' }} />
            {keys?.map((key) => (
              <Bar key={key.dataKey} dataKey={key.dataKey} fill={key.color} />
            ))}
          </BarChart>
        );
      case ChartType.LINE:
        return (
          <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
            <XAxis dataKey="name" stroke="#94a3b8" tick={{ fill: '#94a3b8' }} />
            <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8' }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ color: '#e2e8f0' }} />
            {keys?.map((key) => (
              <Line key={key.dataKey} type="monotone" dataKey={key.dataKey} stroke={key.color} strokeWidth={2} activeDot={{ r: 8 }} />
            ))}
          </LineChart>
        );
      case ChartType.PIE:
        return (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius="80%"
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ color: '#e2e8f0' }} />
          </PieChart>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-[450px]">
      <ResponsiveContainer width="100%" height="100%">
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
};

export default ChartDisplay;
