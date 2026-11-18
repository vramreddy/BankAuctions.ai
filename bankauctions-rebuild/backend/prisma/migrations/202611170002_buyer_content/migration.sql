CREATE TABLE "buyer_content" (
 "slug" TEXT NOT NULL,
 "draft" JSONB NOT NULL DEFAULT '{}',
 "published" JSONB,
 "version" INTEGER NOT NULL DEFAULT 0,
 "publishedAt" TIMESTAMP(3),
 "updatedById" TEXT,
 "updatedAt" TIMESTAMP(3) NOT NULL,
 CONSTRAINT "buyer_content_pkey" PRIMARY KEY ("slug")
);
