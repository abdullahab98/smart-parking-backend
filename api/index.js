import app from '../src/app.js';
import { connectDB } from '../src/config/database.js';

let isConnected = false;

export default async function handler(req, res) {
  if (!isConnected) {
    try {
      await connectDB();
      isConnected = true;
    } catch (err) {
      console.error('[Vercel Serverless DB Connection Error]:', err.message);

      // Allow /health or /api/health to respond even if DB is failing so health telemetry works
      const url = req.url || '';
      if (url === '/health' || url === '/api/health' || url.startsWith('/health?') || url.startsWith('/api/health?')) {
        return app(req, res);
      }

      return res.status(503).json({
        status: 'error',
        message: 'Database connection failed. Please ensure a valid MONGO_URI is set in Vercel Environment Variables and that MongoDB Atlas allows access from all IPs (0.0.0.0/0).',
        details: err.message
      });
    }
  }
  return app(req, res);
}
