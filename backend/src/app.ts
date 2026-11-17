import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

import authRoutes from './modules/auth/auth.routes';
import leadsRoutes from './modules/leads/leads.routes';
import clientsRoutes from './modules/clients/clients.routes';
import applicantsRoutes from './modules/applicants/applicants.routes';
import casesRoutes from './modules/cases/cases.routes';
import countriesRoutes from './modules/countries/countries.routes';
import dashboardRoutes from './modules/dashboard/dashboard.routes';
import tasksRoutes from './modules/tasks/tasks.routes';
import invoicesRoutes from './modules/invoices/invoices.routes';
import documentsRoutes from './modules/documents/documents.routes';
import settingsRoutes from './modules/settings/settings.routes';
import aiRoutes from './modules/ai/ai.routes';
import { sendError } from './shared/response';

export const app = express();

app.use(helmet());
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      process.env.FRONTEND_URL,
      process.env.CORS_ORIGIN,
    ].filter((origin): origin is string => Boolean(origin)),
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Mount Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/leads', leadsRoutes);
app.use('/api/v1/clients', clientsRoutes);
app.use('/api/v1/applicants', applicantsRoutes);
app.use('/api/v1/cases', casesRoutes);
app.use('/api/v1/countries', countriesRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/tasks', tasksRoutes);
app.use('/api/v1/invoices', invoicesRoutes);
app.use('/api/v1/documents', documentsRoutes);
app.use('/api/v1/settings', settingsRoutes);
app.use('/api/v1/ai', aiRoutes);

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('API Error:', err);
  const status = err.statusCode || 500;
  const code = err.code || 'INTERNAL_SERVER_ERROR';
  const message = err.message || 'An unexpected error occurred';
  sendError(res, code, message, status, err.details);
});

export default app;

