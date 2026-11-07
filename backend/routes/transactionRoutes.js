import express from "express";
import {
addTransaction,
getTransactions
} from "../controllers/transactionController.js";

import auth from "../middleware/auth.js";
import demoMiddleware from "../middleware/demoMiddleware.js";

const router = express.Router();

// Demo users cannot add transactions
router.post("/", auth, demoMiddleware, addTransaction);

// Both normal and demo users can view transactions
router.get("/", auth, getTransactions);

export default router;
