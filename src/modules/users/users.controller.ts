import { Request, Response } from "express";
import * as userService from "./users.service";

export const getAllUsersController = async (req: Request, res: Response) => {
  try {
    const users = await userService.getAllUsers();
    res.json({ users });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateUserController = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const updatedUser = await userService.updateUser(Number(req.params.userId), user, req.body);
    res.json({ message: "User updated", user: updatedUser });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteUserController = async (req: Request, res: Response) => {
  try {
    const deletedUser = await userService.deleteUser(Number(req.params.userId));
    res.json({ message: "User deleted", user: deletedUser });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};