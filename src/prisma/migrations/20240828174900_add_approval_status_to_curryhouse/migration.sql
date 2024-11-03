/*
  Warnings:

  - Added the required column `approvalStatus` to the `Curryhouse` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ApprovalStatus" AS ENUM ('UNREVIEWED', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "Curryhouse" ADD COLUMN     "approvalStatus" "ApprovalStatus" NOT NULL;
