import { Response, NextFunction } from 'express';
import { ApplicantsService } from './applicants.service';
import { sendSuccess, sendPaginated } from '../../shared/response';
import { AuthRequest, getParamString } from '../../shared/types';

export class ApplicantsController {
  static async list(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await ApplicantsService.list(req.user!.businessId, req.query);
      sendPaginated(res, result.data, result.meta);
    } catch (err) {
      next(err);
    }
  }

  static async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const applicantId = getParamString(req.params.id);
      const applicant = await ApplicantsService.getById(applicantId, req.user!.businessId);
      sendSuccess(res, applicant);
    } catch (err) {
      next(err);
    }
  }

  static async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const applicant = await ApplicantsService.create(req.user!.businessId, req.body);
      sendSuccess(res, applicant, 201);
    } catch (err) {
      next(err);
    }
  }

  static async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const applicantId = getParamString(req.params.id);
      const applicant = await ApplicantsService.update(applicantId, req.user!.businessId, req.body);
      sendSuccess(res, applicant);
    } catch (err) {
      next(err);
    }
  }

  static async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const applicantId = getParamString(req.params.id);
      await ApplicantsService.delete(applicantId, req.user!.businessId);
      sendSuccess(res, { message: 'Applicant deleted' });
    } catch (err) {
      next(err);
    }
  }
}

