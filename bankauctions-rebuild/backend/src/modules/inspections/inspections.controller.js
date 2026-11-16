import { db } from '../../services/db.js';
import { logAuditEvent } from '../../services/audit.service.js';
import { inspectionSubmissionSchema } from '../../../../shared/schemas/auctionSchemas.js';

export async function getEngineerAssignments(req, res, next) {
  try {
    const engineerId = req.user.id;
    const { status } = req.query;

    const where = { engineerId };
    if (status) {
      where.status = status.toUpperCase();
    }

    const assignments = await db.inspectionAssignment.findMany({
      where,
      include: {
        auction: true,
        report: true
      }
    });

    return res.json({
      success: true,
      data: assignments,
      count: assignments.length
    });
  } catch (err) {
    next(err);
  }
}

export async function getAssignmentDetails(req, res, next) {
  try {
    const { id } = req.params;
    const assignment = await db.inspectionAssignment.findUnique({
      where: { id },
      include: {
        auction: true,
        report: true
      }
    });

    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }

    return res.json({ success: true, data: assignment });
  } catch (err) {
    next(err);
  }
}

export async function scheduleVisit(req, res, next) {
  try {
    const { id } = req.params;
    const { date, slot } = req.body;

    if (!date) {
      return res.status(400).json({ success: false, message: 'Scheduled date is required' });
    }

    const assignment = await db.inspectionAssignment.update({
      where: { id },
      data: {
        scheduledDate: new Date(date),
        scheduledSlot: slot || 'Morning (10:00 AM - 1:00 PM)',
        status: 'SCHEDULED'
      }
    });

    await logAuditEvent({
      actorId: req.user.id,
      actorName: req.user.fullName,
      actorRole: req.user.role,
      action: 'SCHEDULE_SITE_INSPECTION',
      entityType: 'INSPECTION_ASSIGNMENT',
      entityId: id,
      afterState: { scheduledDate: date, slot },
      ipAddress: req.ip
    });

    return res.json({ success: true, message: 'Inspection visit scheduled', data: assignment });
  } catch (err) {
    next(err);
  }
}

export async function submitInspectionReport(req, res, next) {
  try {
    const { id } = req.params; // assignmentId
    const engineer = req.user;
    const validated = inspectionSubmissionSchema.parse(req.body);

    const assignment = await db.inspectionAssignment.findUnique({
      where: { id },
      include: { auction: true }
    });

    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }

    // Create or update inspection report
    const report = await db.inspectionReport.create({
      data: {
        assignmentId: id,
        occupancyStatus: validated.occupancyStatus,
        accessRoadType: validated.accessRoadType,
        boundaryMatches: validated.boundaryMatches,
        propertyCondition: validated.propertyCondition,
        utilitiesObserved: validated.utilitiesObserved,
        litigationObserved: validated.litigationObserved,
        engineerValuationEstimate: validated.engineerValuationEstimate,
        engineerNotes: validated.engineerNotes,
        gpsCoordinates: validated.gpsCoordinates,
        landmarkName: validated.landmarkName,
        landmarkDistanceKm: validated.landmarkDistanceKm,
        photos: validated.photos
      }
    });

    // Update assignment and auction notice status
    await db.inspectionAssignment.update({
      where: { id },
      data: { status: 'SUBMITTED' }
    });

    await db.auctionNotice.update({
      where: { id: assignment.auctionId },
      data: {
        status: 'INSPECTION_SUBMITTED',
        estimatedMarketValue: validated.engineerValuationEstimate
      }
    });

    await logAuditEvent({
      actorId: engineer.id,
      actorName: engineer.fullName,
      actorRole: engineer.role,
      action: 'SUBMIT_PHYSICAL_INSPECTION',
      entityType: 'AUCTION',
      entityId: assignment.auctionId,
      afterState: { photosCount: validated.photos.length, valuation: validated.engineerValuationEstimate },
      ipAddress: req.ip
    });

    return res.status(201).json({
      success: true,
      message: 'Field inspection submitted successfully and routed to admin approval desk.',
      data: report
    });
  } catch (err) {
    next(err);
  }
}
