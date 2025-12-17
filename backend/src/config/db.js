import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
  ssl: {
    rejectUnauthorized: false
  },
});

pool.connect()
  .then(() => console.log("[DB] - Connected to the database"))
  .catch((err) => {
    console.error("[DB] - Connection error:");
  });

export default pool;