import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import cropRoutes from "./routes/cropRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import locationRoutes from "./routes/locationRoutes.js";
import mandiRoutes from "./routes/mandiprices.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/crops", cropRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/location", locationRoutes);
app.use("/api/mandi", mandiRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});