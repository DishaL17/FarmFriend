import db from "../config/db.js";

export const getDistricts = async (req, res) => {
  try {
    const [districts] = await db.query(
      "SELECT id, name FROM districts ORDER BY name"
    );

    res.status(200).json(districts);
  } catch (error) {
    console.error("Error fetching districts:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getVillages = async (req, res) => {
  try {
    const { districtId } = req.params;

    const [villages] = await db.query(
      "SELECT id, name FROM villages WHERE district_id = ? ORDER BY name",
      [districtId]
    );

    res.status(200).json(villages);
  } catch (error) {
    console.error("Error fetching villages:", error);
    res.status(500).json({ message: "Server Error" });
  }
};