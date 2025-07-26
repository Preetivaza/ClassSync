import express from 'express';
const router = express.Router();
import {
  registerUser,
  authUser,
  getUserProfile,
  updateUserProfile,
  getUserById
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js'; // You need to implement this middleware

// Public Routes
router.post('/register', registerUser);
router.post('/login', authUser);

// Protected Routes (require JWT token)
router.get('/profile', protect, getUserProfile); // Get current user's profile
router.put('/profile', protect, updateUserProfile); // Update current user's profile
router.get('/:id', protect, getUserById); // Get any user's profile by ID (consider if this should be restricted)

export default router;
