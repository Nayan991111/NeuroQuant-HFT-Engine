import os
import random
from datetime import datetime, timedelta
from sqlalchemy import create_engine, text

# --- SMART CONNECTION BLOCK ---
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_USER = os.getenv("DB_USERNAME", "admin")
DB_PASS = os.getenv("DB_PASSWORD", "adminpassword")
DB_NAME = os.getenv("DB_NAME", "sentiment_db")

DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
print(f"🔌 Connecting to: {DB_HOST}:{DB_PORT}/{DB_NAME} as {DB_USER}")
# -----------------------------

engine = create_engine(DATABASE_URL)

def fix_infrastructure(engine):
    print("🏗️  Rebuilding User & Portfolio Infrastructure...")
    with engine.connect() as conn:
        # 1. Ensure User Exists (Schema: id, username, password)
        # REMOVED: email, fullName
        conn.execute(text("""
            INSERT INTO "user" (id, username, password) 
            VALUES (1, 'Nayan', 'hashed_secret')
            ON CONFLICT (id) DO NOTHING;
        """))
        
        # 2. Ensure Portfolio Exists (Schema: id, initialCapital, balance, userId)
        # REMOVED: name
        conn.execute(text("""
            INSERT INTO "portfolio" (id, "initialCapital", balance, "userId") 
            VALUES (1, 100000, 100000, 1) 
            ON CONFLICT (id) DO NOTHING;
        """))
        
        conn.commit()
        print("✅ User 'Nayan' (ID: 1) verified.")

def inject_data():
    fix_infrastructure(engine)
    
    print("⏳ Generating 1000 historical trades...")
    trades = []
    tickers = ['AAPL', 'GOOGL', 'TSLA', 'AMZN', 'MSFT']
    start_date = datetime.now() - timedelta(days=30)
    
    for i in range(1000):
        random_seconds = random.randint(0, 30 * 24 * 3600)
        trade_time = start_date + timedelta(seconds=random_seconds)
        
        trade = {
            "ticker": random.choice(tickers),
            "type": random.choice(['BUY', 'SELL']),
            "quantity": random.randint(1, 100),
            "price": random.uniform(100, 200),
            "sentimentScore": random.uniform(-1, 1),
            "timestamp": trade_time,
            "portfolioId": 1
        }
        trades.append(trade)

    print("💉 Injecting trade history into PostgreSQL...")
    with engine.connect() as conn:
        # SQL MATCHING EXACT SCHEMA: ticker, quantity, timestamp
        stmt = text("""
            INSERT INTO trade (ticker, type, quantity, price, "sentimentScore", timestamp, "portfolioId")
            VALUES (:ticker, :type, :quantity, :price, :sentimentScore, :timestamp, :portfolioId)
        """)
        conn.execute(stmt, trades)
        conn.commit()
        
    print("✅ Successfully injected 1000 trades.")

if __name__ == "__main__":
    inject_data()