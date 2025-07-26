// controllers/userController.js
// import User from '../models/User.js';
import User from '../models/User.js';

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs'; 

// Generate JWT token
const generateToken = (id) => {
  // Ensure you have JWT_SECRET in your .env file
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d', // Token expires in 30 days
  });
};

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // 1. Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // 2. Create user (password will be hashed by pre-save middleware in the model)
    const user = await User.create({
      name,
      email,
      password, // This will be hashed before saving due to the pre('save') hook in User model
      role,
    });

    if (user) {
      // 3. Respond with user data and token
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
        token: generateToken(user._id), // Generate and send JWT token
      });
    } else {
      res.status(400).json({ message: 'Invalid user data received' });
    }
  } catch (error) {
    console.error("Error in registerUser:", error); // Log error for debugging
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(err => err.message);
        return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server Error' }); // Generic error message
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/users/login
// @access  Public
export const authUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find user by email
    const user = await User.findOne({ email });

    // 2. Check if user exists and password is correct
    if (user && (await user.comparePassword(password))) { // comparePassword is a method defined in the User model
      // 3. Respond with user data and token
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
        token: generateToken(user._id), // Generate and send JWT token
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error("Error in authUser:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private (Requires valid JWT token)
export const getUserProfile = async (req, res) => {
  try {
    // req.user is attached by the auth middleware
    const user = await User.findById(req.user._id).select('-password'); // Exclude password from the response

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error("Error in getUserProfile:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private (Requires valid JWT token)
export const updateUserProfile = async (req, res) => {
  try {
    // req.user is attached by the auth middleware
    const user = await User.findById(req.user._id);

    if (user) {
      // Update fields if provided in the request body
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.profilePicture = req.body.profilePicture || user.profilePicture;

      // Only update password if provided
      if (req.body.password) {
        user.password = req.body.password; // Will be hashed by pre-save hook
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        profilePicture: updatedUser.profilePicture,
        token: generateToken(updatedUser._id), // Send new token in case password changed
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error("Error in updateUserProfile:", error);
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(err => err.message);
        return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private (Requires valid JWT token)
export const getUserById = async (req, res) => {
    try {
        // Find user by ID, excluding password field
        const user = await User.findById(req.params.id).select('-password');

        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error("Error in getUserById:", error);
        // Handle invalid ObjectId format
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid user ID format' });
        }
        res.status(500).json({ message: 'Server Error' });
    }
};

