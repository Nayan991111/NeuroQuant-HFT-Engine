export interface Portfolio {
    id: number;
    current_cash: string;
    initial_cash: string;
    user: { id: number; username: string };
}

export interface Trade {
    id: number;
    ticker: string;
    type: 'BUY' | 'SELL';
    quantity: number;
    price: string;
    total_amount: string;
    timestamp: string;
}

export interface SentimentAnalysisResult {
    sentiment: "positive" | "negative" | "neutral";
    confidence: number;
    probabilities: {
        positive: number;
        negative: number;
        neutral: number;
    };
    execution?: {
        status: string;
        trade?: Trade;
    };
}