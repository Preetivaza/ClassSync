import Timetable from "../models/Timetable.js";

// Create a timetable
export const createTimetable = async (req, res) => {
  try {
    const { userId, schedule } = req.body;

    // Create a new timetable
    const timetable = new Timetable({ userId, schedule });
    await timetable.save();

    res.status(201).json(timetable);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a user's timetable
export const getTimetable = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find the timetable by userId
    const timetable = await Timetable.findOne({ userId });
    if (!timetable) {
      return res.status(404).json({ error: "Timetable not found" });
    }

    res.json(timetable);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
