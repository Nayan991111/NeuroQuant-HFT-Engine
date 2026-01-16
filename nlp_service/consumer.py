import json
import requests
from kafka import KafkaConsumer
from transformers import pipeline

# --- CONFIGURATION ---
BACKEND_URL = "http://localhost:3001/api/trades"
PORTFOLIO_ID = 1  # Ensure this ID exists in your database!
TRADE_QUANTITY = 10
MOCK_PRICE = 150  # Since we don't have a live price feed yet, we use a fixed price

# 1. Setup FinBERT
print("🧠 Loading FinBERT Model...")
classifier = pipeline("sentiment-analysis", model="ProsusAI/finbert", device="mps") # Uses M4 GPU

# 2. Connect to Kafka
consumer = KafkaConsumer(
    'news',
    bootstrap_servers=['localhost:9092'],
    auto_offset_reset='latest',
    value_deserializer=lambda x: json.loads(x.decode('utf-8'))
)

print(f"✅ Auto-Trading Bot Active (Portfolio {PORTFOLIO_ID})...")

def execute_trade(ticker, action):
    payload = {
        "portfolioId": PORTFOLIO_ID,
        "ticker": ticker,
        "type": action,
        "quantity": TRADE_QUANTITY,
        "price": MOCK_PRICE
    }
    
    try:
        response = requests.post(BACKEND_URL, json=payload)
        if response.status_code == 201:
            print(f"🚀 ORDER EXECUTED: {action} {ticker} (Qty: {TRADE_QUANTITY})")
        else:
            print(f"❌ ORDER FAILED: {response.text}")
    except Exception as e:
        print(f"❌ CONNECTION ERROR: {e}")

# 3. Processing Loop
for message in consumer:
    news = message.value
    ticker = news['ticker']
    headline = news['headline']
    
    # Analyze
    result = classifier(headline)[0]
    sentiment = result['label']
    score = result['score']
    
    signal = "HOLD"
    if sentiment == 'positive' and score > 0.75:
        signal = "BUY"
    elif sentiment == 'negative' and score > 0.75:
        signal = "SELL"
        
    print(f"NEWS: {headline} -> {sentiment.upper()} ({score:.2f})")
    
    # Execute
    if signal != "HOLD":
        execute_trade(ticker, signal)
        print("-" * 30)