// backend/src/helpers/auditHelper.js
import { AuditLog } from '../models/AuditLog.js';

/**
 * Helper principal para crear registros de auditoría
 * Centraliza la creación de logs para mantener consistencia
 */
export async function createAuditLog({
  actor,
  action,
  entityType,
  entityId,
  metadata = {},
  ipAddress = null,
  userAgent = null
}) {
  try {
    const log = await AuditLog.create({
      actor,
      action,
      entityType,
      entityId,
      metadata,
      ipAddress,
      userAgent
    });
    return log;
  } catch (error) {
    console.error('Error creando auditoría:', error);
    // No lanzamos error para no interrumpir la acción principal
    return null;
  }
}

/**
 * T21 - Registrar creación de solicitud
 */
export async function logRequestCreation(request, userId, ip, userAgent) {
  return await createAuditLog({
    actor: userId,
    action: 'REQUEST.CREATED',
    entityType: 'Request',
    entityId: request._id,
    metadata: {
      requestId: request._id,
      type: request.requestType,
      requesterRole: request.requesterRole,
      requester: request.requester,
      reasonType: request.reasonType,
      mode: request.mode,
      dates: request.dates,
      courses: request.courses,
      evidenceRequired: request.evidenceRequired
    },
    ipAddress: ip,
    userAgent: userAgent
  });
}

/**
 * T21 - Registrar revisión de solicitud (aprobada/rechazada/observada)
 */
export async function logRequestReview(request, previousStatus, reviewerId, comment, ip, userAgent) {
  return await createAuditLog({
    actor: reviewerId,
    action: `REQUEST.${request.status.toUpperCase()}`,
    entityType: 'Request',
    entityId: request._id,
    metadata: {
      requestId: request._id,
      previousStatus: previousStatus,
      newStatus: request.status,
      comment: comment,
      reviewerId: reviewerId,
      reviewedAt: new Date()
    },
    ipAddress: ip,
    userAgent: userAgent
  });
}

/**
 * T21 - Registrar apelación de solicitud
 */
export async function logAppeal(request, userId, appealReason, ip, userAgent) {
  return await createAuditLog({
    actor: userId,
    action: 'REQUEST.APPEALED',
    entityType: 'Request',
    entityId: request._id,
    metadata: {
      requestId: request._id,
      appealReason: appealReason,
      previousStatus: 'rechazada',
      newStatus: 'apelada',
      appealedAt: new Date()
    },
    ipAddress: ip,
    userAgent: userAgent
  });
}

/**
 * T21 - Registrar corrección de solicitud observada
 */
export async function logRequestCorrection(request, userId, correctionNote, ip, userAgent) {
  return await createAuditLog({
    actor: userId,
    action: 'REQUEST.CORRECTED',
    entityType: 'Request',
    entityId: request._id,
    metadata: {
      requestId: request._id,
      correctionNote: correctionNote,
      previousStatus: 'observada',
      newStatus: 'pendiente',
      correctedAt: new Date()
    },
    ipAddress: ip,
    userAgent: userAgent
  });
}

/**
 * T21 - Registrar cambio de asistencia
 */
export async function logAttendanceChange(attendanceDoc, record, oldStatus, newStatus, userId, ip, userAgent) {
  return await createAuditLog({
    actor: userId,
    action: 'ATTENDANCE.CHANGED',
    entityType: 'Attendance',
    entityId: attendanceDoc._id,
    metadata: {
      recordId: record._id,
      studentId: record.student,
      oldStatus: oldStatus,
      newStatus: newStatus,
      courseId: attendanceDoc.course,
      date: attendanceDoc.date,
      wasLocked: record.lockedByRequest || false
    },
    ipAddress: ip,
    userAgent: userAgent
  });
}

/**
 * T21 - Registrar creación de usuario (para T20)
 */
export async function logUserCreation(user, adminId, ip, userAgent) {
  return await createAuditLog({
    actor: adminId,
    action: 'USER.CREATED',
    entityType: 'User',
    entityId: user._id,
    metadata: {
      userId: user._id,
      email: user.email,
      role: user.role,
      name: user.name
    },
    ipAddress: ip,
    userAgent: userAgent
  });
}

/**
 * T21 - Registrar actualización de usuario
 */
export async function logUserUpdate(user, adminId, changes, ip, userAgent) {
  return await createAuditLog({
    actor: adminId,
    action: 'USER.UPDATED',
    entityType: 'User',
    entityId: user._id,
    metadata: {
      userId: user._id,
      email: user.email,
      changes: changes,
      updatedAt: new Date()
    },
    ipAddress: ip,
    userAgent: userAgent
  });
}

/**
 * T21 - Registrar creación de curso (para T20)
 */
export async function logCourseCreation(course, adminId, ip, userAgent) {
  return await createAuditLog({
    actor: adminId,
    action: 'COURSE.CREATED',
    entityType: 'Course',
    entityId: course._id,
    metadata: {
      courseId: course._id,
      name: course.name,
      code: course.code,
      career: course.career,
      teacher: course.teacher,
      parallel: course.parallel
    },
    ipAddress: ip,
    userAgent: userAgent
  });
}

/**
 * T21 - Registrar creación de carrera (para T20)
 */
export async function logCareerCreation(career, adminId, ip, userAgent) {
  return await createAuditLog({
    actor: adminId,
    action: 'CAREER.CREATED',
    entityType: 'Career',
    entityId: career._id,
    metadata: {
      careerId: career._id,
      name: career.name,
      code: career.code,
      director: career.director
    },
    ipAddress: ip,
    userAgent: userAgent
  });
}

/**
 * T21 - Registrar creación de motivo (para T20)
 */
export async function logReasonCreation(reason, adminId, ip, userAgent) {
  return await createAuditLog({
    actor: adminId,
    action: 'REASON.CREATED',
    entityType: 'Reason',
    entityId: reason._id,
    metadata: {
      reasonId: reason._id,
      name: reason.name,
      description: reason.description,
      requiresEvidence: reason.requiresEvidence
    },
    ipAddress: ip,
    userAgent: userAgent
  });
}

/**
 * T21 - Registrar eliminación (soft delete) de entidad
 */
export async function logEntityDeletion(entityType, entityId, entityName, adminId, ip, userAgent) {
  return await createAuditLog({
    actor: adminId,
    action: `${entityType.toUpperCase()}.DELETED`,
    entityType: entityType,
    entityId: entityId,
    metadata: {
      entityId: entityId,
      entityName: entityName,
      deletedAt: new Date(),
      deletedBy: adminId
    },
    ipAddress: ip,
    userAgent: userAgent
  });
}

/**
 * T21 - Obtener historial completo de una entidad
 */
export async function getEntityAuditTrail(entityType, entityId) {
  try {
    const logs = await AuditLog.find({ entityType, entityId })
      .populate('actor', 'name email role')
      .sort({ createdAt: -1 });
    return logs;
  } catch (error) {
    console.error('Error obteniendo auditoría:', error);
    return [];
  }
}

/**
 * T21 - Obtener acciones disponibles (para filtros)
 */
export async function getAvailableActions() {
  try {
    const actions = await AuditLog.distinct('action');
    return actions.sort();
  } catch (error) {
    console.error('Error obteniendo acciones:', error);
    return [];
  }
}