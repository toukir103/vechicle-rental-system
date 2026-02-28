import { Request, Response } from "express";
import * as bookingService from "./bookings.service";

export const createBookingController = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const booking = await bookingService.createBooking({ ...req.body, customer_id: user.id });
    res.status(201).json({ message: "Booking created", booking });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const getBookingsController = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const bookings = await bookingService.getBookings(user);
    res.json({ bookings });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateBookingController = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { action } = req.body; // "cancel" or "return"
    const result = await bookingService.updateBooking(Number(req.params.bookingId), user, action);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};