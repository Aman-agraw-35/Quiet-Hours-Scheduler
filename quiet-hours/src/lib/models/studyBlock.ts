import mongoose, { Schema } from "mongoose";

const StudyBlockSchema = new Schema(
  {
    userId: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    reminderSent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.StudyBlock ||
  mongoose.model("StudyBlock", StudyBlockSchema);