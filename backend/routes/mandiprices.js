import express from "express";

const router = express.Router();

const API_KEY = process.env.AGMARK_API_KEY;

router.get("/mandi/:commodity", async (req, res) => {
  const commodity = req.params.commodity;

  try {
    const url =
      `https://api.data.gov.in/resource/35985678-0d79-46b4-9ed6-6f13308a1d24` +
      `?api-key=${API_KEY}` +
      `&format=json` +
      `&limit=20` +
      `&filters[Commodity]=${encodeURIComponent(commodity)}`;

    const response = await fetch(url);
    const data = await response.json();

    res.json(data.records);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;