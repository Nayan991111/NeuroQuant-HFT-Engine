import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.metrics import accuracy_score, classification_report
import joblib
from feature_engineer import enrich_data
from data_fetcher import fetch_trade_history

# Where we save the trained brain
MODEL_PATH = "sentiment_model.pkl"

def train_model():
    print("🧠 [TRAINING] Initializing Model Training Pipeline...")
    
    # 1. Fetch & Engineer Data
    raw_df = fetch_trade_history()
    df = enrich_data(raw_df)
    
    if df.empty:
        print("❌ [ERROR] No data available for training.")
        return

    # 2. Prepare Features (X) and Target (y)
    # Target: We want to predict the 'action' (BUY or SELL)
    # In a real system, we would predict 'Future Price Return', 
    # but for this prototype, learning the 'Trade Pattern' is sufficient.
    
    feature_cols = ['sentimentScore', 'sentiment_sma_5', 'sentiment_momentum', 'sentiment_rsi']
    X = df[feature_cols]
    y = df['action'] # Target: BUY or SELL

    # 3. Split Data (80% Train, 20% Test)
    # shuffle=False preserves time order (crucial for financial time-series)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, shuffle=False)
    
    print(f"📉 [SPLIT] Training on {len(X_train)} samples, Testing on {len(X_test)} samples.")

    # 4. Initialize & Train Gradient Boosting Model
    print("🔥 [LEARNING] Training Gradient Boosting Classifier...")
    model = GradientBoostingClassifier(
        n_estimators=100,     # Number of decision trees
        learning_rate=0.1,    # How fast it learns
        max_depth=3,          # Complexity of each tree
        random_state=42
    )
    model.fit(X_train, y_train)

    # 5. Evaluate Performance
    predictions = model.predict(X_test)
    accuracy = accuracy_score(y_test, predictions)
    
    print("\n" + "="*40)
    print(f"🏆 MODEL ACCURACY: {accuracy:.2%}")
    print("="*40)
    print("\nDetailed Report:")
    print(classification_report(y_test, predictions))

    # 6. Save the Model
    joblib.dump(model, MODEL_PATH)
    print(f"💾 [SAVED] Model saved to '{MODEL_PATH}'")

if __name__ == "__main__":
    train_model()