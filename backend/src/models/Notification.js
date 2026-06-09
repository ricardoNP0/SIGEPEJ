import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ["solicitud", "revision", "asistencia", "sistema"],
      default: "sistema",
    },
    relatedRequest: { type: mongoose.Schema.Types.ObjectId, ref: "Request" },
    read: { type: Boolean, default: false },
    readAt: { type: Date },
  },
  { timestamps: true }
);

notificationSchema.index({ user: 1, read: 1, createdAt: -1 });

export const Notification =
  mongoose.models.Notification || mongoose.model("Notification", notificationSchema);
