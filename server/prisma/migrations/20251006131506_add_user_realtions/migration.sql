/*
  Warnings:

  - You are about to drop the column `createdBy` on the `groups` table. All the data in the column will be lost.
  - Added the required column `createdById` to the `groups` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."groups" DROP COLUMN "createdBy",
ADD COLUMN     "createdById" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."users" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "public"."groups" ADD CONSTRAINT "groups_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."group_members" ADD CONSTRAINT "group_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
