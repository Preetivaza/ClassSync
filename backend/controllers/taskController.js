import Task from "../models/Task.js";

// Create a task
export const createTask = async (req, res) => {
  try {
    const { title, description, groupId, assignedTo, deadline } = req.body;

    const task = new Task({
      title,
      description,
      groupId,
      assignedTo,
      deadline,
    });

    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: "Failed to create task" });
  }
};

// Get all tasks for a group
export const getTasks = async (req, res) => {
  try {
    const { groupId } = req.params;
    const tasks = await Task.find({ groupId }).populate(
      "assignedTo",
      "username email"
    );
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};

// Update task status
export const updateTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { status },
      { new: true }
    ).populate("assignedTo", "username email");

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: "Failed to update task status" });
  }
};

// Delete a task
export const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    await Task.findByIdAndDelete(taskId);
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete task" });
  }
};
