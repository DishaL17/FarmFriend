import db from "../config/db.js";

export const addCrop = async (req, res) => {
  try {
    const { crop, area, date } = req.body;

    await db.query(
      "INSERT INTO crops (userId, crop, area, date) VALUES (?, ?, ?, ?)",
      [req.userId, crop, area, date]
    );

    res.json({
      success: true,
      message: "Crop added successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const getCrops = async (req, res) => {
  try {
    const [crops] = await db.query(
      `SELECT
        c.*,
        ci.sprout_day,
        ci.vegetative_day,
        ci.flowering_day,
        ci.harvest_day,
        ci.irrigation_days
      FROM crops c
      LEFT JOIN crop_info ci
        ON LOWER(c.crop) = LOWER(ci.crop_name)
      WHERE c.userId = ?`,
      [req.userId]
    );

    res.json({
      success: true,
      crops,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch crops",
    });
  }
};
