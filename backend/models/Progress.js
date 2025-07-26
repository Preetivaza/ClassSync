// models/Progress.js
import mongoose from "mongoose";

const progressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true
  },
  status: {
    type: String,
    enum: ['not-started', 'in-progress', 'completed'],
    default: 'not-started'
  },
  progressPercentage: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  notes: [{
    content: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  startedAt: {
    type: Date
  },
  completedAt: {
    type: Date
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

// Indexes for better query performance
progressSchema.index({ user: 1, task: 1 });
progressSchema.index({ task: 1 });

// Set timestamps based on status changes
progressSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    this.lastUpdated = new Date();
    
    if (this.status === 'in-progress' && !this.startedAt) {
      this.startedAt = new Date();
    }
    
    if (this.status === 'completed' && !this.completedAt) {
      this.completedAt = new Date();
    }
  }
  next();
});

const Progress = mongoose.model("Progress", progressSchema);
export default Progress;
