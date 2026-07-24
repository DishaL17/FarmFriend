import express from "express";
import {
  addTransaction,
  getTransactions,
} from "../controllers/transactionController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/", auth, addTransaction);
router.get("/", auth, getTransactions);

export default router;