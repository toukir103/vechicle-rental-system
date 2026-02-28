import { Request, Response } from "express";
import { signupUser, signinUser } from "./auth.service";

export const signupController = async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone, role } = req.body;
    const user = await signupUser(name, email, password, phone, role);
    res.status(201).json({ message: "User created", user });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const signinController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await signinUser(email, password);
    res.json(result);
  } catch (err: any) {
    res.status(401).json({ error: err.message });
  }
};