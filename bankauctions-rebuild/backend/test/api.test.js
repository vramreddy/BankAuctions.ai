import { settleVerifiedPropertyPayment } from "../src/modules/payments/payments.service.js";
import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import app from "../src/app.js";
import { db } from "../src/services/db.js";
import {
  parseMoney,
  parseNoticeDate,
  auctionTimestamp,
  noticeSchema,
} from "../../shared/notices/contract.js";

const users = {},
  tokens = {};
let noticeId, auctionId, requestId, reportFileId;
const raw = {
  noticeType: "AUCTION",
  saleNoticeType: "SARFAESI_RULE_8_6",
  bankName: "Integration Test Bank",
  branchName: "Test branch",
  noticeDate: "2026-11-01",
  auctionDate: "2026-12-20",
  auctionTime: "10:00 AM to 4:00 PM",
  reservePrice: "Rs. 23,00,000/-",
  emdAmount: "Rs. 2,30,000/-",
  bidIncrementAmount: "Rs.25,000 /-",
  assetCategory: "IMMOBILE",
  assetType: "FLAT",
  city: "Chennai",
  locality: "Test locality",
  propertyAddress: "Test property address",
  propertyAddressEvidence: "Original schedule test evidence",
  propertyType: "Flat",
  possessionStatus: "PHYSICAL",
  fieldConfidence: { reservePrice: "LOW" },
  propertyDetails: { flatNumber: "S-2" },
  addressCandidates: [
    {
      text: "Test property address",
      type: "PROPERTY",
      heading: "Property schedule",
    },
  ],
  additionalDetails: {
    fieldEvidence: [
      { field: "reservePrice", page: 1, evidenceText: "Rs.23,00,000/-" },
    ],
    sourceFiles: { noticePdfs: ["C:/private/notice.pdf"] },
  },
};
const api = (method, path, role = "checker", body) => {
  const r = request(app)[method]("/api/v1" + path);
  if (tokens[role]) r.set("Authorization", `Bearer ${tokens[role]}`);
  return body === undefined ? r : r.send(body);
};
const pdf = {
  name: "integration-source.pdf",
  mime: "application/pdf",
  base64: Buffer.from(
    "%PDF-1.4\nTest fixture evidence, not a real source.\n%%EOF",
  ).toString("base64"),
};
before(async () => {
  for (const [key, role] of [
    ["admin", "ADMIN"],
    ["checker", "CHECKER"],
    ["checker2", "CHECKER"],
    ["engineer", "ENGINEER"],
    ["engineer2", "ENGINEER"],
    ["buyer", "BUYER"],
    ["buyer2", "BUYER"],
    ["marketing", "MARKETING"],
  ]) {
    users[key] = await db.user.create({
      data: {
        email: `${key}@bankauctions.ai`,
        fullName: `Test ${key}`,
        phone: String(9000000000 + Object.keys(users).length),
        role,
        passwordHash: await bcrypt.hash(
          key === "buyer" ? "Buyer@123" : "TestPassword@123",
          4,
        ),
        isActive: true,
        unlocksRemaining: 3,
      },
    });
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: users[key].email,
        portal: role,
        password: key === "buyer" ? "Buyer@123" : "TestPassword@123",
      });
    assert.equal(res.status, 200, res.body.message);
    tokens[key] = res.body.token;
  }
  for (const [code, slug] of [
    ["flat", "flats"],
    ["land", "plots"],
  ])
    await db.auctionCategory.create({ data: { code, slug, name: code } });
});
after(() => db.$disconnect());
describe("Checker-gated PostgreSQL workflow", () => {
  it("normalizes rupee/date fields without inventing invalid data", () => {
    assert.equal(parseMoney("Rs. 23,00,000/-"), 2300000);
    assert.equal(parseMoney("unknown"), null);
    assert.equal(parseNoticeDate("31.02.2026"), null);
    assert.equal(parseNoticeDate("11.11.2026"), "2026-11-11");
    assert.equal(
      auctionTimestamp("2026-12-20", "10:00 AM to 4:00 PM").toISOString(),
      "2026-12-20T04:30:00.000Z",
    );
  });
  it("starts with no demo auction inventory", async () => {
    const res = await api("get", "/auctions", "public");
    assert.equal(res.status, 200);
    assert.equal(res.body.data.length, 0);
  });
  it("preserves full raw data, deduplicates imports and denies buyer access", async () => {
    const denied = await api("post", "/workflow/notices/import", "buyer", {
      records: [raw],
    });
    assert.equal(denied.status, 403);
    const res = await api("post", "/workflow/notices/import", "checker", {
      records: [raw],
      sourceName: "test.json",
    });
    assert.equal(res.status, 201, res.body.message);
    noticeId = res.body.data.imported[0].id;
    assert.deepEqual(res.body.data.imported[0].raw, raw);
    const duplicate = await api("post", "/workflow/notices/import", "checker", {
      records: [raw],
    });
    assert.equal(duplicate.body.data.duplicates.length, 1);
    assert.equal(
      (await api("get", "/auctions/" + noticeId, "public")).status,
      404,
    );
    assert.equal(
      (await api("get", "/workflow/notices/" + noticeId, "buyer")).status,
      403,
    );
  });
  it("requires claim ownership, matching revision and uploaded source evidence", async () => {
    assert.equal(
      (await api("post", `/workflow/notices/${noticeId}/claim`)).status,
      200,
    );
    assert.equal(
      (await api("post", `/workflow/notices/${noticeId}/claim`, "checker2"))
        .status,
      409,
    );
    let result = await api(
      "patch",
      `/workflow/notices/${noticeId}`,
      "checker",
      {
        decision: "APPROVE",
        version: 1,
        reviewed: raw,
        notes: "Checked all source evidence",
        evidenceConfirmed: true,
      },
    );
    assert.equal(result.status, 422);
    result = await api("patch", `/workflow/notices/${noticeId}`, "checker", {
      decision: "SAVE",
      version: 99,
      reviewed: raw,
      notes: "Stale revision review",
    });
    assert.equal(result.status, 409);
  });
  it("publishes immediately after checker approval and excludes private source information", async () => {
    assert.equal(
      (
        await api("post", "/workflow/files", "checker", {
          ...pdf,
          extractionId: noticeId,
        })
      ).status,
      201,
    );
    const res = await api("patch", `/workflow/notices/${noticeId}`, "checker", {
      decision: "APPROVE",
      version: 1,
      reviewed: raw,
      notes: "Checked original notice and resolved confidence warnings.",
      evidenceConfirmed: true,
    });
    assert.equal(res.status, 200, res.body.message);
    auctionId = res.body.data.auctionId;
    const search = await api("get", "/auctions?city=chennai", "public");
    assert.equal(search.body.data.length, 1);
    assert.equal(search.body.data[0].reservePrice, 2300000);
    assert.equal(search.body.data[0].attributes.makerExtraction, undefined);
    assert.ok(!JSON.stringify(search.body).includes("C:/private"));
    assert.equal(
      (await api("get", "/auctions/" + auctionId, "public")).status,
      200,
    );
    assert.equal(
      (await api("get", `/workflow/notices/${noticeId}/export`)).body[0]
        .additionalDetails.sourceFiles.noticePdfs[0],
      "C:/private/notice.pdf",
    );
  });
  it("does not allow a possession notice to publish as an auction", async () => {
    const data = {
      ...raw,
      noticeType: "POSSESSION",
      loanReference: "POSSESSION-TEST",
    };
    const imported = await api("post", "/workflow/notices/import", "checker", {
      records: [data],
    });
    const id = imported.body.data.imported[0].id;
    await api("post", `/workflow/notices/${id}/claim`);
    await api("post", "/workflow/files", "checker", {
      ...pdf,
      extractionId: id,
    });
    const res = await api("patch", `/workflow/notices/${id}`, "checker", {
      decision: "APPROVE",
      version: 1,
      reviewed: data,
      notes: "Source reviewed for possession notice",
      evidenceConfirmed: true,
    });
    assert.equal(res.status, 422);
    assert.match(res.body.message, /Only a verified AUCTION/);
  });
  it("enforces paid search capabilities on the server", async () => {
    assert.equal((await api("get", "/auctions?days=30", "buyer")).status, 403);
    await db.user.update({
      where: { id: users.buyer.id },
      data: { planTier: "PRO" },
    });
    assert.equal((await api("get", "/auctions?days=30", "buyer")).status, 200);
    assert.equal((await api("get", "/auctions?prem=1", "buyer")).status, 403);
  });
  it("creates private buyer requests and prevents cross-user or unassigned-engineer access", async () => {
    const res = await api("post", "/workflow/requests", "buyer", {
      auctionId,
      kind: "DOCUMENT",
      subject: "Additional property documents",
      description: "Please obtain an updated property verification report.",
      contactMethod: "EMAIL",
    });
    assert.equal(res.status, 201, res.body.message);
    requestId = res.body.data.id;
    assert.equal(
      (await api("get", `/workflow/requests/${requestId}`, "buyer2")).status,
      403,
    );
    assert.equal(
      (await api("get", `/workflow/requests/${requestId}`, "engineer")).status,
      403,
    );
    await api("patch", `/workflow/requests/${requestId}`, "checker", {
      version: 1,
      action: "ASSIGN",
      engineerId: users.engineer.id,
      notes: "Obtain requested evidence from the property.",
    });
    assert.equal(
      (await api("get", `/workflow/requests/${requestId}`, "engineer")).status,
      200,
    );
    assert.equal(
      (await api("get", `/workflow/requests/${requestId}`, "engineer2")).status,
      403,
    );
  });
  it("keeps report drafts private and requires checker approval before delivery", async () => {
    const uploaded = await api("post", "/workflow/files", "engineer", {
      ...pdf,
      requestId,
    });
    reportFileId = uploaded.body.data.id;
    const report = {
      summary: "The requested field verification is completed.",
      findings:
        "Inspected the property and documented the requested boundaries.",
      limitations: "This report is not a legal title opinion.",
      visitedAt: "2026-11-01",
      fileIds: [reportFileId],
    };
    const submission = await api(
      "post",
      `/workflow/requests/${requestId}/report`,
      "engineer",
      { version: 2, report },
    );
    assert.equal(submission.status, 200, submission.body.message);
    const buyer = await api("get", `/workflow/requests/${requestId}`, "buyer");
    assert.equal(buyer.body.data.report, undefined);
    assert.equal(buyer.body.data.approvedReport, null);
    assert.equal(
      (await api("get", `/workflow/files/${reportFileId}`, "buyer")).status,
      403,
    );
    assert.equal(
      (await api("post", `/workflow/requests/${requestId}/deliver`)).status,
      409,
    );
    const approved = await api(
      "patch",
      `/workflow/requests/${requestId}`,
      "checker",
      {
        version: 3,
        action: "APPROVE_REPORT",
        notes: "Report and source attachments verified.",
      },
    );
    assert.equal(approved.status, 200, approved.body.message);
    const visible = await api(
      "get",
      `/workflow/requests/${requestId}`,
      "buyer",
    );
    assert.equal(visible.body.data.approvedReport.summary, report.summary);
    assert.equal(
      (await api("get", `/workflow/files/${reportFileId}`, "buyer")).status,
      200,
    );
    const delivery = await api(
      "post",
      `/workflow/requests/${requestId}/deliver`,
    );
    assert.equal(delivery.status, 200);
    assert.equal(delivery.body.data.configured, false);
    assert.equal(
      (await db.emailDelivery.findFirst({ where: { requestId } })).status,
      "PENDING",
    );
    await api("post", `/workflow/requests/${requestId}/deliver`);
    assert.equal(await db.emailDelivery.count({ where: { requestId } }), 1);
  });
  it("requires independent recommendation review without silently activating a plan", async () => {
    const res = await api("post", "/workflow/recommendations", "marketing", {
      buyerId: users.buyer.id,
      plan: "PREMIUM",
      reason:
        "Buyer requires possession filters and priority report coordination.",
      contactNotes:
        "Explained available services; buyer requested a recommendation.",
      consentGiven: true,
    });
    assert.equal(res.status, 201, res.body.message);
    assert.equal(
      (await api("get", "/workflow/recommendations", "buyer")).body.data.length,
      0,
    );
    const approved = await api(
      "patch",
      `/workflow/recommendations/${res.body.data.id}`,
      "checker",
      {
        action: "APPROVE",
        notes: "Recommendation matches the stated buyer requirements.",
      },
    );
    assert.equal(approved.status, 200);
    assert.equal(
      (await db.user.findUnique({ where: { id: users.buyer.id } })).planTier,
      "PRO",
    );
    assert.equal(
      (await api("get", "/workflow/recommendations", "buyer")).body.data.length,
      1,
    );
  });
  it("retains approvals and reports across independent database connections", async () => {
    const another = new PrismaClient();
    try {
      assert.equal(
        (await another.noticeExtraction.findUnique({ where: { id: noticeId } }))
          .status,
        "APPROVED",
      );
      assert.ok(
        (await another.supportRequest.findUnique({ where: { id: requestId } }))
          .approvedReport,
      );
    } finally {
      await another.$disconnect();
    }
  });
  it("enforces admin-only plan changes and export permissions", async () => {
    assert.equal(
      (
        await api(
          "patch",
          `/workflow/buyers/${users.buyer.id}/plan`,
          "checker",
          {
            plan: "PRO_PREMIUM",
            notes: "Confirmed subscription reference TEST",
          },
        )
      ).status,
      403,
    );
    assert.equal((await api("get", "/auctions/export", "buyer")).status, 403);
    assert.equal(
      (
        await api("patch", `/workflow/buyers/${users.buyer.id}/plan`, "admin", {
          plan: "PRO_PREMIUM",
          notes: "Confirmed subscription reference TEST",
        })
      ).status,
      200,
    );
    const exported = await api("get", "/auctions/export", "buyer");
    assert.equal(exported.status, 200);
    assert.equal(exported.body.data.length, 1);
    assert.equal(
      (await api("get", "/auctions/banks", "public")).body.data.length,
      1,
    );
  });
  it("hides withdrawn assets from saved, unlocked, exports and direct links", async () => {
    await api("post", "/auctions/save/" + auctionId, "buyer");
    await api("post", "/auctions/unlock/" + auctionId, "buyer");
    const saved = await api("get", "/me/saved", "buyer");
    assert.equal(saved.body.data.length, 1);
    assert.ok(!JSON.stringify(saved.body).includes("C:/private"));
    await db.auctionNotice.update({
      where: { id: auctionId },
      data: { status: "UNPUBLISHED" },
    });
    assert.equal((await api("get", "/me/saved", "buyer")).body.data.length, 0);
    assert.equal(
      (await api("get", "/me/unlocked", "buyer")).body.data.length,
      0,
    );
    assert.equal(
      (await api("get", "/auctions/export", "buyer")).body.data.length,
      0,
    );
    assert.equal(
      (await api("get", "/auctions/" + auctionId, "public")).status,
      404,
    );
  });
  it("rejects correct credentials at the wrong role portal without issuing a session", async () => {
    for (const [key, portal] of [
      ["buyer", "CHECKER"],
      ["checker", "BUYER"],
    ]) {
      const result = await request(app)
        .post("/api/v1/auth/login")
        .send({
          email: users[key].email,
          password: key === "buyer" ? "Buyer@123" : "TestPassword@123",
          portal,
        });
      assert.equal(result.status, 403);
      assert.equal(result.body.token, undefined);
      assert.equal(result.headers["set-cookie"], undefined);
    }
    const result = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: users.checker.email,
        password: "TestPassword@123",
        portal: "CHECKER",
      });
    assert.equal(result.status, 200);
  });
  it("keeps policy drafts private and audits versioned publication and withdrawal", async () => {
    assert.equal((await api("get", "/management/pages", "buyer")).status, 403);
    assert.equal((await api("get", "/me/saved", "checker")).status, 403);
    assert.equal(
      (await api("get", "/management/public/terms", "public")).status,
      404,
    );
    const body = {
      title: "Test terms",
      body: "Test policy text supplied for workflow verification, not an actual legal policy.",
      notes: "Reviewed publication test",
      version: 0,
      action: "SAVE",
    };
    assert.equal(
      (await api("patch", "/management/pages/terms", "checker", body)).status,
      200,
    );
    assert.equal(
      (await api("get", "/management/public/terms", "public")).status,
      404,
    );
    assert.equal(
      (
        await api("patch", "/management/pages/terms", "checker", {
          ...body,
          action: "PUBLISH",
          version: 1,
        })
      ).status,
      200,
    );
    assert.equal(
      (await api("get", "/management/public/terms", "public")).body.data.body,
      body.body,
    );
    assert.equal(
      (
        await api("patch", "/management/pages/terms", "checker", {
          ...body,
          body: "New unpublished draft text",
          version: 2,
        })
      ).status,
      200,
    );
    assert.equal(
      (await api("get", "/management/public/terms", "public")).body.data.body,
      body.body,
    );
    assert.equal(
      (
        await api("patch", "/management/pages/terms", "checker", {
          ...body,
          version: 1,
        })
      ).status,
      409,
    );
    assert.equal(
      (
        await api("patch", "/management/pages/terms", "checker", {
          ...body,
          action: "WITHDRAW",
          version: 3,
        })
      ).status,
      200,
    );
    assert.equal(
      (await api("get", "/management/public/terms", "public")).status,
      404,
    );
  });
  it("restricts buyer activity to staff and exposes only selected operational information", async () => {
    assert.equal(
      (await api("get", `/management/buyers/${users.buyer.id}`, "buyer2"))
        .status,
      403,
    );
    assert.equal(
      (await api("get", `/management/buyers/${users.buyer.id}`, "marketing"))
        .status,
      403,
    );
    const result = await api(
      "get",
      `/management/buyers/${users.buyer.id}`,
      "checker",
    );
    assert.equal(result.status, 200, result.body.message);
    assert.ok(result.body.data.logins.length);
    assert.ok(result.body.data.saved.length);
    assert.ok(result.body.data.unlocked.length);
    assert.equal(result.body.data.buyer.passwordHash, undefined);
  });
  it("allows checker catalog revision only through renewed source approval", async () => {
    assert.equal((await api("get", "/management/assets", "buyer")).status, 403);
    const item = await db.noticeExtraction.findUnique({
      where: { id: noticeId },
    });
    const payload = {
      action: "REVISE",
      version: item.version,
      notes: "Corrected property description from original evidence.",
    };
    assert.equal(
      (
        await api(
          "patch",
          `/management/assets/${auctionId}`,
          "checker",
          payload,
        )
      ).status,
      200,
    );
    assert.equal(
      (await api("get", "/auctions/" + auctionId, "public")).status,
      404,
    );
    assert.equal(
      (
        await api("patch", `/management/assets/${auctionId}`, "checker", {
          ...payload,
          action: "PUBLISH",
          version: item.version + 1,
        })
      ).status,
      409,
    );
    const revised = {
      ...raw,
      propertyDescription:
        "Updated description checked against original evidence.",
    };
    const result = await api(
      "patch",
      `/workflow/notices/${noticeId}`,
      "checker",
      {
        version: item.version + 1,
        decision: "APPROVE",
        reviewed: revised,
        notes: "Original evidence checked for revised description.",
        evidenceConfirmed: true,
      },
    );
    assert.equal(result.status, 200, result.body.message);
    assert.equal(result.body.data.auctionId, auctionId);
    assert.equal(await db.auctionNotice.count(), 1);
    assert.deepEqual(
      (await db.noticeExtraction.findUnique({ where: { id: noticeId } })).raw,
      raw,
    );
    assert.equal(
      (await api("get", "/auctions/" + auctionId, "public")).status,
      200,
    );
  });

  it("prepares a priced property purchase without charging or granting access", async () => {
    const notice = await db.noticeExtraction.findUnique({
      where: { id: noticeId },
    });
    assert.equal(
      (
        await api("patch", `/management/assets/${auctionId}`, "checker", {
          action: "ACCESS_PRICE",
          accessPricePaise: 19900,
          notes: "Set reviewed property information access fee.",
          version: notice.version,
        })
      ).status,
      200,
    );
    assert.equal(
      (await api("get", "/auctions/" + auctionId, "public")).body.data
        .accessPricePaise,
      19900,
    );
    const result = await api(
      "post",
      `/payments/property/${auctionId}`,
      "buyer2",
    );
    assert.equal(result.status, 200, result.body.message);
    assert.equal(result.body.data.checkoutAvailable, false);
    assert.equal(result.body.data.status, "AWAITING_PROVIDER");
    assert.equal(result.body.data.amountPaise, 19900);
    assert.equal(
      await db.propertyUnlock.count({
        where: { userId: users.buyer2.id, auctionId },
      }),
      0,
    );
    assert.equal(
      (await api("get", `/payments/${result.body.data.id}`, "buyer")).status,
      404,
    );
    assert.equal(
      (await api("post", `/payments/property/${auctionId}`, "checker")).status,
      403,
    );
    assert.equal(
      (await api("post", `/payments/property/${auctionId}`, "buyer2")).body.data
        .id,
      result.body.data.id,
    );
    const intent = await db.propertyPaymentIntent.findUnique({
      where: { id: result.body.data.id },
    });
    await assert.rejects(
      settleVerifiedPropertyPayment({
        provider: "TEST",
        orderId: "test-order",
        paymentId: "test-payment",
        status: "CREATED",
        amountPaise: 19900,
        currency: "INR",
      }),
    );
    await db.propertyPaymentIntent.update({
      where: { id: intent.id },
      data: {
        provider: "TEST",
        providerOrderId: "test-order",
        status: "PENDING_PAYMENT",
      },
    });
    await assert.rejects(
      settleVerifiedPropertyPayment({
        provider: "TEST",
        orderId: "test-order",
        paymentId: "test-payment",
        status: "CAPTURED",
        amountPaise: 1,
        currency: "INR",
      }),
    );
    assert.equal(
      await db.propertyUnlock.count({
        where: { userId: users.buyer2.id, auctionId },
      }),
      0,
    );
    const capture = {
      provider: "TEST",
      orderId: "test-order",
      paymentId: "test-payment",
      status: "CAPTURED",
      amountPaise: 19900,
      currency: "INR",
    };
    await settleVerifiedPropertyPayment(capture);
    await settleVerifiedPropertyPayment(capture);
    assert.equal(
      await db.propertyUnlock.count({ where: { userId: users.buyer2.id } }),
      1,
    );
    assert.equal(
      (await db.user.findUnique({ where: { id: users.buyer2.id } }))
        .unlocksRemaining,
      3,
    );
    assert.equal(
      (await api("get", `/payments/${intent.id}`, "buyer2")).body.data.status,
      "PAID",
    );
  });
});
