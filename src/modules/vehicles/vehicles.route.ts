import { Router } from "express";
import {
  addVehicleController,
  getAllVehiclesController,
  getVehicleByIdController,
  updateVehicleController,
  deleteVehicleController
} from "./vehicles.controller";

import { authMiddleware } from "../../middleware/auth.middleware";
import { adminMiddleware } from "../../middleware/role.middleware";

const router = Router();

// Public routes
router.get("/", getAllVehiclesController);
router.get("/:vehicleId", getVehicleByIdController);

// Admin routes
router.post("/", authMiddleware, adminMiddleware, addVehicleController);
router.put("/:vehicleId", authMiddleware, adminMiddleware, updateVehicleController);
router.delete("/:vehicleId", authMiddleware, adminMiddleware, deleteVehicleController);

export default router;