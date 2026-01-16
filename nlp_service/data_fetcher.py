import pandas as pd
from sqlalchemy import create_engine
import time

# --- CONFIGURATION ---
# Credentials matching your docker-compose.yml
DB_USER = "postgres"
DB_PASS = "password" 
# FIX: Changed 'localhost' to '127.0.0.1' to force IPv4 connection on M4 Mac
DB_HOST = "127.0.0.1" 
DB_PORT = "5432"
DB_NAME = "sentiment_trading"

def get_db_connection():
    """
    Establishes a connection to the PostgreSQL database using SQLAlchemy.
    Optimized for Data Science workflows on Apple Silicon.
    """
    try:
        # Standard Postgres connection string
        connection_str = f"postgresql://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
        engine = create_engine(connection_str)
        print("✅ [SUCCESS] Database Engine Created.")
        return engine
    except Exception as e:
        print(f"❌ [ERROR] Could not connect to Database: {e}")
        return None

def fetch_trade_history():
    """
    Fetches all trade data and returns a clean Pandas DataFrame.
    This serves as the 'Memory' for our ML Model.
    """
    engine = get_db_connection()
    if not engine:
        return pd.DataFrame() # Return empty if connection fails

    print("🔄 [FETCHING] Retrieving historical trade data...")
    
    # We select specific columns relevant for ML training
    # Note: Column names are quoted to handle case-sensitivity from TypeORM
    query = """
    SELECT 
        id, 
        symbol as ticker, 
        type as action, 
        amount, 
        price, 
        "sentimentScore", 
        "createdAt" as timestamp
    FROM trades
    ORDER BY "createdAt" ASC;
    """

    try:
        # Read SQL directly into a DataFrame (High Performance)
        df = pd.read_sql(query, engine)
        
        # Convert timestamp strings to actual Python datetime objects
        df['timestamp'] = pd.to_datetime(df['timestamp'])
        
        print(f"📊 [DATA LOADED] Retrieved {len(df)} rows.")
        return df
    except Exception as e:
        print(f"❌ [ERROR] Query Failed: {e}")
        return pd.DataFrame()

if __name__ == "__main__":
    # Test the fetcher independently to verify connection
    print("--- 🚀 STARTING DATA FETCHER MODULE ---")
    df = fetch_trade_history()
    
    if not df.empty:
        print("\n--- 🔍 DATA PREVIEW (First 5 Rows) ---")
        print(df.head().to_string())
        print("\n--- 📈 DATA STATISTICS ---")
        print(df.describe().to_string())
    else:
        print("\n⚠️ Connection successful, but database is empty.") 
        print("   (This is normal if you haven't run the bot since the restart)")