import mongoose from "mongoose";

// Define the schema
const assignmentSchema = new mongoose.Schema(
  {
    topic: {
      type: String,
      required: true,
    },
    questions: [
      {
        question: {
          type: String,
          required: true,
        },
        options: [
          {
            text: {
              type: String,
              required: true,
            },
            isCorrect: {
              type: Boolean,
              default: false,
            },
          },
        ],
        answer: {
          type: String,
          required: true,
        },
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // References the User model
      required: true,
    },
  },
  { timestamps: true }
);

// Export the model
const Assignment = mongoose.model("Assignment", assignmentSchema);
export default Assignment;
