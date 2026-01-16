import React from 'react';

interface MetricsCardProps {
  title: string;
  value: string;
  subValue?: string;           // Added: For "Confidence: 94%" or "Last 24 Hours"
  trend?: "up" | "down" | "neutral"; // Strict direction
  trendValue?: string;         // Added: For the actual text like "+2.5%"
  isPositive?: boolean;
}

export const MetricsCard: React.FC<MetricsCardProps> = ({ 
  title, 
  value, 
  subValue, 
  trend, 
  trendValue, 
  isPositive 
}) => {
  return (
    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg hover:border-gray-600 transition-all">
      <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">{title}</h3>
      
      <div className="flex items-end justify-between">
        <div>
          <span className="text-3xl font-bold text-white">{value}</span>
          {subValue && (
            <p className="text-gray-500 text-xs mt-1">{subValue}</p>
          )}
        </div>

        {(trend || trendValue) && (
          <div className={`flex flex-col items-end ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {trend && (
              <span className="text-lg">
                {trend === 'up' ? '▲' : trend === 'down' ? '▼' : '−'}
              </span>
            )}
            {trendValue && (
              <span className="text-sm font-bold">{trendValue}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricsCard; // Dual export to support both import styles