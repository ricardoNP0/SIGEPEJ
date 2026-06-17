// backend/src/models/Reason.js
import mongoose from 'mongoose';

const reasonSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  requiresEvidence: { type: Boolean, default: false },
  applicableTo: [{ type: String, enum: ['student', 'teacher'] }],
  status: { type: String, enum: ['activo', 'inactivo'], default: 'activo' }
}, { timestamps: true });

export const Reason = mongoose.models.Reason || mongoose.model('Reason', reasonSchema);