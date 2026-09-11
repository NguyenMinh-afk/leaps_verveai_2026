-- CreateEnum
CREATE TYPE "sync"."device_type" AS ENUM ('ANDROID', 'WINDOWS', 'TABLET');

-- CreateEnum
CREATE TYPE "sync"."sync_direction" AS ENUM ('PUSH', 'PULL');

-- CreateEnum
CREATE TYPE "sync"."sync_status" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "sync"."conflict_resolution" AS ENUM ('SERVER_WINS', 'CLIENT_WINS', 'MERGED');

-- CreateEnum
CREATE TYPE "sync"."transfer_status" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "sync"."devices" (
    "id" TEXT NOT NULL,
    "type" "sync"."device_type" NOT NULL,
    "name" TEXT NOT NULL,
    "last_seen_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "devices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sync"."sync_logs" (
    "id" TEXT NOT NULL,
    "device_id" TEXT NOT NULL,
    "direction" "sync"."sync_direction" NOT NULL,
    "status" "sync"."sync_status" NOT NULL DEFAULT 'PENDING',
    "record_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),
    "error_message" TEXT,

    CONSTRAINT "sync_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sync"."sync_conflicts" (
    "id" TEXT NOT NULL,
    "device_id" TEXT NOT NULL,
    "entity_type" TEXT NOT NULL,
    "entity_id" TEXT NOT NULL,
    "server_version" TEXT NOT NULL,
    "client_version" TEXT NOT NULL,
    "resolved_at" TIMESTAMP(3),
    "resolution" "sync"."conflict_resolution",
    "detected_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sync_conflicts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sync"."student_transfers" (
    "id" TEXT NOT NULL,
    "from_device_id" TEXT NOT NULL,
    "to_device_id" TEXT NOT NULL,
    "status" "sync"."transfer_status" NOT NULL DEFAULT 'PENDING',
    "transferred_at" TIMESTAMP(3),
    "failed_at" TIMESTAMP(3),
    "error_reason" TEXT,
    "student_ids" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "student_transfers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "sync_conflicts_device_id_idx" ON "sync"."sync_conflicts"("device_id");

-- CreateIndex
CREATE INDEX "sync_conflicts_resolved_at_idx" ON "sync"."sync_conflicts"("resolved_at");

-- CreateIndex
CREATE INDEX "sync_conflicts_entity_type_entity_id_idx" ON "sync"."sync_conflicts"("entity_type", "entity_id");

-- CreateIndex
CREATE INDEX "student_transfers_from_device_id_idx" ON "sync"."student_transfers"("from_device_id");

-- CreateIndex
CREATE INDEX "student_transfers_to_device_id_idx" ON "sync"."student_transfers"("to_device_id");

-- AddForeignKey
ALTER TABLE "sync"."sync_logs" ADD CONSTRAINT "sync_logs_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "sync"."devices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sync"."sync_conflicts" ADD CONSTRAINT "sync_conflicts_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "sync"."devices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
