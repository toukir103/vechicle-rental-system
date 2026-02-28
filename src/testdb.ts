import pool from "./config/db";


// Test connection
export const testConnection = async () => {
  try {
    const client = await pool.connect();
    const res = await client.query('SELECT NOW()');
    console.log('database connect ok');
    client.release();
  } catch (err) {
    console.error('PostgreSQL connection error:', err);
  }
};