import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    career: { type: mongoose.Schema.Types.ObjectId, ref: "Career", required: true },
    semester: { type: Number, min: 1, max: 10, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Subject = mongoose.models.Subject || mongoose.model("Subject", subjectSchema);
