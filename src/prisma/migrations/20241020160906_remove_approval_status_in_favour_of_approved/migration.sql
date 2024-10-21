/*
  Warnings:

  - You are about to drop the column `approvalStatus` on the `Curryhouse` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Curryhouse" DROP COLUMN "approvalStatus",
ADD COLUMN     "approved" BOOLEAN NOT NULL DEFAULT false;
