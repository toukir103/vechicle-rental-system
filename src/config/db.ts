import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

// const pool = new Pool({
//   connectionString:
//     "postgresql://neondb_owner:npg_AM8CSg3Xiwvh@ep-lucky-meadow-aiuyfls2-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
//   ssl: {
//     rejectUnauthorized: false,
//   },
// });

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT) || 5432,
  ssl: { rejectUnauthorized: false }  // Neon DB SSL required
});

export default pool;
