// backend/src/models/Career.js
import mongoose from 'mongoose';

const careerSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  code: { type: String, required: true, unique: true, trim: true },
  director: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['activa', 'inactiva'], default: 'activa' }
}, { timestamps: true });

export const Career = mongoose.models.Career || mongoose.model('Career', careerSchema);