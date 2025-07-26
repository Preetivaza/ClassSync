// import Group from "../models/Group.js";
// import User from "../models/User.js";

// // Create a group
// export const createGroup = async (req, res) => {
//   try {
//     const { name, members } = req.body;

//     // Validate members exist
//     const validMembers = await User.find({ _id: { $in: members } });
//     if (validMembers.length !== members.length) {
//       return res.status(400).json({ error: "One or more members are invalid" });
//     }

//     const group = new Group({
//       name,
//       members: validMembers.map((member) => member._id),
//     });

//     await group.save();
//     res.status(201).json(group);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to create group" });
//   }
// };

// // Get all groups for a user
// export const getGroups = async (req, res) => {
//   try {
//     const groups = await Group.find({ members: req.user._id }).populate(
//       "members",
//       "username email"
//     );
//     res.status(200).json(groups);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to fetch groups" });
//   }
// };

// // Add a member to a group
// export const addMember = async (req, res) => {
//   try {
//     const { groupId, memberId } = req.body;

//     // Check if member exists
//     const member = await User.findById(memberId);
//     if (!member) {
//       return res.status(404).json({ error: "Member not found" });
//     }

//     // Add member to group
//     const group = await Group.findByIdAndUpdate(
//       groupId,
//       { $addToSet: { members: memberId } },
//       { new: true }
//     ).populate("members", "username email");

//     res.status(200).json(group);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to add member" });
//   }
// };

// // Remove a member from a group
// export const removeMember = async (req, res) => {
//   try {
//     const { groupId, memberId } = req.body;

//     // Remove member from group
//     const group = await Group.findByIdAndUpdate(
//       groupId,
//       { $pull: { members: memberId } },
//       { new: true }
//     ).populate("members", "username email");

//     res.status(200).json(group);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to remove member" });
//   }
// };

// // Delete a group
// export const deleteGroup = async (req, res) => {
//   try {
//     const { groupId } = req.params;

//     // Delete the group
//     await Group.findByIdAndDelete(groupId);
//     res.status(200).json({ message: "Group deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ error: "Failed to delete group" });
//   }
// };


import Group from "../models/Group.js";
import User from "../models/User.js";

// Create a new group
export const createGroup = async (req, res) => {
  try {
    const { name, description, visibility } = req.body;
    const createdBy = req.user.id;

    // Validate visibility
    if (!["public", "private", "invite-only"].includes(visibility)) {
      return res.status(400).json({ error: "Invalid visibility option" });
    }

    // Create the group
    const group = new Group({
      name,
      description,
      visibility,
      createdBy,
      members: [createdBy], // Add creator as the first member
    });

    await group.save();

    res.status(201).json({ message: "Group created successfully", group });
  } catch (error) {
    res.status(500).json({ error: "Failed to create group" });
  }
};

// Get group by ID
export const getGroupById = async (req, res) => {
  try {
    const { id } = req.params;
    const group = await Group.findById(id)
      .populate("createdBy", "name email")
      .populate("members", "name email");

    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    res.status(200).json(group);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch group" });
  }
};

// Update group
export const updateGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, visibility } = req.body;

    // Validate visibility
    if (
      visibility &&
      !["public", "private", "invite-only"].includes(visibility)
    ) {
      return res.status(400).json({ error: "Invalid visibility option" });
    }

    const updatedGroup = await Group.findByIdAndUpdate(
      id,
      { name, description, visibility },
      { new: true }
    ).populate("createdBy", "name email");

    if (!updatedGroup) {
      return res.status(404).json({ error: "Group not found" });
    }

    res.status(200).json(updatedGroup);
  } catch (error) {
    res.status(500).json({ error: "Failed to update group" });
  }
};

// Delete group
export const deleteGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedGroup = await Group.findByIdAndDelete(id);

    if (!deletedGroup) {
      return res.status(404).json({ error: "Group not found" });
    }

    res.status(200).json({ message: "Group deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete group" });
  }
};

// Get user's groups
export const getUserGroups = async (req, res) => {
  try {
    const userId = req.user.id;
    const groups = await Group.find({ members: userId })
      .populate("createdBy", "name email")
      .populate("members", "name email");

    res.status(200).json(groups);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user's groups" });
  }
};

// Get group members
export const getGroupMembers = async (req, res) => {
  try {
    const { id } = req.params;
    const group = await Group.findById(id).populate("members", "name email");

    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    res.status(200).json(group.members);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch group members" });
  }
};

// Add member to group
export const addMemberToGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const group = await Group.findById(id);
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isAdded = await group.addMember(userId);
    if (!isAdded) {
      return res
        .status(400)
        .json({ error: "User is already a member of the group" });
    }

    res.status(200).json({ message: "Member added successfully", group });
  } catch (error) {
    res.status(500).json({ error: "Failed to add member to group" });
  }
};

// Remove member from group
export const removeMemberFromGroup = async (req, res) => {
  try {
    const { id, userId } = req.params;

    const group = await Group.findById(id);
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    const isRemoved = await group.removeMember(userId);
    if (!isRemoved) {
      return res
        .status(400)
        .json({ error: "User is not a member of the group" });
    }

    res.status(200).json({ message: "Member removed successfully", group });
  } catch (error) {
    res.status(500).json({ error: "Failed to remove member from group" });
  }
};

// Get group by invite code
export const getGroupByCode = async (req, res) => {
  try {
    const { code } = req.params;
    const group = await Group.findOne({ code }).populate(
      "createdBy",
      "name email"
    );

    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    res.status(200).json(group);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch group by code" });
  }
};

// Join group using code
export const joinGroupByCode = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const group = await Group.findById(id);
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    const isAdded = await group.addMember(userId);
    if (!isAdded) {
      return res
        .status(400)
        .json({ error: "You are already a member of the group" });
    }

    res.status(200).json({ message: "Joined group successfully", group });
  } catch (error) {
    res.status(500).json({ error: "Failed to join group" });
  }
};

// Search public groups
export const searchPublicGroups = async (req, res) => {
  try {
    const { query } = req.query;
    const groups = await Group.find({
      visibility: "public",
      $text: { $search: query },
    })
      .populate("createdBy", "name email")
      .limit(10); // Limit results to 10

    res.status(200).json(groups);
  } catch (error) {
    res.status(500).json({ error: "Failed to search public groups" });
  }
};

// Check if user is a member of the group
export const checkIsMember = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const group = await Group.findById(id);
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    const isMember = group.isMember(userId);

    res.status(200).json({ isMember });
  } catch (error) {
    res.status(500).json({ error: "Failed to check membership" });
  }
};