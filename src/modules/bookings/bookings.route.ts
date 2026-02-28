import { Router } from "express";
import {
  createBookingController,
  getBookingsController,
  updateBookingController
} from "./bookings.controller";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();

// Protected routes (Customer & Admin)
router.post("/", authMiddleware, createBookingController);
router.get("/", authMiddleware, getBookingsController);
router.put("/:bookingId", authMiddleware, updateBookingController);

export default router;