import json
import time
import requests
import os
import random
from kafka import KafkaConsumer

# --- CONFIGURATION ---
KAFKA_TOPIC = "financial_news"
# Docker uses 'kafka:29092', Local uses 'localhost:9092'
KAFKA_BROKER = os.getenv('KAFKA_BROKER', 'localhost:9092')
# Docker uses 'backend', Local uses 'localhost'
BACKEND_URL = os.getenv('BACKEND_URL', 'http://localhost:3001/api') + "/trades"

print("-" * 50)
print(f"✅ AI TRADER STARTING")
print(f"🔌 Kafka:   {KAFKA_BROKER}")
print(f"🔗 Backend: {BACKEND_URL}")
print("-" * 50)

# Retry Connection Logic
consumer = None
for i in range(20):
    try:
        print(f"⏳ Connecting to Kafka (Attempt {i+1})...")
        consumer = KafkaConsumer(
            KAFKA_TOPIC,
            bootstrap_servers=[KAFKA_BROKER],
            value_deserializer=lambda x: json.loads(x.decode('utf-8')),
            group_id='trade_group_sanitized_v1', # New ID to force fresh read
            auto_offset_reset='latest'
        )
        print("✅ CONNECTED TO KAFKA!")
        break
    except Exception as e:
        time.sleep(3)

if not consumer:
    print("❌ CRITICAL: Kafka Connection Failed.")
    exit(1)

print("🎧 Waiting for News...")

for message in consumer:
    try:
        news = message.value
        ticker = news.get('ticker', 'UNKNOWN')
        print(f"📨 Received News: {ticker} - {news.get('headline', '')[:30]}...")

        # --- BYPASS LOGIC (Random Trade to Test Pipeline) ---
        action = random.choice(["BUY", "SELL"])
        trade_data = {
            "ticker": ticker,
            "type": action,
            "quantity": random.randint(1, 10),
            "price": round(random.uniform(100, 200), 2),
            "sentimentScore": 0.88,
            "portfolioId": 1
        }

        # Send to Backend
        response = requests.post(BACKEND_URL, json=trade_data)
        
        if response.status_code in [200, 201]:
            print(f"🚀 TRADE EXECUTED: {action} {ticker} | Balance Updated")
        else:
            print(f"⚠️ BACKEND REFUSED: {response.status_code} - {response.text}")

    except Exception as e:
        print(f"❌ ERROR PROCESSING MSG: {e}")