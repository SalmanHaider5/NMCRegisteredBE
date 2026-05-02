/*
  Warnings:

  - You are about to drop the `SingleTimesheet` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `accountNumber` on table `BankDetails` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "SingleTimesheet" DROP CONSTRAINT "SingleTimesheet_timesheetId_fkey";

-- DropIndex
DROP INDEX "Phone_code_key";

-- AlterTable
ALTER TABLE "BankDetails" ALTER COLUMN "accountNumber" SET NOT NULL;

-- AlterTable
ALTER TABLE "Phone" ALTER COLUMN "code" DROP NOT NULL;

-- DropTable
DROP TABLE "SingleTimesheet";

-- CreateTable
CREATE TABLE "TimesheetEntries" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3),
    "shift" TEXT,
    "time" TEXT,
    "status" BOOLEAN NOT NULL DEFAULT false,
    "timesheetId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TimesheetEntries_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TimesheetEntries" ADD CONSTRAINT "TimesheetEntries_timesheetId_fkey" FOREIGN KEY ("timesheetId") REFERENCES "Timesheet"("id") ON DELETE CASCADE ON UPDATE CASCADE;
