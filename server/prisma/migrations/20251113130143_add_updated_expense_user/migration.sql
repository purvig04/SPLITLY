-- AlterTable
ALTER TABLE "expense" ADD COLUMN     "updated_by" TEXT;

-- AddForeignKey
ALTER TABLE "expense" ADD CONSTRAINT "expense_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
