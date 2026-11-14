import { Response, NextFunction } from 'express';
import { InvoicesService } from './invoices.service';
import { sendSuccess } from '../../shared/response';
import { AuthRequest, getParamString } from '../../shared/types';

export class InvoicesController {
  static async list(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const invoices = await InvoicesService.list(req.user!.businessId, req.query);
      sendSuccess(res, invoices);
    } catch (err) {
      next(err);
    }
  }

  static async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const invoiceId = getParamString(req.params.id);
      const invoice = await InvoicesService.getById(invoiceId, req.user!.businessId);
      sendSuccess(res, invoice);
    } catch (err) {
      next(err);
    }
  }

  static async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const invoice = await InvoicesService.create(req.user!.businessId, req.body, req.user!.userId);
      sendSuccess(res, invoice, 201);
    } catch (err) {
      next(err);
    }
  }

  static async recordPayment(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const invoiceId = getParamString(req.params.id);
      const payment = await InvoicesService.recordPayment(invoiceId, req.user!.businessId, req.body, req.user!.userId);
      sendSuccess(res, payment, 201);
    } catch (err) {
      next(err);
    }
  }
}

