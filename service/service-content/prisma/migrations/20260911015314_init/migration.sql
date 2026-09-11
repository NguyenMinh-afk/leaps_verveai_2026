-- CreateEnum
CREATE TYPE "content"."content_type" AS ENUM ('ITEM_QUESTION', 'ITEM_EXPLANATION', 'ITEM_MEDIA');

-- CreateEnum
CREATE TYPE "content"."content_status" AS ENUM ('DRAFT', 'PENDING_REVIEW', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "content"."bundle_status" AS ENUM ('BUILDING', 'BUILT', 'SIGNED', 'PUBLISHED');

-- CreateEnum
CREATE TYPE "content"."review_status" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "content"."content_items" (
    "id" TEXT NOT NULL,
    "type" "content"."content_type" NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "difficulty" INTEGER NOT NULL DEFAULT 1,
    "status" "content"."content_status" NOT NULL DEFAULT 'DRAFT',
    "author_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "content_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content"."bundles" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "version" TEXT NOT NULL DEFAULT '1.0.0',
    "status" "content"."bundle_status" NOT NULL DEFAULT 'BUILDING',
    "content_ids" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "published_at" TIMESTAMP(3),

    CONSTRAINT "bundles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content"."bundle_signatures" (
    "id" TEXT NOT NULL,
    "bundle_id" TEXT NOT NULL,
    "public_key_fingerprint" TEXT NOT NULL,
    "signature" TEXT NOT NULL,
    "signed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bundle_signatures_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content"."reviews" (
    "id" TEXT NOT NULL,
    "content_id" TEXT NOT NULL,
    "reviewer_id" TEXT NOT NULL,
    "status" "content"."review_status" NOT NULL DEFAULT 'PENDING',
    "comment" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "content"."bundle_signatures" ADD CONSTRAINT "bundle_signatures_bundle_id_fkey" FOREIGN KEY ("bundle_id") REFERENCES "content"."bundles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content"."reviews" ADD CONSTRAINT "reviews_content_id_fkey" FOREIGN KEY ("content_id") REFERENCES "content"."content_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
