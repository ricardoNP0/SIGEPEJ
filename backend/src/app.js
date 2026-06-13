import cors from "cors";
import express from "express";
import helmet from "helmet";
import path from "path";
import { env } from "./config/env.js";
import healthRoutes from "./routes/healthRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import requestRoutes from "./routes/requestRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import catalogRoutes from "./routes/catalogRoutes.js";
import auditRoutes from "./routes/auditRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";

export function createApp() {
  const app = express();

  // Configurar CORS para múltiples orígenes
  const corsOptions = {
    origin: function (origin, callback) {
      const allowedOrigins = Array.isArray(env.frontendUrl) 
        ? env.frontendUrl 
        : [env.frontendUrl];
      
      // Permitir sin origin (para preflight y desarrollo)
      // o si está en la lista de permitidos
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`CORS: Origen rechazado: ${origin}`);
        callback(null, true); // Permitir incluso orígenes no autorizados en desarrollo
      }
    },
    credentials: true,
    optionsSuccessStatus: 200,
  };

  app.use(helmet());
  app.use(cors(corsOptions));
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use("/uploads", express.static(path.resolve("uploads")));

  app.get("/", (req, res) => {
    res.json({
      name: "SIGEPEJ API",
      status: "online",
      docs: "/api/health",
    });
  });

  app.use("/api/health", healthRoutes);
  app.use("/api/requests", requestRoutes);
  app.use("/api/attendance", attendanceRoutes);
  app.use("/api/notifications", notificationRoutes);
  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/catalogs", catalogRoutes);
  app.use("/api/audit", auditRoutes);
  app.use("/api/reports", reportRoutes);

  app.use((req, res) => {
    res.status(404).json({ message: "Ruta no encontrada" });
  });

  return app;
}

