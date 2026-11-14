import { Response, NextFunction } from 'express';
import { ClientsService } from './clients.service';
import { sendSuccess, sendPaginated } from '../../shared/response';
import { AuthRequest, getParamString } from '../../shared/types';

export class ClientsController {
  static async list(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await ClientsService.list(req.user!.businessId, req.query);
      sendPaginated(res, result.data, result.meta);
    } catch (err) {
      next(err);
    }
  }

  static async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const clientId = getParamString(req.params.id);
      const client = await ClientsService.getById(clientId, req.user!.businessId);
      sendSuccess(res, client);
    } catch (err) {
      next(err);
    }
  }

  static async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const client = await ClientsService.create(req.user!.businessId, req.body);
      sendSuccess(res, client, 201);
    } catch (err) {
      next(err);
    }
  }

  static async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const clientId = getParamString(req.params.id);
      const client = await ClientsService.update(clientId, req.user!.businessId, req.body);
      sendSuccess(res, client);
    } catch (err) {
      next(err);
    }
  }

  static async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const clientId = getParamString(req.params.id);
      await ClientsService.delete(clientId, req.user!.businessId);
      sendSuccess(res, { message: 'Client deleted' });
    } catch (err) {
      next(err);
    }
  }
}

