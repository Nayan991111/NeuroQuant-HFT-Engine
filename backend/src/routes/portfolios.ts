import { Router } from "express";
import { PortfolioController } from "../controllers/PortfolioController";

const router = Router();

// 👇 CRITICAL FIX: Changed from /:userId to /:id to match the Controller
router.get("/:id", PortfolioController.getPortfolio);

// Optional: Route to reset balance
router.post("/:id/reset", PortfolioController.resetPortfolio);

export default router;