import React from 'react';

const HEADLINES = [
  "⚠️ AAPL: AI Sentiment Spike Detected (0.89 Confidence)",
  "🚀 TSLA: Breaking News - Production targets exceeded",
  "📉 FOREX: USD/EUR volatility increasing ahead of Fed talks",
  "💹 SYSTEM: Neural Network re-calibrating weights...",
  "🐳 WHALE ALERT: Large buy order detected in Tech Sector"
];

export const NewsTicker: React.FC = () => {
  return (
    <div className="w-full bg-blue-900/30 border-y border-blue-500/30 overflow-hidden py-2 backdrop-blur-sm">
      <div className="animate-marquee whitespace-nowrap flex gap-10">
        {/* We duplicate the list to create a seamless loop */}
        {[...HEADLINES, ...HEADLINES].map((headline, i) => (
          <span key={i} className="text-blue-200 text-sm font-mono flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
            {headline}
          </span>
        ))}
      </div>
    </div>
  );
};