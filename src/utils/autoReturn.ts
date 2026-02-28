import pool from "../config/db";

export const autoReturnBookings = async () => {
  try {
    const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"
    
    // 1️⃣ Find bookings which are active but end date <= today
    const res = await pool.query(
      `SELECT * FROM bookings WHERE status='active' AND rent_end_date <= $1`,
      [today]
    );

    for (let booking of res.rows) {
      // 2️⃣ Update booking status
      await pool.query(`UPDATE bookings SET status='returned' WHERE id=$1`, [booking.id]);

      // 3️⃣ Update vehicle availability
      await pool.query(`UPDATE vehicles SET availability_status='available' WHERE id=$1`, [booking.vehicle_id]);

      console.log(`Booking ${booking.id} auto-marked as returned`);
    }
  } catch (err) {
    console.error("Error in auto-return:", err);
  }
};

// Run every hour
setInterval(autoReturnBookings, 1000 * 60 * 60); // 1 hour