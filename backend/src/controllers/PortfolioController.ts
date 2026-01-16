import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Portfolio } from "../entities/Portfolio";

export class PortfolioController {

    static async getPortfolio(req: Request, res: Response) {
        try {
            // 1. Log the incoming parameters to debug mismatches
            console.log("📥 GetPortfolio Request Params:", req.params);

            const { id } = req.params;

            // 2. Validate ID
            if (!id) {
                console.error("❌ Error: No ID found in parameters.");
                return res.status(400).json({ message: "Invalid request: ID missing" });
            }

            const portfolioRepo = AppDataSource.getRepository(Portfolio);
            
            // 3. Fetch Portfolio
            const portfolio = await portfolioRepo.findOne({
                where: { id: Number(id) }
            });

            if (!portfolio) {
                console.log(`⚠️ Portfolio #${id} not found.`);
                return res.status(404).json({ message: "Portfolio not found" });
            }

            // 4. Success
            console.log(`✅ Portfolio #${id} retrieved. Balance: $${portfolio.balance}`);
            return res.json(portfolio);

        } catch (error) {
            console.error("🔥 CRITICAL SERVER ERROR fetching portfolio:", error);
            return res.status(500).json({ message: "Server error fetching portfolio" });
        }
    }

    static async resetPortfolio(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const portfolioRepo = AppDataSource.getRepository(Portfolio);
            
            const portfolio = await portfolioRepo.findOneBy({ id: Number(id) });
            if (!portfolio) return res.status(404).json({ message: "Not found" });

            portfolio.balance = portfolio.initialCapital;
            await portfolioRepo.save(portfolio);

            return res.json({ message: "Portfolio reset", balance: portfolio.balance });
        } catch (error) {
            return res.status(500).json({ message: "Error resetting portfolio" });
        }
    }
}