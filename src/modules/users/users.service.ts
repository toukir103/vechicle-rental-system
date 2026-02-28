import pool from "../../config/db";
import bcrypt from "bcrypt";

const saltRounds = 10;

// Get all users (Admin)
export const getAllUsers = async () => {
  const res = await pool.query(`SELECT id, name, email, phone, role FROM users`);
  return res.rows;
};

// Update user
export const updateUser = async (userId: number, user: any, data: any) => {
  // Customer can update only own profile
  if (user.role === "customer" && user.id !== userId) {
    throw new Error("Not allowed");
  }

  // Hash password if updating
  if (data.password) {
    data.password = await bcrypt.hash(data.password, saltRounds);
  }

  const fields = Object.keys(data);
  const values = Object.values(data);
  const setString = fields.map((field, index) => `${field}=$${index + 1}`).join(", ");

  const result = await pool.query(
    `UPDATE users SET ${setString} WHERE id=$${fields.length + 1} RETURNING id, name, email, phone, role`,
    [...values, userId]
  );
  return result.rows[0];
};

// Delete user (Admin only)
export const deleteUser = async (userId: number) => {
  // Optional: check active bookings before delete
  const res = await pool.query(`DELETE FROM users WHERE id=$1 RETURNING id, name, email`, [userId]);
  return res.rows[0];
};