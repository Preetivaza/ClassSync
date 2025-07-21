import Group from "../models/Group.js";

// Create a group
export const createGroup = async (req, res) => {
  try {
    const { name, createdBy, members } = req.body;

    // Create a new group
    const group = new Group({ name, createdBy, members });
    await group.save();

    res.status(201).json(group);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add a task to a group
export const addTask = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { title, description, assignedTo, deadline } = req.body;

    // Find the group by ID
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    // Add the task to the group
    group.tasks.push({ title, description, assignedTo, deadline });
    await group.save();

    res.json(group);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a task status
export const updateTaskStatus = async (req, res) => {
  try {
    const { groupId, taskId } = req.params;
    const { status } = req.body;

    // Find the group by ID
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    // Find the task and update its status
    const task = group.tasks.id(taskId);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    task.status = status;
    await group.save();

    res.json(group);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
