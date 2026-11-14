import { Router, Response } from 'express';
import { authMiddleware } from '../auth/auth.middleware';
import { AuthRequest } from '../../shared/types';
import prisma from '../../shared/prisma';
import { sendSuccess } from '../../shared/response';

const router = Router();
router.use(authMiddleware);

router.post('/chat', async (req: AuthRequest, res: Response, next) => {
  try {
    const { message, conversationId } = req.body;
    const businessId = req.user!.businessId;

    // Get basic stats to power the AI digital assistant
    const [leadCount, caseCount, clientCount] = await Promise.all([
      prisma.lead.count({ where: { businessId } }),
      prisma.case.count({ where: { businessId } }),
      prisma.client.count({ where: { businessId } }),
    ]);

    let reply = `Hello ${req.user!.firstName}! As your Visa Operations Assistant, I can confirm we currently have ${leadCount} active leads, ${caseCount} total cases, and ${clientCount} registered clients. How can I assist you with visa checklists, applicant reviews, or case tracking today?`;

    const lower = (message || '').toLowerCase();
    if (lower.includes('lead') || lower.includes('enquiry')) {
      reply = `You have ${leadCount} leads in the pipeline. You can check the Leads board to qualify and convert them into active cases.`;
    } else if (lower.includes('case') || lower.includes('status')) {
      reply = `There are ${caseCount} cases currently registered. Use the Cases workspace to track stage milestones and checklist submissions.`;
    } else if (lower.includes('document') || lower.includes('checklist')) {
      reply = `All documents are verified according to country-specific requirements (e.g. UAE, UK, Canada). Make sure applicants upload valid passport scans with at least 6 months validity.`;
    }

    sendSuccess(res, {
      role: 'assistant',
      content: reply,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    next(err);
  }
});

export default router;

