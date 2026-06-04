import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema(
  {
    day: {
      type: String,
      enum: ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado"],
      required: true,
    },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    classroom: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const courseSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
    career: { type: mongoose.Schema.Types.ObjectId, ref: "Career", required: true },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    parallel: { type: String, required: true, uppercase: true, trim: true },
    period: { type: String, required: true, trim: true },
    schedule: { type: [scheduleSchema], default: [] },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Course = mongoose.models.Course || mongoose.model("Course", courseSchema);
