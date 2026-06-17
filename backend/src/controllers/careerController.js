// backend/src/controllers/careerController.js
import { Career } from '../models/Career.js';
import { AuditLog } from '../models/AuditLog.js';

// Obtener todas las carreras
export const getCareers = async (req, res) => {
  try {
    const careers = await Career.find().populate('director', 'name email');
    res.status(200).json({ success: true, data: careers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Obtener una carrera por ID
export const getCareerById = async (req, res) => {
  try {
    const career = await Career.findById(req.params.id).populate('director', 'name email');
    if (!career) return res.status(404).json({ success: false, message: 'Carrera no encontrada' });
    res.status(200).json({ success: true, data: career });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Crear carrera
export const createCareer = async (req, res) => {
  try {
    const career = new Career(req.body);
    await career.save();
    
    await AuditLog.create({
      actor: req.user.id,
      action: 'CAREER.CREATED',
      entityType: 'Career',
      entityId: career._id,
      metadata: { name: career.name, code: career.code },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });
    
    res.status(201).json({ success: true, data: career });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Actualizar carrera
export const updateCareer = async (req, res) => {
  try {
    const career = await Career.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!career) return res.status(404).json({ success: false, message: 'Carrera no encontrada' });
    
    await AuditLog.create({
      actor: req.user.id,
      action: 'CAREER.UPDATED',
      entityType: 'Career',
      entityId: career._id,
      metadata: { updates: req.body },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });
    
    res.status(200).json({ success: true, data: career });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Eliminar carrera (soft delete)
export const deleteCareer = async (req, res) => {
  try {
    const career = await Career.findByIdAndUpdate(req.params.id, { status: 'inactiva' }, { new: true });
    if (!career) return res.status(404).json({ success: false, message: 'Carrera no encontrada' });
    
    await AuditLog.create({
      actor: req.user.id,
      action: 'CAREER.DELETED',
      entityType: 'Career',
      entityId: career._id,
      metadata: { name: career.name },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });
    
    res.status(200).json({ success: true, message: 'Carrera desactivada' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};