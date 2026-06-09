import dns from "dns";
import mongoose from "mongoose";
import { env } from "./env.js";

// Usa DNS de Google para resolver SRV de MongoDB Atlas en redes locales restrictivas
dns.setServers(["8.8.8.8", "8.8.4.4"]);

export async function connectDatabase() {
  mongoose.set("strictQuery", true);
  await mongoose.connect(env.mongoUri);
  console.log("MongoDB connected to SIGEPEJ");
}
