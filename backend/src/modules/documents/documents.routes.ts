import { Router, Response } from 'express';
import { authMiddleware } from '../auth/auth.middleware';
import { AuthRequest } from '../../shared/types';
import prisma from '../../shared/prisma';
import { sendSuccess } from '../../shared/response';

const router = Router();
router.use(authMiddleware);

router.get('/', async (req: AuthRequest, res: Response, next) => {
  try {
    const where: any = { businessId: req.user!.businessId };
    if (req.query.caseId) where.caseId = req.query.caseId as string;
    if (req.query.applicantId) where.applicantId = req.query.applicantId as string;

    const docs = await prisma.document.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        applicant: { select: { firstName: true, lastName: true } },
        case: { select: { reference: true } },
        versions: true,
      },
    });
    sendSuccess(res, docs);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req: AuthRequest, res: Response, next) => {
  try {
    const doc = await prisma.document.create({
      data: {
        businessId: req.user!.businessId,
        caseId: req.body.caseId || null,
        applicantId: req.body.applicantId || null,
        title: req.body.title,
        storageKey: req.body.storageKey || 'local-file-key',
        mimeType: req.body.mimeType || 'application/pdf',
        sizeBytes: req.body.sizeBytes || 1024,
        uploadedById: req.user!.userId,
        versions: {
          create: {
            storageKey: req.body.storageKey || 'local-file-key',
            mimeType: req.body.mimeType || 'application/pdf',
            sizeBytes: req.body.sizeBytes || 1024,
            uploadedById: req.user!.userId,
          },
        },
      },
      include: { versions: true },
    });
    sendSuccess(res, doc, 201);
  } catch (err) {
    next(err);
  }
});

export default router;

