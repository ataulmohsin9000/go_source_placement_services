import { Router } from 'express';
import { ClientsController } from './clients.controller';
import { authMiddleware } from '../auth/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/', ClientsController.list);
router.post('/', ClientsController.create);
router.get('/:id', ClientsController.getById);
router.patch('/:id', ClientsController.update);
router.delete('/:id', ClientsController.delete);

export default router;

