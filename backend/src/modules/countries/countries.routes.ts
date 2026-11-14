import { Router } from 'express';
import { CountriesController } from './countries.controller';
import { authMiddleware } from '../auth/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/', CountriesController.list);
router.post('/', CountriesController.create);
router.post('/:countryId/visa-types', CountriesController.createVisaType);

export default router;

