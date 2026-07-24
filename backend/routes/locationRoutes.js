import express from "express";
import {
  getDistricts,
  getVillages,
} from "../controllers/locationController.js";

const router = express.Router();


router.get("/districts", getDistricts);


router.get("/villages/:districtId", getVillages);

export default router;