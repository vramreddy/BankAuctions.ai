import nodemailer from "nodemailer";
import { db } from "../../services/db.js";
import { fail, audit } from "./notices.service.js";
import { accessibleRequest } from "./requests.service.js";
export const mailConfigured = () =>
  Boolean(process.env.SMTP_HOST && process.env.MAIL_FROM);
export async function queueReport(user, id) {
  return db.$transaction(async (tx) => {
    const item = await accessibleRequest(user, id, tx);
    if (
      !item.approvedReport ||
      !item.approvedById ||
      !["REPORT_APPROVED", "RESOLVED", "CLOSED"].includes(item.status)
    )
      fail(409, "Only a checker-approved report can be delivered.");
    const existing = await tx.emailDelivery.findUnique({
      where: {
        requestId_reportVersion: {
          requestId: id,
          reportVersion: item.reportVersion,
        },
      },
    });
    if (existing) return existing;
    const report = item.approvedReport;
    const body = [
      `Hello ${item.requester.fullName},`,
      "Your requested report has been reviewed by our checker.",
      `Request: ${item.subject}`,
      `Inspection: ${report.visitedAt}`,
      `Summary: ${report.summary}`,
      `Findings: ${report.findings}`,
      `Limitations: ${report.limitations}`,
      "Sign in to BankAuctions.ai to view the approved report and its attachments.",
    ].join("\n\n");
    const delivery = await tx.emailDelivery.create({
      data: {
        requestId: id,
        reportVersion: item.reportVersion,
        recipient: item.requester.email,
        subject: `Your reviewed property report: ${item.subject}`,
        body,
      },
    });
    await audit(tx, user, "REPORT_DELIVERY_QUEUED", id, {
      deliveryId: delivery.id,
      reportVersion: item.reportVersion,
    });
    return delivery;
  });
}
export async function deliverReport(user, deliveryId) {
  if (!mailConfigured())
    return {
      configured: false,
      message: "Email is queued. Configure SMTP_HOST and MAIL_FROM to send it.",
    };
  const claimed = await db.emailDelivery.updateMany({
    where: { id: deliveryId, status: { in: ["PENDING", "FAILED"] } },
    data: { status: "SENDING", attempts: { increment: 1 }, lastError: null },
  });
  if (!claimed.count)
    fail(409, "Delivery is already sent or currently in progress.");
  const item = await db.emailDelivery.findUnique({
    where: { id: deliveryId },
    include: { request: true },
  });
  try {
    if (
      item.request.reportVersion !== item.reportVersion ||
      !item.request.approvedReport
    )
      throw new Error("Report changed since delivery was queued.");
    const port = Number(process.env.SMTP_PORT || 587);
    const transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: port === 465,
      requireTLS: port !== 465,
      auth: process.env.SMTP_USER
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD }
        : undefined,
      connectionTimeout: 10000,
      socketTimeout: 20000,
    });
    const files = await db.managedFile.findMany({
      where: {
        requestId: item.requestId,
        id: { in: item.request.approvedReport.fileIds || [] },
      },
    });
    const result = await transport.sendMail({
      from: process.env.MAIL_FROM,
      to: item.recipient,
      subject: item.subject,
      text: item.body,
      messageId: `<${item.id}@bankauctions.ai>`,
      attachments: files.map((file) => ({
        filename: file.name,
        content: Buffer.from(file.bytes),
        contentType: file.mime,
      })),
    });
    if (!result.accepted?.length)
      throw new Error("Mail server did not accept the recipient.");
    await db.emailDelivery.update({
      where: { id: deliveryId },
      data: { status: "SENT", sentAt: new Date() },
    });
    await audit(db, user, "REPORT_EMAIL_SENT", item.requestId, { deliveryId });
    return { configured: true, status: "SENT" };
  } catch (error) {
    await db.emailDelivery.update({
      where: { id: deliveryId },
      data: {
        status: "FAILED",
        lastError: String(error.code || "DELIVERY_FAILED"),
      },
    });
    fail(
      502,
      "Email delivery failed. The approved report remains available in the buyer workspace; retry after checking mail configuration.",
    );
  }
}
