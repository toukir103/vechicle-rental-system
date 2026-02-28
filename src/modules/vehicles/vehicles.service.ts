import pool from "../../config/db";

export const addVehicle = async (vehicle: {
  vehicle_name: string;
  type: string;
  registration_number: string;
  daily_rent_price: number;
  availability_status: string;
}) => {
  const result = await pool.query(
    `INSERT INTO vehicles (vehicle_name, type, registration_number, daily_rent_price, availability_status)
     VALUES ($1,$2,$3,$4,$5) RETURNING *`,
    [vehicle.vehicle_name, vehicle.type, vehicle.registration_number, vehicle.daily_rent_price, vehicle.availability_status]
  );
  return result.rows[0];
};

export const getAllVehicles = async () => {
  const result = await pool.query(`SELECT * FROM vehicles`);
  return result.rows;
};

export const getVehicleById = async (id: number) => {
  const result = await pool.query(`SELECT * FROM vehicles WHERE id=$1`, [id]);
  return result.rows[0];
};

export const updateVehicle = async (id: number, data: any) => {
  const fields = Object.keys(data);
  const values = Object.values(data);

  const setString = fields.map((field, index) => `${field}=$${index + 1}`).join(", ");

  const result = await pool.query(`UPDATE vehicles SET ${setString} WHERE id=$${fields.length + 1} RETURNING *`, [...values, id]);
  return result.rows[0];
};

export const deleteVehicle = async (id: number) => {
  // Check active bookings before delete (optional for now)
  const result = await pool.query(`DELETE FROM vehicles WHERE id=$1 RETURNING *`, [id]);
  return result.rows[0];
};