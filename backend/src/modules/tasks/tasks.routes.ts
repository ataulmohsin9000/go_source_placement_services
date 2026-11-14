import { Router } from 'express';
import { TasksController } from './tasks.controller';
import { authMiddleware } from '../auth/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/', TasksController.list);
router.post('/', TasksController.create);
router.patch('/:id', TasksController.update);
router.delete('/:id', TasksController.delete);

export default router;

