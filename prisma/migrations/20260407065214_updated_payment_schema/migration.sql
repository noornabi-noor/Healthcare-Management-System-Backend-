/*
  Warnings:

  - The primary key for the `doctor_schedules` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `schduleId` on the `doctor_schedules` table. All the data in the column will be lost.
  - You are about to drop the column `paymentGateWayData` on the `payments` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[stripeEventId]` on the table `payments` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `scheduleId` to the `doctor_schedules` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `transactionId` on the `payments` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "doctor_schedules" DROP CONSTRAINT "doctor_schedules_schduleId_fkey";

-- DropIndex
DROP INDEX "doctor_schedules_schduleId_idx";

-- AlterTable
ALTER TABLE "doctor_schedules" DROP CONSTRAINT "doctor_schedules_pkey",
DROP COLUMN "schduleId",
ADD COLUMN     "scheduleId" TEXT NOT NULL,
ADD CONSTRAINT "doctor_schedules_pkey" PRIMARY KEY ("doctorId", "scheduleId");

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "paymentGateWayData",
ADD COLUMN     "paymentGatewayData" JSONB,
ADD COLUMN     "stripeEventId" TEXT,
DROP COLUMN "transactionId",
ADD COLUMN     "transactionId" UUID NOT NULL;

-- CreateIndex
CREATE INDEX "doctor_schedules_scheduleId_idx" ON "doctor_schedules"("scheduleId");

-- CreateIndex
CREATE UNIQUE INDEX "payments_transactionId_key" ON "payments"("transactionId");

-- CreateIndex
CREATE UNIQUE INDEX "payments_stripeEventId_key" ON "payments"("stripeEventId");

-- CreateIndex
CREATE INDEX "payments_transactionId_idx" ON "payments"("transactionId");

-- AddForeignKey
ALTER TABLE "doctor_schedules" ADD CONSTRAINT "doctor_schedules_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "schedules"("id") ON DELETE CASCADE ON UPDATE CASCADE;
