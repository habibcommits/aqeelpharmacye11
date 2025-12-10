import express from "express";
import { registerRoutes } from "../server/routes.js";
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

export default async function handler(req, res) {
  await ensureRoutes();
  return app(req, res);
}
