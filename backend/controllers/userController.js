import User from "../models/User.js";

// Get current user profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("groups");
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
  try {
    const { username, email } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { username, email },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: "Failed to update user profile" });
  }
};
