import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js'; // Assuming you have a DB connection file
import userRoutes from './routes/userRoutes.js';
import timeTableRoutes from "./routes/timetableRoutes.js"
// import groups from "./controllers/groupController.js";
import groups from "./routes/groupRoutes.js"
import bcrypt from "bcrypt"
// ... other imports

dotenv.config();

connectDB();

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use("/api/timetable",timeTableRoutes);
app.use("/api/groups",groups);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
