// backend/src/services/requestApprovalService.js
import mongoose from 'mongoose';
import { AuditLog } from '../models/AuditLog.js';
import { applyStudentApproval, applyTeacherAbsence } from './attendanceImpactService.js';

/**
 * T17 - Aprueba una solicitud de forma transaccional
 * Todo o nada: si algo falla, se revierte todo
 */
export async function approveRequestWithTransaction(requestData) {
  const session = await mongoose.startSession();
  
  try {
    let result;
    
    // Ejecutar todo dentro de una transacción
    await session.withTransaction(async () => {
      const { request, Request, Notification } = requestData;
      
      // 1. Actualizar estado de la solicitud
      const updatedRequest = await Request.findByIdAndUpdate(
        request._id,
        {
          status: 'aprobada',
          reviewedBy: requestData.reviewedBy,
          reviewedAt: new Date(),
          reviewComment: requestData.comment || 'Aprobado'
        },
        { new: true, session }
      );
      
      // 2. Aplicar impacto según tipo de solicitud
      if (request.type === 'student') {
        result = await applyStudentApproval({
          ...request.toObject(),
          reviewedBy: requestData.reviewedBy
        }, session);
      } else if (request.type === 'teacher') {
        result = await applyTeacherAbsence({
          ...request.toObject(),
          reviewedBy: requestData.reviewedBy
        }, session);
      }
      
      // 3. Registrar auditoría
      await AuditLog.create([{
        actor: requestData.reviewedBy,
        action: 'REQUEST.APPROVED',
        entityType: 'Request',
        entityId: request._id,
        metadata: {
          requestId: request._id,
          requestType: request.type,
          previousStatus: request.status,
          newStatus: 'aprobada',
          comment: requestData.comment,
          impactResult: result
        },
        ipAddress: requestData.ipAddress,
        userAgent: requestData.userAgent
      }], { session });
      
      // 4. Crear notificación
      await Notification.create([{
        user: request.student || request.teacher,
        title: '✅ Solicitud Aprobada',
        message: `Tu solicitud ha sido aprobada. ${result?.modifiedCount || 0} registros actualizados.`,
        type: 'REQUEST_APPROVED',
        read: false
      }], { session });
      
      result.request = updatedRequest;
    });
    
    console.log('[T17] Transacción completada exitosamente');
    return { success: true, data: result };
    
  } catch (error) {
    console.error('[T17] Error en transacción:', error);
    return { success: false, error: error.message };
  } finally {
    session.endSession();
  }
}

/**
 * Rechazar solicitud con transacción
 */
export async function rejectRequestWithTransaction(requestData) {
  const session = await mongoose.startSession();
  
  try {
    await session.withTransaction(async () => {
      const { request, Request, Notification } = requestData;
      
      // Actualizar solicitud
      await Request.findByIdAndUpdate(
        request._id,
        {
          status: 'rechazada',
          reviewedBy: requestData.reviewedBy,
          reviewedAt: new Date(),
          reviewComment: requestData.comment || 'Rechazado'
        },
        { session }
      );
      
      // Auditoría
      await AuditLog.create([{
        actor: requestData.reviewedBy,
        action: 'REQUEST.REJECTED',
        entityType: 'Request',
        entityId: request._id,
        metadata: {
          requestId: request._id,
          previousStatus: request.status,
          newStatus: 'rechazada',
          comment: requestData.comment
        },
        ipAddress: requestData.ipAddress,
        userAgent: requestData.userAgent
      }], { session });
      
      // Notificación
      await Notification.create([{
        user: request.student || request.teacher,
        title: '❌ Solicitud Rechazada',
        message: `Tu solicitud ha sido rechazada. Motivo: ${requestData.comment}`,
        type: 'REQUEST_REJECTED',
        read: false
      }], { session });
    });
    
    return { success: true };
  } catch (error) {
    console.error('[T17] Error al rechazar:', error);
    return { success: false, error: error.message };
  } finally {
    session.endSession();
  }
}