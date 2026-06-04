import mongoose from "mongoose";

const evidenceSchema = new mongoose.Schema(
  {
    request: { type: mongoose.Schema.Types.ObjectId, ref: "Request", required: true },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    fileName: { type: String, required: true, trim: true },
    fileUrl: { type: String, required: true, trim: true },
    provider: { type: String, enum: ["local", "demo"], default: "local" },
    mimeType: { type: String, trim: true },
    size: { type: Number, min: 0 },
  },
  { timestamps: true }
);

evidenceSchema.index({ request: 1, uploadedBy: 1 });

export const Evidence = mongoose.models.Evidence || mongoose.model("Evidence", evidenceSchema);
