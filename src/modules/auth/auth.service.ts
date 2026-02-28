
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../../config/db";

const saltRounds = 10;

export const signupUser = async (name: string, email: string, password: string, phone: string, role: string) => {
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const result = await pool.query(
    `INSERT INTO users (name,email,password,phone,role) VALUES ($1,$2,$3,$4,$5) RETURNING id,name,email,role`,
    [name, email.toLowerCase(), hashedPassword, phone, role]
  );
  return result.rows[0];
};

export const signinUser = async (email: string, password: string) => {
  const result = await pool.query(`SELECT * FROM users WHERE email=$1`, [email.toLowerCase()]);
  const user = result.rows[0];
  if (!user) throw new Error("Invalid credentials");

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error("Invalid credentials");

  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: "1d" });
  return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
};