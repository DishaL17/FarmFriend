import db from "../config/db.js";

export const addTransaction = async (req, res) => {
  try {
    const { name, type, amount, crop } = req.body;

    const [result] = await db.query(
      "INSERT INTO transactions (userId, crop, name, type, amount) VALUES (?, ?, ?, ?, ?)",
      [req.userId, crop || "General", name, type, amount]
    );

    res.status(201).json({
      success: true,
      message: "Transaction added successfully",
      transaction: {
        id: result.insertId,
        userId: req.userId,
        crop: crop || "General",
        name,
        type,
        amount,
        date: new Date(),
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

export const getTransactions = async (req, res) => {
  try {
    const [transactions] = await db.query(
      "SELECT * FROM transactions WHERE userId = ? ORDER BY date DESC",
      [req.userId]
    );

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
};