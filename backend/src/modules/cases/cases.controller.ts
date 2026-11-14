import { Response, NextFunction } from 'express';
import { CasesService } from './cases.service';
import { sendSuccess, sendPaginated } from '../../shared/response';
import { AuthRequest, getParamString } from '../../shared/types';

export class CasesController {
  static async list(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await CasesService.list(req.user!.businessId, req.query);
      sendPaginated(res, result.data, result.meta);
    } catch (err) {
      next(err);
    }
  }

  static async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const caseId = getParamString(req.params.id);
      const caseItem = await CasesService.getById(caseId, req.user!.businessId);
      sendSuccess(res, caseItem);
    } catch (err) {
      next(err);
    }
  }

  static async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const caseItem = await CasesService.create(req.user!.businessId, req.body, req.user!.userId);
      sendSuccess(res, caseItem, 201);
    } catch (err) {
      next(err);
    }
  }

  static async updateStatus(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { status, reason } = req.body;
      const caseId = getParamString(req.params.id);
      const updated = await CasesService.updateStatus(caseId, req.user!.businessId, status, req.user!.userId, reason);
      sendSuccess(res, updated);
    } catch (err) {
      next(err);
    }
  }

  static async recordOutcome(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { outcome, reason } = req.body;
      const caseId = getParamString(req.params.id);
      const updated = await CasesService.recordOutcome(caseId, req.user!.businessId, outcome, reason, req.user!.userId);
      sendSuccess(res, updated);
    } catch (err) {
      next(err);
    }
  }
}

