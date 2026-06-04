import mongoose from "mongoose";

const requestDateSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  },
  { _id: false }
);

const requestSchema = new mongoose.Schema(
  {
    requester: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    requesterRole: {
      type: String,
      enum: ["estudiante", "docente"],
      required: true,
    },
    requestType: {
      type: String,
      enum: ["ausencia_estudiantil", "ausencia_docente"],
      required: true,
    },
    mode: {
      type: String,
      enum: ["permiso_anticipado", "justificacion_posterior"],
      required: true,
    },
    reasonType: {
      type: String,
      enum: ["salud", "laboral", "academico", "personal", "emergencia", "otro"],
      required: true,
    },
    reasonDetail: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["pendiente", "observado", "aprobado", "rechazado", "apelado", "cancelado"],
      default: "pendiente",
    },
    dates: { type: [requestDateSchema], validate: (value) => value.length > 0 },
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
    evidenceRequired: { type: Boolean, default: false },
    currentReviewer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    reviewer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    reviewedAt: { type: Date },
    reviewComment: { type: String, trim: true },
    appealComment: { type: String, trim: true },
    correctedAt: { type: Date },
  },
  { timestamps: true }
);

requestSchema.index({ requester: 1, status: 1, createdAt: -1 });
requestSchema.index({ currentReviewer: 1, status: 1, createdAt: -1 });

export const Request = mongoose.models.Request || mongoose.model("Request", requestSchema);
