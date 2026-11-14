import { Router } from 'express';
import { ApplicantsController } from './applicants.controller';
import { authMiddleware } from '../auth/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/', ApplicantsController.list);
router.post('/', ApplicantsController.create);
router.get('/:id', ApplicantsController.getById);
router.patch('/:id', ApplicantsController.update);
router.delete('/:id', ApplicantsController.delete);

export default router;

