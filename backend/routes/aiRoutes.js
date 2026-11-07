import express from "express";

import {
  getExpenseSummary,
  getExpenseRecommendations,
  getPesticidePrices,
  getCropCareAdvice,
  getWeatherCropAdvisory,
} from "../controllers/aiController.js";

import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/expense-summary", auth, getExpenseSummary);
router.get("/expense-recommendations", auth, getExpenseRecommendations);
router.get("/pesticide-prices", auth, getPesticidePrices);

router.get("/crop-care", auth, getCropCareAdvice);
router.post("/crop-care", auth, getCropCareAdvice);

router.post("/weather-advisory", auth, getWeatherCropAdvisory);
router.get("/weather-advisory", auth, getWeatherCropAdvisory);

export default router;
