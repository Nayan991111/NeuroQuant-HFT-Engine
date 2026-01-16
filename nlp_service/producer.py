import time
import json
import random
import os
from kafka import KafkaProducer
from datetime import datetime

# --- CONFIGURATION: DOCKER FRIENDLY ---
# If running in Docker, use 'kafka:29092'. If local, use 'localhost:9092'
KAFKA_BROKER = os.getenv('KAFKA_BROKER', 'localhost:9092')
TOPIC_NAME = "financial_news"

print(f"🔌 Producer connecting to Kafka at: {KAFKA_BROKER}")

# Retry logic (Wait for Kafka to start)
producer = None
for i in range(10):
    try:
        producer = KafkaProducer(
            bootstrap_servers=[KAFKA_BROKER],
            value_serializer=lambda v: json.dumps(v).encode('utf-8')
        )
        print("✅ Producer connected to Kafka!")
        break
    except Exception as e:
        print(f"⚠️ Connection failed (attempt {i+1}/10): {e}")
        time.sleep(5)

if not producer:
    raise Exception("❌ Could not connect to Kafka after retries")

# Sample Data
TICKERS = ["AAPL", "TSLA", "GOOGL", "AMZN", "MSFT"]
HEADLINES = [
    "reports record breaking earnings for Q3",
    "faces new lawsuit regarding antitrust violations",
    "announces massive layoff of 10,000 employees",
    "launches new AI product that beats competitors",
    "CEO steps down unexpectedly, stock wavers",
    "partners with major government agency for cloud contract",
    "suffers data breach affecting millions of users"
]

def generate_news():
    """Generates a random news event"""
    ticker = random.choice(TICKERS)
    headline = random.choice(HEADLINES)
    full_text = f"{ticker} {headline}"
    
    # Inject hint for sentiment
    if "record" in headline or "launches" in headline or "partners" in headline:
        sentiment = random.uniform(0.5, 0.9)
    else:
        sentiment = random.uniform(-0.9, -0.5)

    news_event = {
        "id": int(time.time() * 1000),
        "ticker": ticker,
        "headline": full_text,
        "sentiment": sentiment,
        "source": "Simulated Feed",
        "timestamp": datetime.now().isoformat()
    }
    return news_event

def start_producer():
    print("📡 Starting News Stream...")
    try:
        while True:
            news = generate_news()
            producer.send(TOPIC_NAME, news)
            print(f"Sent: {news['ticker']} - {news['headline']}")
            time.sleep(3) # Slowed down slightly for Docker stability
    except KeyboardInterrupt:
        print("\n🛑 Stopping News Stream.")
        producer.close()

if __name__ == "__main__":
    start_producer()