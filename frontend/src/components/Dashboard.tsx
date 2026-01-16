import React, { useEffect, useState } from 'react';
import { MetricsCard } from './MetricsCard';
import { TradeList } from './TradeList';
import PriceChart from './PriceChart'; 
import { api } from '../services/api';
import SystemHealth from './SystemHealth';
import { NewsTicker } from './NewsTicker';
import { ClickSpark } from './ClickSpark'; // ✅ 1. IMPORT ADDED

// Defined to match what TradeList expects
interface Trade {
  id: number;
  ticker: string;     
  quantity: number;   
  type: 'BUY' | 'SELL';
  price: number;
  timestamp: string;
}

export const Dashboard: React.FC = () => {
  const [balance, setBalance] = useState<number>(0);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [chartData, setChartData] = useState<any[]>([]); 
  const [activeStock, setActiveStock] = useState<string>('AAPL'); 

  const fetchData = async () => {
    try {
      const portfolio = await api.getPortfolio(1);
      setBalance(Number(portfolio.balance));

      const tradeHistory = await api.getTrades();
      
      // Map backend data to Frontend Component 
      const mappedTrades = tradeHistory.map((t: any) => ({
        id: t.id,
        ticker: t.stockSymbol || t.ticker || 'UNKNOWN', 
        quantity: Number(t.amount || t.quantity || 0),
        type: t.type,
        price: Number(t.price),
        timestamp: t.timestamp
      }));
      
      setTrades(mappedTrades);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); 
    return () => clearInterval(interval);
  }, []);

  // Simulation Engine for Chart
  useEffect(() => {
    const generateInitialData = () => {
      const data = [];
      let price = 150; 
      const now = new Date();
      for (let i = 20; i > 0; i--) {
        const time = new Date(now.getTime() - i * 60000);
        price = price + (Math.random() - 0.5) * 2;
        data.push({
          time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          price: price
        });
      }
      return data;
    };

    setChartData(generateInitialData());

    const chartInterval = setInterval(() => {
      setChartData(prevData => {
        if (prevData.length === 0) return prevData;
        const lastPrice = prevData[prevData.length - 1].price;
        const newPrice = lastPrice + (Math.random() - 0.5) * 3; 
        const newTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const newData = [...prevData.slice(1), { time: newTime, price: newPrice }];
        return newData;
      });
    }, 3000);

    return () => clearInterval(chartInterval);
  }, [activeStock]);

  // 🟢 Gamification Logic: Calculate Rank based on Balance
  const getTraderRank = (currentBalance: number) => {
    const profit = currentBalance - 100000; // Assuming 100k start
    
    // Handle loading state
    if (currentBalance === 0) return { title: "Loading...", emoji: "⏳", color: "text-gray-400" };

    if (profit > 5000) return { title: "Market Maker", emoji: "🐳", color: "text-yellow-400" };
    if (profit > 1000) return { title: "Senior Quant", emoji: "🚀", color: "text-purple-400" };
    if (profit > 100) return { title: "Junior Trader", emoji: "💼", color: "text-blue-400" };
    
    // Default / Loss
    return { title: "Intern", emoji: "👶", color: "text-gray-400" };
  };

  const rank = getTraderRank(balance);

  // 🟢 REPLACED RETURN STATEMENT WITH PRO LAYOUT
  return (
    <div className="min-h-screen bg-[#0a0e17] text-gray-100 font-sans selection:bg-blue-500 selection:text-white relative">
      
      {/* ✅ 2. CLICK SPARK COMPONENT ADDED */}
      <ClickSpark />

      {/* 1. The Pro Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#0a0e17]/80 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          
          {/* Logo Section */}
          <div className="flex items-center gap-4">
            <div className="p-2 bg-blue-600/20 rounded-lg border border-blue-500/30">
              <span className="text-2xl">⚡️</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">
                NeuroQuant <span className="text-blue-500">Prime</span>
              </h1>
              <div className="flex items-center gap-2 text-xs text-blue-400 font-mono">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                SYSTEM ONLINE • LOW LATENCY
              </div>
            </div>
          </div>

          {/* Rank Badge (Glass Effect) */}
          <div className={`px-4 py-2 rounded-full border bg-opacity-10 backdrop-blur-md flex items-center gap-3 transition-all duration-500 hover:scale-105 ${rank.color} border-current bg-gray-800`}>
            <span className="text-xl filter drop-shadow-lg">{rank.emoji}</span>
            <div className="flex flex-col">
              <span className="text-xs opacity-70 uppercase tracking-wider">Current Rank</span>
              <span className="text-sm font-bold">{rank.title}</span>
            </div>
          </div>
        </div>

        {/* 2. The News Ticker */}
        <NewsTicker />
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto p-6 space-y-8">
        <SystemHealth />
        
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <MetricsCard 
            title="Portfolio Value" 
            value={`$${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}`} 
            trend="up"
            trendValue="+2.4%" 
            isPositive={true}
          />
          <MetricsCard 
            title="Active Signals" 
            value="12" 
            subValue="High Frequency"
            trend="up"
          />
          <MetricsCard 
            title="AI Confidence" 
            value="94.2%" 
            subValue="FinBERT-v2"
            trend="up"
            isPositive={true}
          />
          <MetricsCard 
            title="Execution Latency" 
            value="42ms" 
            subValue="Optimized"
            trend="neutral"
          />
        </div>

        {/* Charts & Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-gray-900/50 rounded-2xl border border-gray-800 p-1 backdrop-blur-sm flex flex-col gap-4">
             <div className="p-4">
                <PriceChart data={chartData} stockSymbol={activeStock} />
             </div>
             
             {/* Stock Selector Buttons */}
             <div className="flex gap-2 px-4 pb-4 overflow-x-auto">
                {['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA'].map(sym => (
                  <button 
                    key={sym}
                    onClick={() => setActiveStock(sym)}
                    className={`px-4 py-2 rounded-lg font-bold text-sm transition-all border ${
                      activeStock === sym 
                      ? 'bg-blue-600/20 text-blue-400 border-blue-500 shadow-lg shadow-blue-500/20' 
                      : 'bg-gray-800/50 text-gray-400 border-gray-700 hover:bg-gray-700'
                    }`}
                  >
                    {sym}
                  </button>
                ))}
             </div>
          </div>

          <div className="bg-gray-900/50 rounded-2xl border border-gray-800 backdrop-blur-sm overflow-hidden flex flex-col">
             <div className="p-4 border-b border-gray-800 bg-gray-900/80 flex justify-between items-center">
               <h3 className="font-bold text-gray-300">Order Flow</h3>
               <span className="text-xs text-gray-500">LIVE</span>
             </div>
             <div className="flex-1 overflow-auto max-h-[500px]">
                <TradeList trades={trades} />
             </div>
          </div>
        </div>
      </main>
    </div>
  );
};