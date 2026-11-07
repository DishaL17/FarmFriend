import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, ".env") });

import express from "express";
import cors from "cors";

import "./config/db.js";

import aiRoutes from "./routes/aiRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import cropRoutes from "./routes/cropRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import locationRoutes from "./routes/locationRoutes.js";
import mandiRoutes from "./routes/mandiprices.js";

import fs from "fs";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Health Check Routes (essential for Docker, Render, Railway, K8s probes)
app.get(["/health", "/api/health"], (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "FarmFriend API",
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    version: "1.0.0",
  });
});

// API Routes
app.use("/api/ai", aiRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/crops", cropRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/location", locationRoutes);
app.use("/api/mandi", mandiRoutes);

// Optional: serve static build in unified single-server deployment
const clientDistPath = path.resolve(__dirname, "../client/dist");
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
}

// Global 404 / SPA fallback handler (Express 5 compatible)
app.use((req, res) => {
  if (req.path.startsWith("/api")) {
    return res.status(404).json({ success: false, message: "API endpoint not found" });
  }
  if (fs.existsSync(clientDistPath)) {
    return res.sendFile(path.resolve(clientDistPath, "index.html"));
  }
  res.status(404).send("Not Found");
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
