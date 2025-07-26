// models/Group.js
import mongoose from "mongoose";

const groupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500
    },
    code: {
      type: String,
      unique: true,
      sparse: true // Allows null values while maintaining uniqueness
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    members: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }],
    memberCount: {
      type: Number,
      default: 1
    },
    isActive: {
      type: Boolean,
      default: true
    },
    visibility: {
      type: String,
      enum: ['public', 'private', 'invite-only'],
      default: 'private'
    }
  },
  { 
    timestamps: true 
  }
);

// Indexes for better query performance
groupSchema.index({ createdBy: 1 });
groupSchema.index({ members: 1 });
groupSchema.index({ code: 1 });
groupSchema.index({ name: 'text', description: 'text' });

// Pre-save middleware to generate group code
groupSchema.pre('save', async function(next) {
  if (this.isNew && !this.code) {
    // Generate unique 6-character code
    const generateCode = () => {
      return Math.random().toString(36).substring(2, 8).toUpperCase();
    };
    
    let code = generateCode();
    let existingGroup = await mongoose.models.Group.findOne({ code });
    
    while (existingGroup) {
      code = generateCode();
      existingGroup = await mongoose.models.Group.findOne({ code });
    }
    
    this.code = code;
  }
  next();
});

// Method to add member
groupSchema.methods.addMember = async function(userId) {
  if (!this.members.includes(userId)) {
    this.members.push(userId);
    this.memberCount = this.members.length;
    await this.save();
    return true;
  }
  return false;
};

// Method to remove member
groupSchema.methods.removeMember = async function(userId) {
  const index = this.members.indexOf(userId);
  if (index > -1) {
    this.members.splice(index, 1);
    this.memberCount = this.members.length;
    await this.save();
    return true;
  }
  return false;
};

// Method to check if user is member
groupSchema.methods.isMember = function(userId) {
  return this.members.includes(userId);
};

// Method to check if user is admin/creator
groupSchema.methods.isAdmin = function(userId) {
  return this.createdBy.toString() === userId.toString();
};

const Group = mongoose.model("Group", groupSchema);
export default Group;