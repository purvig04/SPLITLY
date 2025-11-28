/*
  Warnings:

  - Added the required column `cycleId` to the `expense` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cycleId` to the `settlement` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "expense" ADD COLUMN     "cycleId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "groups" ADD COLUMN     "currentCycleId" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "settlement" ADD COLUMN     "cycleId" INTEGER NOT NULL;
