/*
  Warnings:

  - You are about to drop the column `description` on the `category` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "category" DROP COLUMN "description",
ADD COLUMN     "keywords" TEXT[];

-- CreateIndex
CREATE INDEX "category_keywords_idx" ON "category" USING GIN ("keywords");
