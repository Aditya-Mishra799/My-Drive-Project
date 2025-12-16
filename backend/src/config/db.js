import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl : {rejectUnauthorized: false}
})

// pool.on("connect", async (client) => {
//   await client.query('SET search_path TO public');
// });

pool.connect()
.then(()=>console.log("[DB] - Connected to the database"))
.catch(()=>console.error("[DB] - Error connecting to the database"));

export default pool;