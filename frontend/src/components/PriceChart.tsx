import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface PriceChartProps {
  data: any[];
  stockSymbol: string;
}

const PriceChart: React.FC<PriceChartProps> = ({ data, stockSymbol }) => {
  // Determine color based on trend (green if last price > first price)
  const isUp = data.length > 1 && data[data.length - 1].price >= data[0].price;
  const strokeColor = isUp ? "#10B981" : "#EF4444"; // Tailwind green-500 or red-500
  const fillColor = isUp ? "#10B981" : "#EF4444";

  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center bg-gray-800 rounded-lg border border-gray-700">
        <p className="text-gray-400 animate-pulse">Waiting for market data...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
          {stockSymbol} Live Market
        </h3>
        <span className={`text-sm font-mono ${isUp ? 'text-green-400' : 'text-red-400'}`}>
          ${data[data.length - 1].price.toFixed(2)}
        </span>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={fillColor} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={fillColor} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
            <XAxis 
              dataKey="time" 
              stroke="#9CA3AF" 
              tick={{fontSize: 12}}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              domain={['auto', 'auto']} 
              stroke="#9CA3AF" 
              tick={{fontSize: 12}}
              tickFormatter={(number) => `$${number.toFixed(0)}`}
              tickLine={false}
              axisLine={false}
              width={60}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#fff' }}
              itemStyle={{ color: '#fff' }}
              // FIX: Use 'any' type to bypass strict Recharts union type mismatch
              formatter={(value: any) => [`$${Number(value).toFixed(2)}`, 'Price']}
            />
            <Area 
              type="monotone" 
              dataKey="price" 
              stroke={strokeColor} 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorPrice)" 
              animationDuration={500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PriceChart;