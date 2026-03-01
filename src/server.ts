import app from "./app";
import { createTables } from "./createTables";
import authRoutes from "./modules/auth/auth.route";
import { testConnection } from "./testdb";
import vehicleRoutes from "./modules/vehicles/vehicles.route";
import bookingRoutes from "./modules/bookings/bookings.route";
import userRoutes from "./modules/users/users.route";
import "./utils/autoReturn"; 

const PORT = process.env.PORT || 5000;

const main = async () => {
  await testConnection();
  await createTables();
};

// Call the main function
main().catch((err) => {
  console.error("Error in startup:", err);
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/vehicles", vehicleRoutes);
app.use("/api/v1/bookings", bookingRoutes);
app.use("/api/v1/users", userRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
