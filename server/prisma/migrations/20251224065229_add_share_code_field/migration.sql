/*
  Warnings:

  - A unique constraint covering the columns `[share_code]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "share_code" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "users_share_code_key" ON "users"("share_code");
