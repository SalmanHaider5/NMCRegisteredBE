/*
  Warnings:

  - You are about to drop the column `shift` on the `TimesheetEntries` table. All the data in the column will be lost.
  - You are about to drop the column `time` on the `TimesheetEntries` table. All the data in the column will be lost.
  - Added the required column `shiftId` to the `TimesheetEntries` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TimesheetEntries" DROP COLUMN "shift",
DROP COLUMN "time",
ADD COLUMN     "shiftId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Shift" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Shift_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Shift_key_key" ON "Shift"("key");

-- AddForeignKey
ALTER TABLE "TimesheetEntries" ADD CONSTRAINT "TimesheetEntries_shiftId_fkey" FOREIGN KEY ("shiftId") REFERENCES "Shift"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
