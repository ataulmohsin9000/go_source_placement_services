import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../shared/types';
import { ForbiddenError } from '../../shared/errors';

export const rbacMiddleware = (module: string, action: string) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ForbiddenError('User context not available'));
    }

    // Owner role has full bypass
    if (req.user.roles.includes('Owner') || req.user.roles.includes('Super Admin')) {
      return next();
    }

    const required = `${module}:${action}`;
    const wildcard = `${module}:*`;

    if (req.user.permissions.includes(required) || req.user.permissions.includes(wildcard)) {
      return next();
    }

    return next(new ForbiddenError(`Permission denied: require ${required}`));
  };
};

