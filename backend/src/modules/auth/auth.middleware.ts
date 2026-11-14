import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest, AuthenticatedUser } from '../../shared/types';
import { UnauthorizedError } from '../../shared/errors';
import prisma from '../../shared/prisma';

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token =
      req.cookies?.token ||
      (req.headers.authorization?.startsWith('Bearer ')
        ? req.headers.authorization.split(' ')[1]
        : null);

    if (!token) {
      throw new UnauthorizedError('Authentication token missing');
    }

    const secret = process.env.JWT_SECRET || 'fallback-secret-key-gosource';
    const decoded = jwt.verify(token, secret) as any;

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        userRoles: {
          include: {
            role: {
              include: {
                rolePermissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedError('User account not found or inactive');
    }

    const roles: string[] = [];
    const permissions = new Set<string>();

    user.userRoles.forEach((ur) => {
      roles.push(ur.role.name);
      ur.role.rolePermissions.forEach((rp) => {
        permissions.add(`${rp.permission.module}:${rp.permission.action}`);
      });
    });

    req.user = {
      userId: user.id,
      businessId: user.businessId,
      branchId: user.branchId,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      roles,
      permissions: Array.from(permissions),
    };

    next();
  } catch (error) {
    next(error);
  }
};

