import Group from "../models/Group.js";
import User from "../models/User.js";

// Create a group
export const createGroup = async (req, res) => {
  try {
    const { name, members } = req.body;

    // Validate members exist
    const validMembers = await User.find({ _id: { $in: members } });
    if (validMembers.length !== members.length) {
      return res.status(400).json({ error: "One or more members are invalid" });
    }

    const group = new Group({
      name,
      members: validMembers.map((member) => member._id),
    });

    await group.save();
    res.status(201).json(group);
  } catch (error) {
    res.status(500).json({ error: "Failed to create group" });
  }
};

// Get all groups for a user
export const getGroups = async (req, res) => {
  try {
    const groups = await Group.find({ members: req.user._id }).populate(
      "members",
      "username email"
    );
    res.status(200).json(groups);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch groups" });
  }
};

// Add a member to a group
export const addMember = async (req, res) => {
  try {
    const { groupId, memberId } = req.body;

    // Check if member exists
    const member = await User.findById(memberId);
    if (!member) {
      return res.status(404).json({ error: "Member not found" });
    }

    // Add member to group
    const group = await Group.findByIdAndUpdate(
      groupId,
      { $addToSet: { members: memberId } },
      { new: true }
    ).populate("members", "username email");

    res.status(200).json(group);
  } catch (error) {
    res.status(500).json({ error: "Failed to add member" });
  }
};

// Remove a member from a group
export const removeMember = async (req, res) => {
  try {
    const { groupId, memberId } = req.body;

    // Remove member from group
    const group = await Group.findByIdAndUpdate(
      groupId,
      { $pull: { members: memberId } },
      { new: true }
    ).populate("members", "username email");

    res.status(200).json(group);
  } catch (error) {
    res.status(500).json({ error: "Failed to remove member" });
  }
};

// Delete a group
export const deleteGroup = async (req, res) => {
  try {
    const { groupId } = req.params;

    // Delete the group
    await Group.findByIdAndDelete(groupId);
    res.status(200).json({ message: "Group deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete group" });
  }
};
