import { Router } from 'express';
import { InvoicesController } from './invoices.controller';
import { authMiddleware } from '../auth/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/', InvoicesController.list);
router.post('/', InvoicesController.create);
router.get('/:id', InvoicesController.getById);
router.post('/:id/payments', InvoicesController.recordPayment);

export default router;

