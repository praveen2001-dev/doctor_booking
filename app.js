import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import AppointmentRoutes from "./routes/AppointmentRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080; 
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/api/appointments', AppointmentRoutes);

connectDB.then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});