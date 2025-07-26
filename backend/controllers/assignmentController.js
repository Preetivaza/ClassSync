import Assignment from "../models/Assignment.js";
import Group from "../models/Group.js";

// Create an assignment
export const createAssignment = async (req, res) => {
  try {
    const { title, description, groupId } = req.body;

    // Validate group exists
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    const assignment = new Assignment({
      title,
      description,
      groupId,
    });

    await assignment.save();
    res.status(201).json(assignment);
  } catch (error) {
    res.status(500).json({ error: "Failed to create assignment" });
  }
};

// Get all assignments for a group
export const getAssignments = async (req, res) => {
  try {
    const { groupId } = req.params;
    const assignments = await Assignment.find({ groupId }).populate("groupId");
    res.status(200).json(assignments);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch assignments" });
  }
};

// Update an assignment
export const updateAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { title, description } = req.body;

    const updatedAssignment = await Assignment.findByIdAndUpdate(
      assignmentId,
      { title, description },
      { new: true }
    ).populate("groupId");

    if (!updatedAssignment) {
      return res.status(404).json({ error: "Assignment not found" });
    }

    res.status(200).json(updatedAssignment);
  } catch (error) {
    res.status(500).json({ error: "Failed to update assignment" });
  }
};

// Delete an assignment
export const deleteAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    await Assignment.findByIdAndDelete(assignmentId);
    res.status(200).json({ message: "Assignment deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete assignment" });
  }
};
