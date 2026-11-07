import mysql from "mysql2/promise";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// Create temp connection to ensure the database exists
async function ensureDatabaseExists() {
  try {
    const tempConnection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : undefined,
    });
    await tempConnection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || "farmfriend"}\``);
    await tempConnection.end();
  } catch (err) {
    console.error("⚠️ Failed to ensure database exists, attempting direct connection pool:", err.message);
  }
}

await ensureDatabaseExists();

const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "farmfriend",
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : undefined,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function initializeTables() {
  let connection;
  try {
    connection = await db.getConnection();
    console.log("✅ MySQL Connected");

    // Create users table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(15) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        state VARCHAR(255),
        district VARCHAR(255),
        location VARCHAR(255),
        latitude DECIMAL(10, 8),
        longitude DECIMAL(11, 8),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create crops table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS crops (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT NOT NULL,
        crop VARCHAR(255) NOT NULL,
        area VARCHAR(255) NOT NULL,
        date VARCHAR(255) NOT NULL,
        soil_type VARCHAR(255),
        variety VARCHAR(255),
        irrigation_type VARCHAR(255),
        status VARCHAR(50) DEFAULT 'Active',
        harvested_date VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Ensure columns exist on older tables
    for (const col of ["soil_type", "variety", "irrigation_type", "status", "harvested_date"]) {
      try {
        await connection.query(`ALTER TABLE crops ADD COLUMN ${col} VARCHAR(255)`);
      } catch (err) {
        // column already exists
      }
    }

    // Create crop_info table for stage milestones and irrigation rules
    await connection.query(`
      CREATE TABLE IF NOT EXISTS crop_info (
        id INT AUTO_INCREMENT PRIMARY KEY,
        crop_name VARCHAR(255) UNIQUE NOT NULL,
        season VARCHAR(50),
        sprout_day INT DEFAULT 7,
        vegetative_day INT DEFAULT 30,
        flowering_day INT DEFAULT 60,
        harvest_day INT DEFAULT 100,
        irrigation_days VARCHAR(255)
      )
    `);

    // Populate crop_info defaults if table is empty
    const [infoCount] = await connection.query("SELECT COUNT(*) AS total FROM crop_info");
    if (infoCount[0].total === 0) {
      await connection.query(`
        INSERT INTO crop_info (crop_name, season, sprout_day, vegetative_day, flowering_day, harvest_day, irrigation_days) VALUES
        ('Wheat', 'Rabi', 7, 30, 70, 120, '20,40,60,80'),
        ('Rice', 'Kharif', 10, 40, 80, 140, '15,35,55,75,95'),
        ('Maize', 'Kharif', 6, 25, 60, 100, '20,45,70'),
        ('Soybean', 'Kharif', 5, 20, 45, 90, '15,35,55'),
        ('Cotton', 'Kharif', 8, 45, 75, 180, '20,40,60,90,120'),
        ('Sugarcane', 'Annual', 10, 60, 180, 365, '20,45,75,105,135,165,195'),
        ('Groundnut', 'Kharif', 6, 25, 45, 110, '20,40,60'),
        ('Mustard', 'Rabi', 6, 25, 55, 120, '20,40,60'),
        ('Chickpea', 'Rabi', 7, 30, 60, 110, '25,50,75'),
        ('Pigeon Pea', 'Kharif', 8, 45, 90, 180, '25,50,75,100'),
        ('Barley', 'Rabi', 7, 30, 65, 115, '20,40,60'),
        ('Pearl Millet', 'Kharif', 5, 20, 45, 85, '15,35,55'),
        ('Sorghum', 'Kharif', 6, 25, 50, 100, '20,40,60'),
        ('Sunflower', 'Kharif', 5, 25, 50, 95, '20,40,60'),
        ('Sesame', 'Kharif', 4, 20, 40, 90, '15,35,55')
      `);
    }

    // Create transactions table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT NOT NULL,
        crop VARCHAR(255) DEFAULT 'General',
        name VARCHAR(255) NOT NULL,
        type VARCHAR(50) NOT NULL,
        amount DECIMAL(12, 2) NOT NULL,
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

  } catch (err) {
    console.error("❌ MySQL Schema Initialization Failed:", err.message);
  } finally {
    if (connection) connection.release();
  }
}

await initializeTables();

export default db;
