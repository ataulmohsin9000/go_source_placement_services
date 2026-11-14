import { Response, NextFunction } from 'express';
import { TasksService } from './tasks.service';
import { sendSuccess } from '../../shared/response';
import { AuthRequest, getParamString } from '../../shared/types';

export class TasksController {
  static async list(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const tasks = await TasksService.list(req.user!.businessId, req.query);
      sendSuccess(res, tasks);
    } catch (err) {
      next(err);
    }
  }

  static async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const task = await TasksService.create(req.user!.businessId, req.body, req.user!.userId);
      sendSuccess(res, task, 201);
    } catch (err) {
      next(err);
    }
  }

  static async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const taskId = getParamString(req.params.id);
      const task = await TasksService.update(taskId, req.user!.businessId, req.body);
      sendSuccess(res, task);
    } catch (err) {
      next(err);
    }
  }

  static async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const taskId = getParamString(req.params.id);
      await TasksService.delete(taskId, req.user!.businessId);
      sendSuccess(res, { message: 'Task deleted' });
    } catch (err) {
      next(err);
    }
  }
}

