// models/Material.js
import mongoose from "mongoose";

const materialSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  file: {
    filename: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    size: {
      type: Number
    },
    type: {
      type: String // e.g., 'pdf', 'image', 'document'
    }
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  downloads: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

// Indexes for better query performance
materialSchema.index({ group: 1 });
materialSchema.index({ uploadedBy: 1 });
materialSchema.index({ tags: 1 });

const Material = mongoose.model("Material", materialSchema);

export default Material;
