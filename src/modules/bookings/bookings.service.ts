import pool from "../../config/db";

// Create Booking
export const createBooking = async (booking: {
  customer_id: number;
  vehicle_id: number;
  rent_start_date: string;
  rent_end_date: string;
}) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = booking;

  //  Vehicle available check
  const vehicleRes = await pool.query(`SELECT * FROM vehicles WHERE id=$1`, [vehicle_id]);
  const vehicle = vehicleRes.rows[0];
  if (!vehicle) throw new Error("Vehicle not found");
  if (vehicle.availability_status !== "available") throw new Error("Vehicle not available");

  //  Date validation
  const startDate = new Date(rent_start_date);
  const endDate = new Date(rent_end_date);
  if (endDate <= startDate) throw new Error("End date must be after start date");

  //  Calculate total price
  const diffTime = endDate.getTime() - startDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const total_price = diffDays * Number(vehicle.daily_rent_price);

  //  Insert booking
  const bookingRes = await pool.query(
    `INSERT INTO bookings (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
     VALUES ($1,$2,$3,$4,$5,'active') RETURNING *`,
    [customer_id, vehicle_id, rent_start_date, rent_end_date, total_price]
  );

  // Update vehicle status
  await pool.query(`UPDATE vehicles SET availability_status='booked' WHERE id=$1`, [vehicle_id]);

  return bookingRes.rows[0];
};

// Get all bookings (Admin) or own bookings (Customer)
export const getBookings = async (user: any) => {
  if (user.role === "admin") {
    const res = await pool.query(`SELECT * FROM bookings`);
    return res.rows;
  } else {
    const res = await pool.query(`SELECT * FROM bookings WHERE customer_id=$1`, [user.id]);
    return res.rows;
  }
};

// Update booking status
export const updateBooking = async (bookingId: number, user: any, action: string) => {
  const bookingRes = await pool.query(`SELECT * FROM bookings WHERE id=$1`, [bookingId]);
  const booking = bookingRes.rows[0];
  if (!booking) throw new Error("Booking not found");

  // Customer can cancel before start date
  if (user.role === "customer") {
    if (action === "cancel") {
      const now = new Date();
      if (now >= new Date(booking.rent_start_date)) throw new Error("Cannot cancel after start date");
      await pool.query(`UPDATE bookings SET status='cancelled' WHERE id=$1`, [bookingId]);
      await pool.query(`UPDATE vehicles SET availability_status='available' WHERE id=$1`, [booking.vehicle_id]);
      return { message: "Booking cancelled" };
    }
  }

  // Admin can mark returned
  if (user.role === "admin") {
    if (action === "return") {
      await pool.query(`UPDATE bookings SET status='returned' WHERE id=$1`, [bookingId]);
      await pool.query(`UPDATE vehicles SET availability_status='available' WHERE id=$1`, [booking.vehicle_id]);
      return { message: "Booking marked as returned" };
    }
  }

  throw new Error("Action not allowed");
};