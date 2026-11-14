import { Router, Response } from 'express';
import { authMiddleware } from '../auth/auth.middleware';
import { AuthRequest } from '../../shared/types';
import prisma from '../../shared/prisma';
import { sendSuccess } from '../../shared/response';

const router = Router();
router.use(authMiddleware);

router.get('/business', async (req: AuthRequest, res: Response, next) => {
  try {
    const business = await prisma.business.findUnique({
      where: { id: req.user!.businessId },
    });
    sendSuccess(res, business);
  } catch (err) {
    next(err);
  }
});

router.patch('/business', async (req: AuthRequest, res: Response, next) => {
  try {
    const updated = await prisma.business.update({
      where: { id: req.user!.businessId },
      data: req.body,
    });
    sendSuccess(res, updated);
  } catch (err) {
    next(err);
  }
});

router.get('/users', async (req: AuthRequest, res: Response, next) => {
  try {
    const users = await prisma.user.findMany({
      where: { businessId: req.user!.businessId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
        userRoles: { include: { role: true } },
      },
    });
    sendSuccess(res, users);
  } catch (err) {
    next(err);
  }
});

export default router;

