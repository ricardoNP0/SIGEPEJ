import dotenv from "dotenv";

dotenv.config();

const required = ["MONGO_URI", "JWT_SECRET"];

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Variable de entorno faltante: ${key}`);
  }
}

export const env = {
  port: Number(process.env.PORT || 5000),
  nodeEnv: process.env.NODE_ENV || "development",
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "8h",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",
  uploadDir: process.env.UPLOAD_DIR || "uploads/evidences",
  publicUploadBaseUrl: process.env.PUBLIC_UPLOAD_BASE_URL || "http://localhost:5000/uploads",
};
