import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { sendSuccess } from '../../shared/response';
import { AuthRequest } from '../../shared/types';

export class AuthController {
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login(email, password);

      res.cookie('token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }

  static async logout(req: Request, res: Response) {
    res.clearCookie('token');
    sendSuccess(res, { message: 'Logged out successfully' });
  }

  static async me(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const profile = await AuthService.me(req.user!.userId);
      sendSuccess(res, profile);
    } catch (err) {
      next(err);
    }
  }
}

