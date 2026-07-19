import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"

import connectDB from "./config/db.js";
import User from "./models/user.js";
import Crop from "./models/Crop.js";
import Transaction from "./models/Transaction.js"

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.post("/login", async (req, res) => {
  try {
    const { phone, password } = req.body;

    // Find user
    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Send response
    res.json({
      success: true,
      token,
      user: {
        name: user.name,
        phone: user.phone,
      },
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

app.post("/register", async (req, res) => {
    const {name, phone, password } = req.body;
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
    return res.json({
        success: false,
        message: "User already exists",
    });
}
   const hashedPassword = await bcrypt.hash(password, 10);
   const user = new User({
    name,
    phone,
    password: hashedPassword,
});
 await user.save();

    res.json({
        success: true,
        message: "User Registered Successfully",
    });

});

app.post("/addcrop", async (req, res) => {
  try {
    const { crop, area, date } = req.body;

    const newCrop = new Crop({
      crop,
      area,
      date,
    });

    await newCrop.save();

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
});

app.get("/crops", async (req, res) => {
  try {
    const crops = await Crop.find();

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
});

app.post("/addtransaction", async (req, res) => {
  try {
    const { name, type, amount, crop } = req.body;

    const newTransaction = new Transaction({
      crop: crop || "General",
      name,
      type,
      amount,
    });


    await newTransaction.save();

    res.status(201).json({
      success: true,
      message: "Transaction added successfully",
      transaction: newTransaction,
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

app.get("/transactions", async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ date: -1 });

    res.json({
      success: true,
      transactions,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Failed to fetch transactions",
    });
  }
});

app.get("/api/mandi/:commodity", async (req, res) => {
  try {
    const commodity = req.params.commodity;

    const url =
      `https://api.data.gov.in/resource/35985678-0d79-46b4-9ed6-6f13308a1d24` +
      `?api-key=${process.env.AGMARK_API_KEY}` +
      `&format=json` +
      `&limit=20` +
      `&filters[Commodity]=${encodeURIComponent(commodity)}`;

    const response = await fetch(url);
    const data = await response.json();

    res.json(data.records);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: err.message,
    });
  }
});

const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});