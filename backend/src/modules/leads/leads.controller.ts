import { Response, NextFunction } from 'express';
import { LeadsService } from './leads.service';
import { sendSuccess, sendPaginated } from '../../shared/response';
import { AuthRequest, getParamString } from '../../shared/types';

export class LeadsController {
  static async list(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await LeadsService.list(req.user!.businessId, req.query);
      sendPaginated(res, result.data, result.meta);
    } catch (err) {
      next(err);
    }
  }

  static async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const leadId = getParamString(req.params.id);
      const lead = await LeadsService.getById(leadId, req.user!.businessId);
      sendSuccess(res, lead);
    } catch (err) {
      next(err);
    }
  }

  static async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const lead = await LeadsService.create(req.user!.businessId, req.body, req.user!.userId);
      sendSuccess(res, lead, 201);
    } catch (err) {
      next(err);
    }
  }

  static async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const leadId = getParamString(req.params.id);
      const lead = await LeadsService.update(leadId, req.user!.businessId, req.body);
      sendSuccess(res, lead);
    } catch (err) {
      next(err);
    }
  }

  static async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const leadId = getParamString(req.params.id);
      await LeadsService.delete(leadId, req.user!.businessId);
      sendSuccess(res, { message: 'Lead deleted' });
    } catch (err) {
      next(err);
    }
  }

  static async convert(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const leadId = getParamString(req.params.id);
      const result = await LeadsService.convert(leadId, req.user!.businessId);
      sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }
}

