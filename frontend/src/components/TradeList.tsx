import React from 'react';
import { ArrowUpRight, ArrowDownRight, Clock } from 'lucide-react';

interface Trade {
  id: number;
  ticker: string;
  type: 'BUY' | 'SELL';
  price: number;
  quantity: number;
  timestamp: string;
}

export function TradeList({ trades }: { trades: Trade[] }) {
  if (trades.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500">
        <Clock className="mx-auto mb-3 opacity-50" size={48} />
        <p>Waiting for AI signals...</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-700 bg-slate-800/50">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-900/50 text-slate-400 uppercase tracking-wider text-xs">
          <tr>
            <th className="px-6 py-4 font-semibold">Signal</th>
            <th className="px-6 py-4 font-semibold">Ticker</th>
            <th className="px-6 py-4 font-semibold">Price</th>
            <th className="px-6 py-4 font-semibold text-right">Time</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700/50">
          {trades.map((trade) => (
            <tr key={trade.id} className="hover:bg-slate-700/30 transition-colors">
              <td className="px-6 py-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  trade.type === 'BUY' 
                    ? 'bg-emerald-500/10 text-emerald-400' 
                    : 'bg-rose-500/10 text-rose-400'
                }`}>
                  {trade.type === 'BUY' ? <ArrowUpRight size={14} className="mr-1" /> : <ArrowDownRight size={14} className="mr-1" />}
                  {trade.type}
                </span>
              </td>
              <td className="px-6 py-4 font-bold text-white">{trade.ticker}</td>
              <td className="px-6 py-4 text-slate-300">${Number(trade.price).toFixed(2)}</td>
              <td className="px-6 py-4 text-right text-slate-500 font-mono">
                {new Date(trade.timestamp).toLocaleTimeString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}