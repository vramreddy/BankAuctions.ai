import { db } from "../../services/db.js";
import { audit, fail, publishedWhere } from "../workflow/notices.service.js";
export async function preparePropertyPurchase(user, auctionId) {
  return db.$transaction(async (tx) => {
    const asset = await tx.auctionNotice.findFirst({
      where: { id: auctionId, ...publishedWhere },
    });
    if (!asset) fail(404, "Published asset not found.");
    if (
      await tx.propertyUnlock.findUnique({
        where: { userId_auctionId: { userId: user.id, auctionId } },
      })
    )
      fail(409, "You already have access to this property.");
    if (
      !Number.isInteger(asset.accessPricePaise) ||
      asset.accessPricePaise <= 0
    )
      fail(
        409,
        "A property access price has not been configured. Contact your checker.",
      );
    const where = { buyerId_auctionId: { buyerId: user.id, auctionId } };
    const existing = await tx.propertyPaymentIntent.findUnique({ where });
    if (existing && existing.status !== "AWAITING_PROVIDER") return existing;
    const item = await tx.propertyPaymentIntent.upsert({
      where,
      create: {
        buyerId: user.id,
        auctionId,
        amountPaise: asset.accessPricePaise,
      },
      update: { amountPaise: asset.accessPricePaise },
    });
    await audit(tx, user, "PROPERTY_PURCHASE_PREPARED", item.id, {
      auctionId,
      amountPaise: item.amountPaise,
      currency: item.currency,
    });
    return item;
  });
}
// Internal integration boundary, deliberately not exposed as an HTTP endpoint.
// A future provider adapter MUST authenticate its webhook and verify captured
// payment server-to-server before passing these facts. Browser callbacks are not proof.
export async function settleVerifiedPropertyPayment(payment) {
  if (
    payment.status !== "CAPTURED" ||
    !payment.provider ||
    !payment.orderId ||
    !payment.paymentId
  )
    fail(400, "A verified captured payment is required.");
  return db.$transaction(async (tx) => {
    const item = await tx.propertyPaymentIntent.findUnique({
      where: {
        provider_providerOrderId: {
          provider: payment.provider,
          providerOrderId: payment.orderId,
        },
      },
    });
    if (!item) fail(404, "Payment order not found.");
    if (
      item.amountPaise !== payment.amountPaise ||
      item.currency !== payment.currency
    )
      fail(409, "Payment amount or currency does not match the order.");
    if (item.status === "PAID") {
      if (item.providerPaymentId !== payment.paymentId)
        fail(409, "Order was settled with a different payment.");
      return item;
    }
    if (item.status !== "PENDING_PAYMENT")
      fail(409, "Order is not awaiting payment.");
    const buyer = await tx.user.findUnique({ where: { id: item.buyerId } });
    if (!buyer || buyer.role !== "BUYER")
      fail(409, "Buyer account is unavailable.");
    const changed = await tx.propertyPaymentIntent.updateMany({
      where: { id: item.id, status: "PENDING_PAYMENT" },
      data: {
        status: "PAID",
        providerPaymentId: payment.paymentId,
        paidAt: new Date(),
      },
    });
    if (!changed.count)
      fail(409, "Payment is being settled. Retry the verified event.");
    await tx.propertyUnlock.upsert({
      where: {
        userId_auctionId: { userId: item.buyerId, auctionId: item.auctionId },
      },
      create: { userId: item.buyerId, auctionId: item.auctionId },
      update: {},
    });
    await audit(
      tx,
      { id: buyer.id, fullName: "Verified payment provider", role: "SYSTEM" },
      "PROPERTY_PAYMENT_ACCESS_GRANTED",
      item.id,
      {
        auctionId: item.auctionId,
        amountPaise: item.amountPaise,
        provider: item.provider,
      },
    );
    return tx.propertyPaymentIntent.findUnique({ where: { id: item.id } });
  });
}
