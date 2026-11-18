import { db } from "../../services/db.js";
import { inspectionSubmissionSchema } from "../../../../shared/schemas/auctionSchemas.js";
import { fail, audit } from "../workflow/notices.service.js";
async function owned(user, id, tx = db) {
  const item = await tx.inspectionAssignment.findUnique({
    where: { id },
    include: { auction: true, report: true },
  });
  if (!item) fail(404, "Assignment not found.");
  if (item.engineerId !== user.id && user.role !== "ADMIN")
    fail(403, "This inspection is assigned to another engineer.");
  return item;
}
export async function getEngineerAssignments(req, res, next) {
  try {
    const data = await db.inspectionAssignment.findMany({
      where: {
        ...(req.user.role === "ADMIN" ? {} : { engineerId: req.user.id }),
        ...(req.query.status ? { status: req.query.status } : {}),
      },
      include: { auction: true, report: true },
      orderBy: { createdAt: "desc" },
    });
    res.json({ success: true, data, count: data.length });
  } catch (e) {
    next(e);
  }
}
export async function getAssignmentDetails(req, res, next) {
  try {
    res.json({ success: true, data: await owned(req.user, req.params.id) });
  } catch (e) {
    next(e);
  }
}
export async function scheduleVisit(req, res, next) {
  try {
    const item = await owned(req.user, req.params.id);
    if (!["ASSIGNED", "SCHEDULED", "RETURNED"].includes(item.status))
      fail(409, "Inspection is not open for scheduling.");
    const date = new Date(req.body.date);
    if (!Number.isFinite(date.getTime()))
      fail(400, "Valid inspection date required.");
    const data = await db.inspectionAssignment.update({
      where: { id: item.id },
      data: {
        scheduledDate: date,
        scheduledSlot: String(req.body.slot || ""),
        status: "SCHEDULED",
      },
    });
    res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
}
export async function submitInspectionReport(req, res, next) {
  try {
    const data = inspectionSubmissionSchema.parse(req.body);
    const report = await db.$transaction(async (tx) => {
      const item = await owned(req.user, req.params.id, tx);
      if (!["ASSIGNED", "SCHEDULED", "RETURNED"].includes(item.status))
        fail(409, "Inspection is not awaiting submission.");
      const changed = await tx.inspectionAssignment.updateMany({
        where: { id: item.id, status: item.status },
        data: { status: "SUBMITTED" },
      });
      if (!changed.count)
        fail(409, "Inspection changed. Reload before submitting.");
      const report = await tx.inspectionReport.upsert({
        where: { assignmentId: item.id },
        create: { ...data, assignmentId: item.id },
        update: { ...data, submittedAt: new Date() },
      });
      await audit(tx, req.user, "FIELD_REPORT_SUBMITTED", item.id, {
        auctionId: item.auctionId,
      });
      return report;
    });
    res
      .status(201)
      .json({
        success: true,
        data: report,
        message:
          "Submitted to checker for review. Public listing facts are unchanged until approval.",
      });
  } catch (e) {
    next(e);
  }
}
