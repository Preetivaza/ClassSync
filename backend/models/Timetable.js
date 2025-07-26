// models/Timetable.js
import mongoose from "mongoose";

const timetableEntrySchema = new mongoose.Schema({
  day: {
    type: String,
    required: true,
    enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  },
  startTime: {
    type: String,
    required: true 
  },
  endTime: {
    type: String,
    required: true 
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

// Indexes for better query performance
timetableEntrySchema.index({ user: 1, day: 1 });
timetableEntrySchema.index({ group: 1, day: 1 });

const Timetable = mongoose.model("Timetable", timetableEntrySchema);
export default Timetable;