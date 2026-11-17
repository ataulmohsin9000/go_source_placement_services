import dotenv from 'dotenv';
dotenv.config();

import app from './app';

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Visa Services CRM API running on http://localhost:${PORT}`);
    console.log(`📡 Health endpoint: http://localhost:${PORT}/health`);
  });
}

export default app;

