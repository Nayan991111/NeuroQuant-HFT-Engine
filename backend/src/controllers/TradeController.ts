import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Trade } from "../entities/Trade";
import { Portfolio } from "../entities/Portfolio";

export class TradeController {

    // 🏦 THE BANKER LOGIC: Enforces funds and updates balance
    static async createTrade(req: Request, res: Response) {
        try {
            const { portfolioId, ticker, type, quantity, price } = req.body;

            const portfolioRepo = AppDataSource.getRepository(Portfolio);
            const tradeRepo = AppDataSource.getRepository(Trade);

            // 1. Find the Portfolio
            const portfolio = await portfolioRepo.findOneBy({ id: portfolioId });
            if (!portfolio) {
                return res.status(404).json({ message: "Portfolio not found" });
            }

            // 2. Calculate Trade Math
            // Note: TypeORM returns decimals as strings, so we convert to Number
            const currentBalance = Number(portfolio.balance);
            const tradeCost = Number(price) * Number(quantity);

            // 3. 🛑 BANKER CHECK: Insufficient Funds
            if (type === "BUY") {
                if (currentBalance < tradeCost) {
                    console.log(`❌ REJECTED: Insufficient funds for ${ticker}. Cost: $${tradeCost}, Balance: $${currentBalance}`);
                    return res.status(400).json({ 
                        message: "Insufficient funds", 
                        currentBalance: currentBalance, 
                        required: tradeCost 
                    });
                }
                // Deduct cash
                portfolio.balance = currentBalance - tradeCost;
            } 
            else if (type === "SELL") {
                // Add cash
                portfolio.balance = currentBalance + tradeCost;
            }

            // 4. Save the New Balance (Update Wallet)
            await portfolioRepo.save(portfolio);

            // 5. Record the Trade (Receipt)
            const trade = new Trade();
            trade.portfolio = portfolio;
            trade.ticker = ticker;
            trade.type = type; // "BUY" or "SELL"
            trade.quantity = quantity;
            trade.price = price;
            trade.sentimentScore = req.body.sentimentScore || 0; // Capture sentiment if sent
            trade.timestamp = new Date();

            await tradeRepo.save(trade);

            console.log(`✅ EXECUTED: ${type} ${quantity} ${ticker} @ $${price}. New Balance: $${portfolio.balance}`);

            return res.status(201).json({
                trade,
                newBalance: portfolio.balance
            });

        } catch (error) {
            console.error("Trade execution failed:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    static async getTrades(req: Request, res: Response) {
        try {
            const tradeRepo = AppDataSource.getRepository(Trade);
            const trades = await tradeRepo.find({
                relations: ["portfolio"],
                order: { timestamp: "DESC" },
                take: 50
            });
            return res.json(trades);
        } catch (error) {
            return res.status(500).json({ message: "Error fetching trades" });
        }
    }
}