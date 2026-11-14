import { Router } from 'express';
import { LeadsController } from './leads.controller';
import { authMiddleware } from '../auth/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/', LeadsController.list);
router.post('/', LeadsController.create);
router.get('/:id', LeadsController.getById);
router.patch('/:id', LeadsController.update);
router.delete('/:id', LeadsController.delete);
router.post('/:id/convert', LeadsController.convert);

export default router;

