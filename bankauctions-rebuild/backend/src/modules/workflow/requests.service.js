import { z } from "zod";
import { db } from "../../services/db.js";
import {
  capabilities,
  PLAN_CAPABILITIES,
} from "../../../../shared/constants/entitlements.js";
import { fail, staff, audit, publishedWhere } from "./notices.service.js";
const requestSchema = z.object({
  auctionId: z.string().optional().nullable(),
  kind: z.enum([
    "GENERAL",
    "CALLBACK",
    "DOCUMENT",
    "LEGAL",
    "FIELD_REPORT",
    "LOGIN_HELP",
  ]),
  subject: z.string().trim().min(5).max(160),
  description: z.string().trim().min(10).max(6000),
  contactMethod: z.enum(["FORM", "EMAIL", "CALL"]).default("FORM"),
});
const reportSchema = z.object({
  summary: z.string().trim().min(20).max(12000),
  findings: z.string().trim().min(20).max(20000),
  limitations: z.string().trim().min(5).max(6000),
  visitedAt: z.string().min(1),
  fileIds: z.array(z.string()).max(20).default([]),
});
export async function accessibleRequest(user, id, tx = db) {
  const item = await tx.supportRequest.findUnique({
    where: { id },
    include: {
      requester: {
        select: { id: true, fullName: true, email: true, phone: true },
      },
      auction: { select: { id: true, title: true, city: true } },
    },
  });
  if (!item) fail(404, "Request not found.");
  if (
    !staff(user) &&
    item.requesterId !== user.id &&
    !(user.role === "ENGINEER" && item.assignedEngineerId === user.id)
  )
    fail(403, "You do not have access to this request.");
  return item;
}
export async function requestDetail(user, id) {
  const item = await accessibleRequest(user, id);
  const internal = staff(user) || user.role === "ENGINEER";
  const messages = await db.supportMessage.findMany({
    where: { requestId: id, ...(!internal ? { internal: false } : {}) },
    orderBy: { createdAt: "asc" },
  });
  const files = await db.managedFile.findMany({
    where: {
      requestId: id,
      ...(!internal ? { id: { in: item.approvedReport?.fileIds || [] } } : {}),
    },
    select: { id: true, name: true, mime: true, size: true, createdAt: true },
  });
  const deliveries = await db.emailDelivery.findMany({
    where: { requestId: id },
    select: {
      id: true,
      status: true,
      sentAt: true,
      createdAt: true,
      ...(staff(user) ? { lastError: true, attempts: true } : {}),
    },
  });
  const result = { ...item, messages, files, deliveries };
  if (!internal) {
    delete result.report;
    delete result.assignedEngineerId;
  }
  return result;
}
export async function createRequest(user, input) {
  const data = requestSchema.parse(input);
  if (
    data.auctionId &&
    !(await db.auctionNotice.findFirst({
      where: { id: data.auctionId, ...publishedWhere },
    }))
  )
    fail(404, "Published asset not found.");
  return db.$transaction(async (tx) => {
    const item = await tx.supportRequest.create({
      data: {
        ...data,
        auctionId: data.auctionId || null,
        requesterId: user.id,
        priority: capabilities(user).prioritySupport,
      },
    });
    await audit(tx, user, "BUYER_REQUEST_CREATED", item.id, {
      kind: item.kind,
      auctionId: item.auctionId,
    });
    return item;
  });
}
export async function addMessage(user, id, input) {
  const body = z.string().trim().min(1).max(6000).parse(input.body);
  const request = await accessibleRequest(user, id);
  if (request.status === "CLOSED")
    fail(409, "This request is closed. Open a new request for further help.");
  if (input.internal && !staff(user) && user.role !== "ENGINEER")
    fail(403, "Internal notes are restricted to staff.");
  return db.supportMessage.create({
    data: {
      requestId: id,
      authorId: user.id,
      body,
      internal: Boolean(input.internal),
    },
  });
}
export async function updateRequest(user, id, input) {
  if (!staff(user)) fail(403, "Only checker staff can manage requests.");
  const actions = [
    "CLAIM",
    "ASSIGN",
    "RETURN_REPORT",
    "APPROVE_REPORT",
    "RESOLVE",
    "CLOSE",
    "REOPEN",
  ];
  if (!actions.includes(input.action) || !Number.isInteger(input.version))
    fail(400, "A valid action and current version are required.");
  const notes = String(input.notes || "").trim();
  if (notes.length < 5) fail(400, "Add a meaningful note for this action.");
  return db.$transaction(async (tx) => {
    const item = await accessibleRequest(user, id, tx);
    if (
      item.assignedCheckerId &&
      item.assignedCheckerId !== user.id &&
      user.role !== "ADMIN"
    )
      fail(409, "This request belongs to another checker.");
    let data = { version: { increment: 1 }, assignedCheckerId: user.id };
    if (input.action === "CLAIM") {
      if (!["OPEN", "IN_REVIEW"].includes(item.status))
        fail(409, "Request cannot be claimed in this state.");
      data.status = "IN_REVIEW";
    }
    if (input.action === "ASSIGN") {
      if (!["OPEN", "IN_REVIEW", "REPORT_RETURNED"].includes(item.status))
        fail(409, "Request is not ready for engineer assignment.");
      const engineer = await tx.user.findFirst({
        where: { id: input.engineerId, role: "ENGINEER", isActive: true },
      });
      if (!engineer) fail(400, "Select an active field engineer.");
      data = { ...data, status: "ASSIGNED", assignedEngineerId: engineer.id };
    }
    if (["APPROVE_REPORT", "RETURN_REPORT"].includes(input.action)) {
      if (item.status !== "REPORT_SUBMITTED" || !item.report)
        fail(409, "No submitted report is awaiting review.");
      data.status =
        input.action === "APPROVE_REPORT"
          ? "REPORT_APPROVED"
          : "REPORT_RETURNED";
      if (input.action === "APPROVE_REPORT")
        data = {
          ...data,
          approvedReport: item.report,
          approvedById: user.id,
          approvedAt: new Date(),
        };
    }
    if (input.action === "RESOLVE") {
      if (!["OPEN", "IN_REVIEW", "REPORT_APPROVED"].includes(item.status))
        fail(409, "Finish the outstanding report review first.");
      if (
        ["DOCUMENT", "LEGAL", "FIELD_REPORT"].includes(item.kind) &&
        !item.approvedReport
      )
        fail(
          409,
          "This request requires an approved report before resolution.",
        );
      data.status = "RESOLVED";
    }
    if (input.action === "CLOSE") {
      if (!["RESOLVED", "REPORT_APPROVED"].includes(item.status))
        fail(409, "Resolve the request before closing it.");
      data.status = "CLOSED";
    }
    if (input.action === "REOPEN") {
      if (!["RESOLVED", "CLOSED"].includes(item.status))
        fail(409, "Only completed requests can be reopened.");
      data.status = "IN_REVIEW";
    }
    const changed = await tx.supportRequest.updateMany({
      where: { id, version: input.version },
      data,
    });
    if (!changed.count)
      fail(409, "Request changed. Reload before taking action.");
    await tx.supportMessage.create({
      data: { requestId: id, authorId: user.id, body: notes, internal: false },
    });
    await audit(
      tx,
      user,
      `REQUEST_${input.action}`,
      id,
      { status: data.status, notes },
      { status: item.status },
    );
    return tx.supportRequest.findUnique({ where: { id } });
  });
}
export async function submitRequestedReport(user, id, input) {
  const report = reportSchema.parse(input.report);
  if (!Number.isInteger(input.version))
    fail(400, "Current request version is required.");
  if (
    !Number.isFinite(Date.parse(report.visitedAt)) ||
    new Date(report.visitedAt) > new Date()
  )
    fail(400, "Enter the actual completed inspection date.");
  return db.$transaction(async (tx) => {
    const item = await accessibleRequest(user, id, tx);
    if (user.role !== "ENGINEER" || item.assignedEngineerId !== user.id)
      fail(403, "Only the assigned engineer may submit this report.");
    if (!["ASSIGNED", "REPORT_RETURNED"].includes(item.status))
      fail(409, "Report is not awaiting an engineer submission.");
    const files = await tx.managedFile.count({
      where: { id: { in: report.fileIds }, requestId: id },
    });
    if (files !== new Set(report.fileIds).size)
      fail(400, "Report attachments must belong to this request.");
    const updated = await tx.supportRequest.updateMany({
      where: { id, version: input.version },
      data: {
        report,
        status: "REPORT_SUBMITTED",
        reportVersion: { increment: 1 },
        version: { increment: 1 },
      },
    });
    if (!updated.count) fail(409, "Request changed. Reload before submitting.");
    await audit(tx, user, "REQUEST_REPORT_SUBMITTED", id, {
      reportVersion: item.reportVersion + 1,
    });
    return tx.supportRequest.findUnique({ where: { id } });
  });
}
export async function recommendPlan(user, input) {
  const data = z
    .object({
      buyerId: z.string(),
      plan: z.enum(Object.keys(PLAN_CAPABILITIES)),
      reason: z.string().trim().min(10).max(4000),
      contactNotes: z.string().trim().min(10).max(4000),
      consentGiven: z.literal(true),
    })
    .parse(input);
  if (
    !(await db.user.findFirst({
      where: { id: data.buyerId, role: "BUYER", isActive: true },
    }))
  )
    fail(404, "Buyer not found.");
  return db.$transaction(async (tx) => {
    const recommendation = await tx.planRecommendation.create({
      data: { ...data, proposedById: user.id },
    });
    await audit(tx, user, "PLAN_RECOMMENDED", recommendation.id, {
      buyerId: data.buyerId,
      plan: data.plan,
    });
    return recommendation;
  });
}
export async function reviewRecommendation(user, id, input) {
  if (
    !["APPROVE", "REJECT"].includes(input.action) ||
    String(input.notes || "").trim().length < 5
  )
    fail(400, "Choose a decision and give review notes.");
  return db.$transaction(async (tx) => {
    const item = await tx.planRecommendation.findUnique({ where: { id } });
    if (!item) fail(404, "Recommendation not found.");
    if (item.proposedById === user.id)
      fail(403, "A different checker must review this recommendation.");
    const status = input.action === "APPROVE" ? "APPROVED" : "REJECTED";
    const updated = await tx.planRecommendation.updateMany({
      where: { id, status: "PENDING_CHECKER" },
      data: {
        status,
        reviewNotes: input.notes,
        reviewedById: user.id,
        reviewedAt: new Date(),
      },
    });
    if (!updated.count) fail(409, "Recommendation was already reviewed.");
    await audit(tx, user, `PLAN_RECOMMENDATION_${status}`, id, {
      status,
      notes: input.notes,
    });
    return tx.planRecommendation.findUnique({ where: { id } });
  });
}
