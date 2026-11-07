import express from "express";
import auth from "../middleware/auth.js";
import demoMiddleware from "../middleware/demoMiddleware.js";
import { addCrop, getCrops, updateCropStatus } from "../controllers/cropController.js";

const router = express.Router();

// Demo users cannot add crops
router.post("/", auth, demoMiddleware, addCrop);

// Both normal and demo users can view crops
router.get("/", auth, getCrops);

// Update crop harvest status (allowed for both demo and regular users to test lifecycle transition)
router.patch("/:cropId/harvest", auth, updateCropStatus);
router.put("/:cropId/status", auth, updateCropStatus);

export default router;
