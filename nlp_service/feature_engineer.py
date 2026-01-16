import pandas as pd
import numpy as np
from data_fetcher import fetch_trade_history

def calculate_rsi(series, period=14):
    """
    Calculates Relative Strength Index (RSI) for Sentiment.
    RSI > 70 = Over-optimistic (Potential Drop)
    RSI < 30 = Over-pessimistic (Potential Bounce)
    """
    delta = series.diff()
    gain = (delta.where(delta > 0, 0)).rolling(window=period).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(window=period).mean()

    rs = gain / loss
    rsi = 100 - (100 / (1 + rs))
    return rsi.fillna(50) # Default to neutral if undefined

def enrich_data(df):
    """
    Takes raw trade data and adds ML features (SMA, Momentum, RSI).
    """
    if df.empty:
        return df

    print("🧠 [ENGINEERING] Calculating Sentiment Features...")

    # 1. Sort by Time (Crucial for rolling windows)
    df = df.sort_values(by=['ticker', 'timestamp'])

    # 2. Group by Ticker (So Apple's data doesn't mix with Microsoft's)
    #    We use .transform() to keep the original shape of the DataFrame
    
    # --- FEATURE: SMA (Simple Moving Average) ---
    # "Is current sentiment better than the average of the last 5 trades?"
    df['sentiment_sma_5'] = df.groupby('ticker')['sentimentScore'].transform(
        lambda x: x.rolling(window=5).mean()
    )

    # --- FEATURE: Momentum ---
    # "Did sentiment jump or drop compared to the previous trade?"
    df['sentiment_momentum'] = df.groupby('ticker')['sentimentScore'].transform(
        lambda x: x.diff()
    )

    # --- FEATURE: RSI (Relative Strength Index) ---
    # "Is the sentiment becoming irrational?"
    df['sentiment_rsi'] = df.groupby('ticker')['sentimentScore'].transform(
        lambda x: calculate_rsi(x, period=10)
    )

    # 3. Clean NaN values (Rolling windows create NaNs at the start)
    # We drop the first few rows of each ticker that don't have enough history
    df_clean = df.dropna()

    print(f"✨ [COMPLETE] Features added. Ready rows: {len(df_clean)}")
    return df_clean

if __name__ == "__main__":
    # Test the pipeline
    raw_df = fetch_trade_history()
    if not raw_df.empty:
        processed_df = enrich_data(raw_df)
        
        print("\n--- 🔬 FEATURE PREVIEW (First 5 Rows) ---")
        # Display specific columns to verify calculation
        cols = ['ticker', 'sentimentScore', 'sentiment_sma_5', 'sentiment_momentum', 'sentiment_rsi']
        print(processed_df[cols].head(10).to_string())
        
        # Save to CSV for inspection (optional)
        processed_df.to_csv("training_data_debug.csv", index=False)
        print("\n💾 Saved debug data to 'training_data_debug.csv'")