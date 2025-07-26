import Progress from "../models/Progress.js";

// Create progress entry
export const createProgress = async (req, res) => {
  try {
    const { userId, taskIds, completedTasks } = req.body;

    const progress = new Progress({
      userId,
      taskIds,
      completedTasks,
    });

    await progress.save();
    res.status(201).json(progress);
  } catch (error) {
    res.status(500).json({ error: "Failed to create progress entry" });
  }
};

// Get progress for a user
export const getUserProgress = async (req, res) => {
  try {
    const { userId } = req.params;
    const progress = await Progress.findOne({ userId });
    res.status(200).json(progress);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch progress" });
  }
};
