import db from "../config/db.js";

export const addCrop = async (req, res) => {
  try {
    const {
      crop,
      area,
      date,
      soil_type,
      variety,
      irrigation_type,
    } = req.body;

    if (!crop || !area || !date || !soil_type || !irrigation_type) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields.",
      });
    }

    await db.query(
      `INSERT INTO crops
      (userId, crop, area, date, soil_type, variety, irrigation_type)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        req.userId,
        crop,
        area,
        date,
        soil_type,
        variety || null,
        irrigation_type,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Crop added successfully!",
    });
  } catch (err) {
    console.error("Add Crop Error:", err);

    res.status(500).json({
      success: false,
      message: "Failed to add crop.",
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
        ci.irrigation_days,
        COALESCE(
          (SELECT SUM(CASE WHEN t.type = 'Income' THEN t.amount ELSE -t.amount END)
           FROM transactions t
           WHERE t.userId = c.userId AND LOWER(t.crop) = LOWER(c.crop)
          ), 0
        ) AS balance
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

export const updateCropStatus = async (req, res) => {
  try {
    const { cropId } = req.params;
    const { status = "Harvested" } = req.body;

    const [result] = await db.query(
      "UPDATE crops SET status = ? WHERE id = ? AND userId = ?",
      [status, cropId, req.userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Crop not found or unauthorized.",
      });
    }

    res.json({
      success: true,
      message: `Crop marked as ${status} successfully!`,
      status,
    });
  } catch (err) {
    console.error("Update Crop Status Error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to update crop status.",
    });
  }
};
