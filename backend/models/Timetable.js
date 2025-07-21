import mongoose from "mongoose";

// Define the schema
const timetableSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // References the User model
      required: true,
    },
    schedule: [
      {
        day: {
          type: String,
          required: true,
        },
        classes: [
          {
            time: {
              type: String,
              required: true,
            },
            subject: {
              type: String,
              required: true,
            },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

// Export the model
const Timetable = mongoose.model("Timetable", timetableSchema);
export default Timetable;
