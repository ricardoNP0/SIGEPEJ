import mongoose from "mongoose";

const attendanceRecordSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["P", "F", "L"], required: true, default: "P" },
    lockedByRequest: { type: Boolean, default: false },
    request: { type: mongoose.Schema.Types.ObjectId, ref: "Request" },
    note: { type: String, trim: true },
  },
  { _id: false }
);

const attendanceSchema = new mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    date: { type: Date, required: true },
    takenBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["abierta", "cerrada"], default: "abierta" },
    records: { type: [attendanceRecordSchema], default: [] },
  },
  { timestamps: true }
);

attendanceSchema.index({ course: 1, date: 1 }, { unique: true });

export const Attendance =
  mongoose.models.Attendance || mongoose.model("Attendance", attendanceSchema);
