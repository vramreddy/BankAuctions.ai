ALTER TABLE "auction_notices" ADD COLUMN "accessPricePaise" INTEGER;
CREATE TABLE "property_payment_intents" (
 "id" TEXT NOT NULL, "buyerId" TEXT NOT NULL, "auctionId" TEXT NOT NULL,
 "amountPaise" INTEGER NOT NULL, "currency" TEXT NOT NULL DEFAULT 'INR',
 "status" TEXT NOT NULL DEFAULT 'AWAITING_PROVIDER', "provider" TEXT, "providerOrderId" TEXT,
 "providerPaymentId" TEXT, "paidAt" TIMESTAMP(3), "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
 "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "property_payment_intents_pkey" PRIMARY KEY ("id"),
 CONSTRAINT "property_payment_positive" CHECK ("amountPaise" > 0)
);
CREATE UNIQUE INDEX "property_payment_intents_buyerId_auctionId_key" ON "property_payment_intents"("buyerId","auctionId");
CREATE UNIQUE INDEX "property_payment_intents_provider_providerOrderId_key" ON "property_payment_intents"("provider","providerOrderId");
CREATE UNIQUE INDEX "property_payment_intents_providerPaymentId_key" ON "property_payment_intents"("providerPaymentId");
