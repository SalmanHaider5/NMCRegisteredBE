-- CreateTable
CREATE TABLE "JobLog" (
    "id" SERIAL NOT NULL,
    "jobName" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "processed" INTEGER,
    "error" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),

    CONSTRAINT "JobLog_pkey" PRIMARY KEY ("id")
);
