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
    }
  }
  return app(req, res);
}
