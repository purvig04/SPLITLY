-- DropForeignKey
ALTER TABLE "public"."group_members" DROP CONSTRAINT "group_members_groupId_fkey";

-- AddForeignKey
ALTER TABLE "group_members" ADD CONSTRAINT "group_members_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;
