import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"

import connectDB from "./config/db.js";
import User from "./models/user.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.post("/login", async (req, res) => {
    const { phone, password } = req.body;
    const user = await User.findOne({ phone });
    const isMatch = await bcrypt.compare(password, user.password);
    if(isMatch){
        const token = jwt.sign(
         { id: user._id },
         process.env.JWT_SECRET,
         { expiresIn: "7d" }
);
    }
   
    res.json({
  success: true,
  token,
  user: {
    name: user.name,
    phone: user.phone,
  },
});

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


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});