import mongoose, { Schema, Document, Model } from "mongoose";

export interface StudyBlockType extends Document {
  userId: string;
  email: string;         
  startTime: Date;
  endTime: Date;
  notified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const StudyBlockSchema: Schema<StudyBlockType> = new Schema(
  {
    userId: { type: String, required: true },
    email: { type: String, required: true }, 
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    notified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const StudyBlock: Model<StudyBlockType> =
  mongoose.models.StudyBlock || mongoose.model<StudyBlockType>("StudyBlock", StudyBlockSchema);

export default StudyBlock;
