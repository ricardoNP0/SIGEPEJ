import cors from "cors";
import express from "express";
import helmet from "helmet";
import path from "path";

import { env } from "./config/env.js";

import healthRoutes from "./routes/healthRoutes.js";
import requestRoutes from "./routes/requestRoutes.js";

export function createApp() {
  const app = express();

  // Middlewares globales
  app.use(helmet());

  app.use(
    cors({
      origin: env.frontendUrl,
      credentials: true,
    })
  );

  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true }));

  // Archivos estáticos
  app.use(
    "/uploads",
    express.static(path.resolve("uploads"))
  );

  // Ruta principal
  app.get("/", (req, res) => {
    res.json({
      name: "SIGEPEJ API",
      status: "online",
      docs: "/api/health",
    });
  });

  // Rutas API
  app.use("/api/health", healthRoutes);
  app.use("/api/requests", requestRoutes);
  app.use(
  "/uploads",
  express.static(path.resolve("uploads"))
);

  // 404
  app.use((req, res) => {
    res.status(404).json({
      message: "Ruta no encontrada",
    });
  });

  return app;
}