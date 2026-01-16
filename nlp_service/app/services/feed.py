import time
import random
import sys
import os

# Fix path so python can find 'app'
sys.path.append(os.getcwd())

from app.services.sentiment import sentiment_analyzer

HEADLINES = [
    ("AAPL", "Apple releases new Vision Pro, reviews are mixed but optimistic."),
    ("TSLA", "Tesla faces new regulatory probe over autopilot safety."),
    ("NVDA", "Nvidia earnings smash expectations due to AI chip demand."),
    ("AMZN", "Amazon faces strike at major distribution center, delays expected."),
    ("GOOGL", "Google announces breakthrough in quantum computing."),
    ("MSFT", "Microsoft cloud revenue grows 20% year-over-year."),
    ("META", "Meta platform outage causes ad revenue loss."),
    ("NFLX", "Netflix subscriber growth slows down in Q3.")
]

def run_simulation(delay_seconds=1.5):
    print(f"📡 CONNECTED TO MOCK NEWS FEED... (Press Ctrl+C to stop)")
    print("-" * 60)

    try:
        while True:
            ticker, text = random.choice(HEADLINES)

            # Measure M4 Processing Speed
            start_time = time.time()
            result = sentiment_analyzer.analyze(text)
            end_time = time.time()

            duration = (end_time - start_time) * 1000  # ms

            sentiment = result["sentiment"].upper()
            confidence = result["confidence"]

            if sentiment == "POSITIVE":
                icon = "🟢 BUY "
            elif sentiment == "NEGATIVE":
                icon = "🔴 SELL"
            else:
                icon = "⚪ HOLD"

            print(f"[{ticker}] {icon} | Conf: {confidence:.2f} | Time: {duration:.1f}ms")
            print(f"   📰 \"{text}\"")
            print("-" * 60)

            time.sleep(delay_seconds)

    except KeyboardInterrupt:
        print("\n🛑 Simulation stopped.")

if __name__ == "__main__":
    run_simulation()
