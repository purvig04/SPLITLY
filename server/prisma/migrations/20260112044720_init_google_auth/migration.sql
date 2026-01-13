/*
  Warnings:

  - You are about to drop the column `password` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[google_sub]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `google_sub` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "password",
ADD COLUMN     "google_sub" TEXT NOT NULL,
ALTER COLUMN "phone_no" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users_google_sub_key" ON "users"("google_sub");
