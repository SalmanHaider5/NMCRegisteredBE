-- DropForeignKey
ALTER TABLE "TimesheetEntries" DROP CONSTRAINT "TimesheetEntries_shiftId_fkey";

-- AlterTable
ALTER TABLE "TimesheetEntries" ALTER COLUMN "shiftId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "TimesheetEntries" ADD CONSTRAINT "TimesheetEntries_shiftId_fkey" FOREIGN KEY ("shiftId") REFERENCES "Shift"("id") ON DELETE SET NULL ON UPDATE CASCADE;
