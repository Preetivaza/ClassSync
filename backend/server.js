// import express from "express";
// import dotenv from "dotenv";
// import connectDB from "./config/db.js";
// // import authRoutes from "./routes/authRoutes.js";

// dotenv.config();
// connectDB();

// const app = express();
// app.use(express.json());

// app.use("/api/auth", authRoutes);

// server.js or app.js (example snippet)
import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js'; // Assuming you have a DB connection file
import userRoutes from './routes/userRoutes.js';
import bcrypt from "bcrypt"
// ... other imports

dotenv.config();

connectDB();

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
// ... other routes


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
