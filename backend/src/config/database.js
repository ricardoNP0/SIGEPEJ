import dns from "dns";
import mongoose from "mongoose";
import { env } from "./env.js";

// Override DNS resolution to use Google DNS (fixes querySrv ECONNREFUSED on local network)
dns.setServers(["8.8.8.8", "8.8.4.4"]);

export async function connectDatabase() {
  mongoose.set("strictQuery", true);
  await mongoose.connect(env.mongoUri);
  console.log("MongoDB connected to SIGEPEJ");
}
