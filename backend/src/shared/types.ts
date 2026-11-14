import { Request } from 'express';

export type StringParam = string | string[] | undefined;

export const getParamString = (value: StringParam): string => {
  if (Array.isArray(value)) return value[0] || '';
  return value || '';
};

export interface AuthenticatedUser {
  userId: string;
  businessId: string;
  branchId?: string | null;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  permissions: string[];
}

export interface AuthRequest extends Request {
  user?: AuthenticatedUser;
}

