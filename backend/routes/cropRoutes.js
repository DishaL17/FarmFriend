import express from "express";
import auth from "../middleware/auth.js";

import {
  addCrop,
  getCrops,
} from "../controllers/cropController.js";

const router = express.Router();

router.post("/", auth, addCrop);
router.get("/", auth, getCrops);

export default router;