import express from "express";
import auth from "../middleware/auth.js";
import db from "../config/db.js";

const router = express.Router();

const API_KEY = process.env.AGMARK_API_KEY;

function toTitleCase(str) {
  if (!str) return "";
  return str
    .toLowerCase()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

router.get("/:commodity", auth, async (req, res) => {
  const commodity = req.params.commodity;

  try {
    // Get user's state and district from database
    const [users] = await db.query(
      "SELECT state, district FROM users WHERE id = ?",
      [req.userId]
    );

    let districtFilter = "";
    let stateFilter = "";

    if (users.length > 0) {
      const { state, district } = users[0];
      if (district) {
        let formattedDistrict = toTitleCase(district.trim());
        
        // Explicitly map Narmadapuram to the legacy name Hoshangabad used in Agmarknet API
        if (formattedDistrict === "Narmadapuram") {
          formattedDistrict = "Hoshangabad";
        }
        
        districtFilter = `&filters[District]=${encodeURIComponent(formattedDistrict)}`;
      }
      if (state) {
        const formattedState = toTitleCase(state.trim());
        stateFilter = `&filters[State]=${encodeURIComponent(formattedState)}`;
      }
    }

    const urlWithDistrict =
      `https://api.data.gov.in/resource/35985678-0d79-46b4-9ed6-6f13308a1d24` +
      `?api-key=${API_KEY}` +
      `&format=json` +
      `&limit=50` +
      `&filters[Commodity]=${encodeURIComponent(commodity)}` +
      districtFilter +
      stateFilter;

    console.log("Fetching local Mandi prices:", urlWithDistrict);

    let response = await fetch(urlWithDistrict);
    let data = await response.json();
    
    // Log the first record as requested by the user
    console.log("First Mandi record (local):", data.records?.[0]);
    
    let records = data.records || [];

    // Fallback: If no records found locally for the district, fetch state-wide prices
    if (records.length === 0 && stateFilter) {
      const urlStateWide =
        `https://api.data.gov.in/resource/35985678-0d79-46b4-9ed6-6f13308a1d24` +
        `?api-key=${API_KEY}` +
        `&format=json` +
        `&limit=50` +
        `&filters[Commodity]=${encodeURIComponent(commodity)}` +
        stateFilter;

      console.log("No local prices, falling back to state-wide:", urlStateWide);
      response = await fetch(urlStateWide);
      data = await response.json();
      
      // Log the first record of the fallback query as well
      console.log("First Mandi record (fallback):", data.records?.[0]);
      
      records = data.records || [];
    }

    res.json(records);
  } catch (err) {
    console.error("Mandi prices retrieval error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;