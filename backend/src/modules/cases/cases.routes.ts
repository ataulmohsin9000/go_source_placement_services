import { Router } from 'express';
import { CasesController } from './cases.controller';
import { authMiddleware } from '../auth/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/', CasesController.list);
router.post('/', CasesController.create);
router.get('/:id', CasesController.getById);
router.patch('/:id/status', CasesController.updateStatus);
router.patch('/:id/outcome', CasesController.recordOutcome);

export default router;

