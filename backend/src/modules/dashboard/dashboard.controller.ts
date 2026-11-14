import { Response, NextFunction } from 'express';
import { DashboardService } from './dashboard.service';
import { sendSuccess } from '../../shared/response';
import { AuthRequest } from '../../shared/types';

export class DashboardController {
  static async getOverview(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await DashboardService.getOverview(req.user!.businessId);
      sendSuccess(res, data);
    } catch (err) {
      next(err);
    }
  }
}

