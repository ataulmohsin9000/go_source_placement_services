import { Router } from 'express';
import { DashboardController } from './dashboard.controller';
import { authMiddleware } from '../auth/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/overview', DashboardController.getOverview);

export default router;

