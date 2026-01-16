import httpx
import yfinance as yf

class TradeDispatcher:
    def get_real_price(self, ticker: str):
        try:
            stock = yf.Ticker(ticker)
            # fast_info is often faster than history()
            price = stock.fast_info.last_price
            return round(price, 2)
        except Exception:
            # Fallback if the ticker is invalid or API fails
            return 150.00

    def send_signal(self, ticker: str, sentiment_result: dict, user_id: int):
        sentiment = sentiment_result["sentiment"]
        confidence = sentiment_result["confidence"]
        
        if confidence > 0.70:
            action = "BUY" if sentiment == "positive" else "SELL" if sentiment == "negative" else "HOLD"
            
            if action == "HOLD":
                return {"status": "skipped", "reason": "neutral_sentiment"}

            try:
                # 1. FETCH REAL PRICE
                real_price = self.get_real_price(ticker)
                
                # 2. PREPARE TRADE DATA
                trade_data = {
                    "userId": user_id,
                    "ticker": ticker,
                    "action": action,
                    "quantity": 10,  # Keeping quantity fixed for now
                    "price": real_price
                }
                
                # 3. SEND TO BACKEND
                response = httpx.post("http://127.0.0.1:3001/api/trades", json=trade_data)
                
                if response.status_code == 201:
                    print(f"✅ Trade Executed: {action} {ticker} at ${real_price}")
                    return {"status": "executed", "price": real_price, "details": response.json()}
                else:
                    return {"status": "failed", "error": response.text}
                    
            except Exception as e:
                print(f"❌ Error: {e}")
                return {"status": "error", "message": str(e)}
        
        return {"status": "skipped", "reason": "low_confidence"}

dispatcher = TradeDispatcher()