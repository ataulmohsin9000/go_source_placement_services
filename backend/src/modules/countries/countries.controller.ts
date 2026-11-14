import { Response, NextFunction } from 'express';
import { CountriesService } from './countries.service';
import { sendSuccess } from '../../shared/response';
import { AuthRequest, getParamString } from '../../shared/types';

export class CountriesController {
  static async list(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await CountriesService.list(req.user!.businessId);
      sendSuccess(res, data);
    } catch (err) {
      next(err);
    }
  }

  static async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await CountriesService.create(req.user!.businessId, req.body);
      sendSuccess(res, data, 201);
    } catch (err) {
      next(err);
    }
  }

  static async createVisaType(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const countryId = getParamString(req.params.countryId);
      const data = await CountriesService.createVisaType(req.user!.businessId, countryId, req.body);
      sendSuccess(res, data, 201);
    } catch (err) {
      next(err);
    }
  }
}

