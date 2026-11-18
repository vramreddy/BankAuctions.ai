import { db } from "../../services/db.js";
import { fail, audit } from "./notices.service.js";
export async function reviewInspection(user, id, input) {
  if (
    !["APPROVE", "RETURN"].includes(input.action) ||
    String(input.notes || "").trim().length < 5
  )
    fail(400, "Choose a decision and record verification notes.");
  return db.$transaction(async (tx) => {
    const assignment = await tx.inspectionAssignment.findUnique({
      where: { id },
      include: { report: true },
    });
    if (!assignment?.report) fail(404, "Submitted report not found.");
    if (assignment.status !== "SUBMITTED")
      fail(409, "This report is not awaiting review.");
    const status = input.action === "APPROVE" ? "APPROVED" : "RETURNED";
    const changed = await tx.inspectionAssignment.updateMany({
      where: { id, status: "SUBMITTED" },
      data: { status },
    });
    if (!changed.count)
      fail(409, "Another reviewer has already updated this report.");
    if (input.action === "APPROVE")
      await tx.auctionNotice.update({
        where: { id: assignment.auctionId },
        data: {
          estimatedMarketValue: assignment.report.engineerValuationEstimate,
        },
      });
    await audit(tx, user, `FIELD_REPORT_${status}`, id, {
      notes: input.notes,
      auctionId: assignment.auctionId,
    });
    return tx.inspectionAssignment.findUnique({
      where: { id },
      include: { report: true },
    });
  });
}
