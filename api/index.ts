import type { VercelRequest, VercelResponse } from "@vercel/node";
import express, { type Request, Response } from "express";
import { registerRoutes } from "../server/routes";
import { createServer } from "http";

const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));

const httpServer = createServer(app);

let routesRegistered = false;

async function ensureRoutes() {
  if (!routesRegistered) {
    await registerRoutes(httpServer, app);
    routesRegistered = true;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await ensureRoutes();
  
  const expressReq = req as unknown as Request;
  const expressRes = res as unknown as Response;
  
  return new Promise<void>((resolve, reject) => {
    expressRes.on('finish', () => resolve());
    expressRes.on('error', reject);
    
    app(expressReq, expressRes, (err: any) => {
      if (err) {
        console.error('Express error:', err);
        if (!expressRes.headersSent) {
          expressRes.status(500).json({ error: 'Internal Server Error' });
        }
        resolve();
      }
    });
  });
}
