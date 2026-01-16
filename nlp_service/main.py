import threading
import time
import os
import producer
import smart_consumer

# This script is the Docker Entrypoint.
# It runs both the News Producer and the Smart Consumer simultaneously.

def run_producer_thread():
    print("🧵 Starting Producer Thread...")
    # Give Kafka a moment to settle
    time.sleep(10)
    # Ensure we run using python command
    os.system("python producer.py")

def run_consumer_thread():
    print("🧵 Starting Consumer Thread...")
    # Give Producer a head start
    time.sleep(20)
    # Ensure we run using python command
    os.system("python smart_consumer.py")

if __name__ == "__main__":
    print("🚀 AI Service Container Initializing...")
    
    t1 = threading.Thread(target=run_producer_thread)
    t2 = threading.Thread(target=run_consumer_thread)

    t1.start()
    t2.start()

    t1.join()
    t2.join()