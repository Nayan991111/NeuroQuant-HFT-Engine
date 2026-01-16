import { Router } from 'express';
import authRoutes from './routes/auth';
import portfolioRoutes from './routes/portfolios';
import tradeRoutes from './routes/trades';

const router = Router();

// Register the routes
router.use('/auth', authRoutes);
router.use('/portfolios', portfolioRoutes); // <--- THIS WAS LIKELY MISSING OR BROKEN
router.use('/trades', tradeRoutes);

export default router;