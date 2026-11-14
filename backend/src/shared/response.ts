import { Response } from 'express';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const sendSuccess = <T>(res: Response, data: T, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    data,
  });
};

export const sendPaginated = <T>(
  res: Response,
  data: T[],
  meta: { total: number; page: number; limit: number; totalPages: number }
) => {
  return res.status(200).json({
    success: true,
    data,
    meta,
  });
};

export const sendError = (
  res: Response,
  code: string,
  message: string,
  statusCode = 400,
  details?: any
) => {
  return res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      details,
    },
  });
};

