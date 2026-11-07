import db from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getCoordinates } from "../utils/geocode.js";

export const register = async (req, res) => {
  try {
    const { name, phone, password, state, district, location } = req.body;

    if (phone.length !== 10) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid 10-digit phone number",
      });
    }

    // Check if user already exists
    const [existingUsers] = await db.query("SELECT * FROM users WHERE phone = ?", [phone]);
    if (existingUsers.length > 0) {
      return res.json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Geocode location
    let latitude = null;
    let longitude = null;
    try {
      const coords = await getCoordinates(location, district, state);
      latitude = coords.latitude;
      longitude = coords.longitude;
    } catch (err) {
      console.warn("Geocoding failed during registration:", err.message);
    }

    // Insert user into database
    await db.query(
      `INSERT INTO users (name, phone, password, state, district, location, latitude, longitude) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, phone, hashedPassword, state, district, location, latitude, longitude]
    );

    res.json({
      success: true,
      message: "Registration Successful",
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { phone, password } = req.body;

    // Find user
    const [users] = await db.query("SELECT * FROM users WHERE phone = ?", [phone]);
    if (users.length === 0) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const user = users[0];

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }

    // Generate JWT
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        state: user.state,
        district: user.district,
        location: user.location,
        latitude: user.latitude,
        longitude: user.longitude,
      },
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const me = async (req, res) => {
  try {
    const [users] = await db.query(
      "SELECT id, name, phone, state, district, location, latitude, longitude FROM users WHERE id = ?",
      [req.userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user: users[0],
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
export const demoLogin = async (req, res) => {
try {
// Find the demo account
const [users] = await db.query(
"SELECT * FROM users WHERE is_demo = TRUE LIMIT 1"
);


if (users.length === 0) {
  return res.status(404).json({
    success: false,
    message: "Demo account is not configured yet",
  });
}

const user = users[0];

// Generate JWT for demo account
const token = jwt.sign(
  { id: user.id },
  process.env.JWT_SECRET,
  { expiresIn: "7d" }
);

res.json({
  success: true,
  token,
  user: {
    id: user.id,
    name: user.name,
    phone: user.phone,
    state: user.state,
    district: user.district,
    location: user.location,
    latitude: user.latitude,
    longitude: user.longitude,
    isDemo: true,
  },
});


} catch (err) {
console.error("Demo login error:", err);


res.status(500).json({
  success: false,
  message: "Server Error",
});


}
};
