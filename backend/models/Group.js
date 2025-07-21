import mongoose from "mongoose";

// Define the schema
const groupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // References the User model
      required: true,
    },
    members: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User", // References the User model
        },
        role: {
          type: String,
          enum: ["admin", "member"],
          default: "member",
        },
      },
    ],
    tasks: [
      {
        title: {
          type: String,
          required: true,
        },
        description: {
          type: String,
        },
        assignedTo: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User", // References the User model
        },
        status: {
          type: String,
          enum: ["pending", "in-progress", "completed"],
          default: "pending",
        },
        deadline: {
          type: Date,
        },
      },
    ],
  },
  { timestamps: true }
);

// Export the model
const Group = mongoose.model("Group", groupSchema);
export default Group;
