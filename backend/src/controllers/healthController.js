import mongoose from "mongoose";

export function getHealth(req, res) {
  res.json({
    ok: true,
    service: "SIGEPEJ API",
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
  });
}
