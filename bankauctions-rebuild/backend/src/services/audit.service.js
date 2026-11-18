import { db } from './db.js';
import { logger } from '../utils/logger.js';

export async function logAuditEvent({ actorId, actorName, actorRole, action, entityType, entityId, beforeState, afterState, ipAddress }) {
  try {
    const record = await db.auditLog.create({
      data: {
        actorId,
        actorName: actorName || 'System',
        actorRole: actorRole || 'SYSTEM',
        action,
        entityType,
        entityId,
        beforeState: beforeState || undefined,
        afterState: afterState || undefined,
        ipAddress: ipAddress || '127.0.0.1'
      }
    });
    logger.info(`[AUDIT] ${actorName || 'System'} (${actorRole || 'SYSTEM'}) performed ${action} on ${entityType}:${entityId}`);
    return record;
  } catch (err) {
    logger.error('Failed to write audit log:', err.message);
  }
}
