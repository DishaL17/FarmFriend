import jwt from "jsonwebtoken";
import db from "../config/db.js";

export default async function (req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader)
    return res.status(401).json({ message: "No Token" });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Verify user exists in the MySQL database and ID is an integer
    const userId = Number(decoded.id);
    if (isNaN(userId)) {
      return res.status(401).json({ message: "Invalid Token" });
    }

   const [users] = await db.query(
  "SELECT id, is_demo FROM users WHERE id = ?",
  [userId]
);

if (users.length === 0) {
  return res.status(401).json({
    message: "User not found, please log in again"
  });
}

req.userId = userId;
req.isDemo = Boolean(users[0].is_demo);

next();
  } catch (err) {
    res.status(401).json({
      message: "Invalid Token",
    });
  }
}