/*
  Warnings:

  - Made the column `share_code` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "users" ALTER COLUMN "share_code" SET NOT NULL;
