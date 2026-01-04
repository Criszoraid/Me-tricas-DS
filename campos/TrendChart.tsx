import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';

interface TrendChartProps {
  data: any[];
  dataKey: string | string[];
  color?: string | string[];
  height?: number;
  stacked?: boolean;
}

export function TrendChart({ data, dataKey, color = '#3b82f6', height = 200, stacked = false }: TrendChartProps) {
  const isMultiple = Array.isArray(dataKey);
  const colors = Array.isArray(color) ? color : [color];

  if (stacked && isMultiple) {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
          <XAxis 
            dataKey="month" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#9ca3af', fontSize: 12 }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#9ca3af', fontSize: 12 }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              fontSize: '12px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            }}
          />
          {dataKey.map((key, index) => (
            <Bar 
              key={key}
              dataKey={key} 
              fill={colors[index] || colors[0]} 
              stackId="stack"
              radius={index === dataKey.length - 1 ? [8, 8, 0, 0] : undefined}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
        <XAxis 
          dataKey="month" 
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#9ca3af', fontSize: 12 }}
        />
        <YAxis 
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#9ca3af', fontSize: 12 }}
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            fontSize: '12px',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
          }}
        />
        {isMultiple ? (
          dataKey.map((key, index) => (
            <Line 
              key={key}
              type="monotone" 
              dataKey={key} 
              stroke={colors[index] || colors[0]} 
              strokeWidth={3}
              dot={{ fill: colors[index] || colors[0], r: 4, strokeWidth: 0 }}
            />
          ))
        ) : (
          <Line 
            type="monotone" 
            dataKey={dataKey as string} 
            stroke={color as string} 
            strokeWidth={3}
            dot={{ fill: color as string, r: 4, strokeWidth: 0 }}
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  );
}