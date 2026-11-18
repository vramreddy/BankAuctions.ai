-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'BUYER',
    "plan_tier" TEXT NOT NULL DEFAULT 'FREE',
    "unlocks_remaining" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "city" TEXT DEFAULT 'chennai',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "lastLoginAt" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "banks" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "logo_url" TEXT,
    "contact_phone" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "banks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auction_categories" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "icon" TEXT,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auction_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auction_notices" (
    "id" TEXT NOT NULL,
    "source_ref" TEXT NOT NULL,
    "source_link" TEXT,
    "bank_id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "short_title" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "locality" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "pincode" TEXT,
    "reserve_price" DOUBLE PRECISION NOT NULL,
    "estimated_market_value" DOUBLE PRECISION,
    "emd_amount" DOUBLE PRECISION NOT NULL,
    "bid_increment" DOUBLE PRECISION NOT NULL DEFAULT 25000,
    "auction_start_date" TIMESTAMP(3) NOT NULL,
    "auction_end_date" TIMESTAMP(3),
    "notice_date" TIMESTAMP(3),
    "inspection_date" TEXT,
    "possession" TEXT NOT NULL DEFAULT 'Symbolic possession',
    "encumbrances" TEXT DEFAULT 'None disclosed',
    "contact_officer_name" TEXT,
    "contact_officer_phone" TEXT,
    "ai_score" INTEGER NOT NULL DEFAULT 75,
    "ai_rank" INTEGER NOT NULL DEFAULT 1,
    "ai_discount_pct" DOUBLE PRECISION NOT NULL DEFAULT 25.0,
    "is_premium" BOOLEAN NOT NULL DEFAULT false,
    "has_bank_photos" BOOLEAN NOT NULL DEFAULT false,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "primary_image_url" TEXT,
    "additional_images" JSONB NOT NULL DEFAULT '[]',
    "status" TEXT NOT NULL DEFAULT 'IMPORTED',
    "claimed_by_checker_id" TEXT,
    "claimed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "checkerApprovedAt" TIMESTAMP(3),
    "checkerApprovedById" TEXT,

    CONSTRAINT "auction_notices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auction_attributes" (
    "id" TEXT NOT NULL,
    "auction_id" TEXT NOT NULL,
    "attributes" JSONB NOT NULL,
    "maker_extraction" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "auction_attributes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_reviews" (
    "id" TEXT NOT NULL,
    "auction_id" TEXT NOT NULL,
    "checker_id" TEXT NOT NULL,
    "decision" TEXT NOT NULL,
    "correction_notes" TEXT,
    "field_corrections" JSONB NOT NULL DEFAULT '{}',
    "review_duration_seconds" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "verification_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inspection_assignments" (
    "id" TEXT NOT NULL,
    "auction_id" TEXT NOT NULL,
    "engineer_id" TEXT NOT NULL,
    "assigned_by_id" TEXT NOT NULL,
    "scheduled_date" TIMESTAMP(3),
    "scheduled_slot" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ASSIGNED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inspection_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inspection_reports" (
    "id" TEXT NOT NULL,
    "assignment_id" TEXT NOT NULL,
    "occupancy_status" TEXT NOT NULL,
    "access_road_type" TEXT NOT NULL,
    "boundary_matches" BOOLEAN NOT NULL,
    "property_condition" TEXT NOT NULL,
    "utilities_observed" JSONB NOT NULL DEFAULT '[]',
    "litigation_observed" TEXT DEFAULT 'None seen',
    "engineer_valuation_estimate" DOUBLE PRECISION NOT NULL,
    "engineer_notes" TEXT NOT NULL,
    "gps_coordinates" TEXT NOT NULL,
    "landmark_name" TEXT NOT NULL,
    "landmark_distance_km" DOUBLE PRECISION NOT NULL,
    "photos" JSONB NOT NULL DEFAULT '[]',
    "submitted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inspection_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "saved_properties" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "auction_id" TEXT NOT NULL,
    "saved_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "saved_properties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "property_unlocks" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "auction_id" TEXT NOT NULL,
    "unlocked_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "property_unlocks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "analytics_events" (
    "id" TEXT NOT NULL,
    "event_type" TEXT NOT NULL,
    "entity_id" TEXT,
    "user_id" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "analytics_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "actor_id" TEXT,
    "actor_name" TEXT NOT NULL,
    "actor_role" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entity_type" TEXT NOT NULL,
    "entity_id" TEXT NOT NULL,
    "before_state" JSONB,
    "after_state" JSONB,
    "ip_address" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "site_settings" (
    "id" TEXT NOT NULL,
    "maker_auto_publish" BOOLEAN NOT NULL DEFAULT false,
    "chat_widget" BOOLEAN NOT NULL DEFAULT true,
    "banner_notice" TEXT DEFAULT '',
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "site_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notice_extractions" (
    "id" TEXT NOT NULL,
    "fingerprint" TEXT NOT NULL,
    "sourceName" TEXT NOT NULL,
    "raw" JSONB NOT NULL,
    "reviewed" JSONB NOT NULL,
    "listing" JSONB NOT NULL DEFAULT '{}',
    "status" TEXT NOT NULL DEFAULT 'PENDING_CHECKER',
    "version" INTEGER NOT NULL DEFAULT 1,
    "claimedById" TEXT,
    "claimedAt" TIMESTAMP(3),
    "importedById" TEXT NOT NULL,
    "reviewedById" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "reviewNotes" TEXT,
    "auctionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notice_extractions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "support_requests" (
    "id" TEXT NOT NULL,
    "requesterId" TEXT NOT NULL,
    "auctionId" TEXT,
    "kind" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "contactMethod" TEXT NOT NULL DEFAULT 'FORM',
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "priority" BOOLEAN NOT NULL DEFAULT false,
    "assignedCheckerId" TEXT,
    "assignedEngineerId" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,
    "report" JSONB,
    "approvedReport" JSONB,
    "reportVersion" INTEGER NOT NULL DEFAULT 0,
    "approvedById" TEXT,
    "approvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "support_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "support_messages" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "internal" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "support_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "managed_files" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "mime" TEXT NOT NULL,
    "purpose" TEXT NOT NULL DEFAULT 'EVIDENCE',
    "bytes" BYTEA NOT NULL,
    "size" INTEGER NOT NULL,
    "sha256" TEXT NOT NULL,
    "uploadedById" TEXT NOT NULL,
    "extractionId" TEXT,
    "requestId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "managed_files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plan_recommendations" (
    "id" TEXT NOT NULL,
    "buyerId" TEXT NOT NULL,
    "proposedById" TEXT NOT NULL,
    "plan" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "contactNotes" TEXT NOT NULL,
    "consentGiven" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'PENDING_CHECKER',
    "reviewedById" TEXT,
    "reviewNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),

    CONSTRAINT "plan_recommendations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_deliveries" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "reportVersion" INTEGER NOT NULL,
    "recipient" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "lastError" TEXT,
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "email_deliveries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "banks_code_key" ON "banks"("code");

-- CreateIndex
CREATE UNIQUE INDEX "auction_categories_code_key" ON "auction_categories"("code");

-- CreateIndex
CREATE UNIQUE INDEX "auction_categories_slug_key" ON "auction_categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "auction_notices_source_ref_key" ON "auction_notices"("source_ref");

-- CreateIndex
CREATE INDEX "auction_notices_city_status_idx" ON "auction_notices"("city", "status");

-- CreateIndex
CREATE INDEX "auction_notices_reserve_price_idx" ON "auction_notices"("reserve_price");

-- CreateIndex
CREATE INDEX "auction_notices_auction_start_date_idx" ON "auction_notices"("auction_start_date");

-- CreateIndex
CREATE UNIQUE INDEX "auction_attributes_auction_id_key" ON "auction_attributes"("auction_id");

-- CreateIndex
CREATE UNIQUE INDEX "inspection_reports_assignment_id_key" ON "inspection_reports"("assignment_id");

-- CreateIndex
CREATE UNIQUE INDEX "saved_properties_user_id_auction_id_key" ON "saved_properties"("user_id", "auction_id");

-- CreateIndex
CREATE UNIQUE INDEX "property_unlocks_user_id_auction_id_key" ON "property_unlocks"("user_id", "auction_id");

-- CreateIndex
CREATE INDEX "analytics_events_event_type_created_at_idx" ON "analytics_events"("event_type", "created_at");

-- CreateIndex
CREATE INDEX "audit_logs_entity_type_entity_id_idx" ON "audit_logs"("entity_type", "entity_id");

-- CreateIndex
CREATE UNIQUE INDEX "notice_extractions_fingerprint_key" ON "notice_extractions"("fingerprint");

-- CreateIndex
CREATE UNIQUE INDEX "notice_extractions_auctionId_key" ON "notice_extractions"("auctionId");

-- CreateIndex
CREATE INDEX "notice_extractions_status_createdAt_idx" ON "notice_extractions"("status", "createdAt");

-- CreateIndex
CREATE INDEX "support_requests_requesterId_status_idx" ON "support_requests"("requesterId", "status");

-- CreateIndex
CREATE INDEX "support_requests_assignedEngineerId_status_idx" ON "support_requests"("assignedEngineerId", "status");

-- CreateIndex
CREATE INDEX "support_messages_requestId_createdAt_idx" ON "support_messages"("requestId", "createdAt");

-- CreateIndex
CREATE INDEX "managed_files_extractionId_idx" ON "managed_files"("extractionId");

-- CreateIndex
CREATE INDEX "managed_files_requestId_idx" ON "managed_files"("requestId");

-- CreateIndex
CREATE INDEX "plan_recommendations_status_buyerId_idx" ON "plan_recommendations"("status", "buyerId");

-- CreateIndex
CREATE INDEX "email_deliveries_status_createdAt_idx" ON "email_deliveries"("status", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "email_deliveries_requestId_reportVersion_key" ON "email_deliveries"("requestId", "reportVersion");

-- AddForeignKey
ALTER TABLE "auction_notices" ADD CONSTRAINT "auction_notices_bank_id_fkey" FOREIGN KEY ("bank_id") REFERENCES "banks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auction_notices" ADD CONSTRAINT "auction_notices_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "auction_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auction_notices" ADD CONSTRAINT "auction_notices_claimed_by_checker_id_fkey" FOREIGN KEY ("claimed_by_checker_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auction_attributes" ADD CONSTRAINT "auction_attributes_auction_id_fkey" FOREIGN KEY ("auction_id") REFERENCES "auction_notices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verification_reviews" ADD CONSTRAINT "verification_reviews_auction_id_fkey" FOREIGN KEY ("auction_id") REFERENCES "auction_notices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verification_reviews" ADD CONSTRAINT "verification_reviews_checker_id_fkey" FOREIGN KEY ("checker_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inspection_assignments" ADD CONSTRAINT "inspection_assignments_auction_id_fkey" FOREIGN KEY ("auction_id") REFERENCES "auction_notices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inspection_assignments" ADD CONSTRAINT "inspection_assignments_engineer_id_fkey" FOREIGN KEY ("engineer_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inspection_assignments" ADD CONSTRAINT "inspection_assignments_assigned_by_id_fkey" FOREIGN KEY ("assigned_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inspection_reports" ADD CONSTRAINT "inspection_reports_assignment_id_fkey" FOREIGN KEY ("assignment_id") REFERENCES "inspection_assignments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_properties" ADD CONSTRAINT "saved_properties_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_properties" ADD CONSTRAINT "saved_properties_auction_id_fkey" FOREIGN KEY ("auction_id") REFERENCES "auction_notices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "property_unlocks" ADD CONSTRAINT "property_unlocks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "property_unlocks" ADD CONSTRAINT "property_unlocks_auction_id_fkey" FOREIGN KEY ("auction_id") REFERENCES "auction_notices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analytics_events" ADD CONSTRAINT "analytics_events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notice_extractions" ADD CONSTRAINT "notice_extractions_auctionId_fkey" FOREIGN KEY ("auctionId") REFERENCES "auction_notices"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "support_requests" ADD CONSTRAINT "support_requests_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "support_requests" ADD CONSTRAINT "support_requests_auctionId_fkey" FOREIGN KEY ("auctionId") REFERENCES "auction_notices"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "support_messages" ADD CONSTRAINT "support_messages_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "support_requests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plan_recommendations" ADD CONSTRAINT "plan_recommendations_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_deliveries" ADD CONSTRAINT "email_deliveries_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "support_requests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

