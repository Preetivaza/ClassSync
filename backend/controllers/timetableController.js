import Timetable from "../models/Timetable.js";

// Create a timetable entry
export const createTimetableEntry = async (req, res) => {
  try {
    const { title, startTime, endTime, description } = req.body;

    const timetableEntry = new Timetable({
      title,
      startTime,
      endTime,
      description,
      userId: req.user._id,
    });

    await timetableEntry.save();
    res.status(201).json(timetableEntry);
  } catch (error) {
    res.status(500).json({ error: "Failed to create timetable entry" });
  }
};

// Get all timetable entries for a user
export const getUserTimetables = async (req, res) => {
  try {
    const timetables = await Timetable.find({ userId: req.user._id });
    res.status(200).json(timetables);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch timetables" });
  }
};

// Delete a timetable entry
export const deleteTimetableEntry = async (req, res) => {
  try {
    const { timetableId } = req.params;
    await Timetable.findByIdAndDelete(timetableId);
    res.status(200).json({ message: "Timetable entry deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete timetable entry" });
  }
};
