import { Router } from 'express';
import { TradeController } from '../controllers/TradeController';

const router = Router();

// POST /api/trades (The bot calls this)
router.post('/', TradeController.createTrade);

// GET /api/trades (The dashboard calls this)
router.get('/', TradeController.getTrades);

export default router;