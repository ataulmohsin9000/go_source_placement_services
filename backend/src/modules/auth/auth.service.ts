import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../../shared/prisma';
import { AppError, UnauthorizedError } from '../../shared/errors';

export class AuthService {
  static async login(email: string, passwordPlain: string) {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        business: true,
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
      throw new UnauthorizedError('Invalid email or password');
    }

    const isValid = await bcrypt.compare(passwordPlain, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const secret = process.env.JWT_SECRET || 'fallback-secret-key-gosource';
    const token = jwt.sign(
      {
        userId: user.id,
        businessId: user.businessId,
        email: user.email,
      },
      secret,
      { expiresIn: '7d' }
    );

    const roles = user.userRoles.map((ur) => ur.role.name);
    const permissions = new Set<string>();
    user.userRoles.forEach((ur) => {
      ur.role.rolePermissions.forEach((rp) => {
        permissions.add(`${rp.permission.module}:${rp.permission.action}`);
      });
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        businessId: user.businessId,
        businessName: user.business.name,
        currency: user.business.defaultCurrency,
        roles,
        permissions: Array.from(permissions),
      },
    };
  }

  static async me(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        business: true,
        branch: true,
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

    if (!user) throw new UnauthorizedError('User not found');

    const roles = user.userRoles.map((ur) => ur.role.name);
    const permissions = new Set<string>();
    user.userRoles.forEach((ur) => {
      ur.role.rolePermissions.forEach((rp) => {
        permissions.add(`${rp.permission.module}:${rp.permission.action}`);
      });
    });

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      businessId: user.businessId,
      businessName: user.business.name,
      currency: user.business.defaultCurrency,
      branch: user.branch?.name || null,
      roles,
      permissions: Array.from(permissions),
    };
  }
}

