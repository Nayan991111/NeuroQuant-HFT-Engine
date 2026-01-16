# NeuroQuant: High-Frequency AI Sentiment Trading Engine

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Stack](https://img.shields.io/badge/tech-Python%20|%20Node.js%20|%20Kafka%20|%20React-blue)
![License](https://img.shields.io/badge/license-MIT-purple)

## ⚡ Executive Summary
NeuroQuant is an event-driven algorithmic trading platform designed to bridge the gap between unstructured financial news and quantitative trading signals. It leverages **Natural Language Processing (FinBERT)** to analyze financial news in real-time, generating trading signals that are executed against a simulated market environment with sub-second latency.

## 🏗 System Architecture
The platform is built as a containerized microservices architecture optimized for high throughput:

1.  **AI Engine (Python/PyTorch):**
    * Ingests real-time news streams.
    * Uses a customized `ProsusAI/finbert` model for sentiment classification.
    * Publishes polarity scores to the Kafka event bus.
2.  **Messaging Backbone (Apache Kafka + Zookeeper):**
    * Handles asynchronous communication between the AI and Execution layers.
    * Ensures zero-loss data streaming during high-volatility events.
3.  **Trading Backend (Node.js/TypeScript):**
    * Consumes AI signals via Kafka consumers.
    * Executes Buy/Sell orders via TypeORM/PostgreSQL with ACID compliance.
    * Manages portfolio state and risk logic.
4.  **NeuroQuant Prime Terminal (React/Vite/Tailwind):**
    * Professional-grade dashboard with Glassmorphism UI.
    * Features real-time "Sonar" signal detection, scrolling news tape, and interactive charts.

## 🚀 Quick Start

### Prerequisites
* Docker & Docker Compose
* Git

### Deployment
1.  **Clone the Repository:**
    ```bash
    git clone [https://github.com/your-username/neuroquant.git](https://github.com/your-username/neuroquant.git)
    cd neuroquant
    ```

2.  **Launch the Stack:**
    ```bash
    docker-compose -f docker-compose.prod.yml up -d --build
    ```

3.  **Verify Health:**
    Access the Terminal at: `http://localhost:5173`

4.  **Simulate Market Data:**
    The AI engine waits for news input. To trigger the simulation feed:
    ```bash
    docker exec -it trading_ai_prod python producer.py
    ```

## 🛠 Technology Stack
* **Frontend:** React 18, TypeScript, Tailwind CSS, Recharts
* **Backend:** Node.js, Express, TypeORM
* **Database:** PostgreSQL 15
* **AI/ML:** Python 3.9, Hugging Face Transformers, FinBERT, Kafka-Python
* **Infrastructure:** Docker Compose

---

## 👨‍💻 Engineer
**Nayan Pandit**
*InvestTech Equity Investment Banking Analyst & Jr. Quant Engineer*

*Disclaimer: This project is for educational and research purposes only. It simulates trading environments and does not execute real financial transactions.*