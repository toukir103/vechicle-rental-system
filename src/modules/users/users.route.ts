import { Router } from "express";
import {
  getAllUsersController,
  updateUserController,
  deleteUserController
} from "./users.controller";

import { authMiddleware } from "../../middleware/auth.middleware";
import { adminMiddleware } from "../../middleware/role.middleware";

const router = Router();

// Admin only
router.get("/", authMiddleware, adminMiddleware, getAllUsersController);
router.delete("/:userId", authMiddleware, adminMiddleware, deleteUserController);

// Admin or own profile
router.put("/:userId", authMiddleware, updateUserController);

export default router;