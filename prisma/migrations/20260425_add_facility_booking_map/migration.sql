-- CreateTable
CREATE TABLE "FacilityBooking" (
    "id" TEXT NOT NULL,
    "facility" TEXT NOT NULL,
    "person" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FacilityBooking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FacilityBooking_facility_idx" ON "FacilityBooking"("facility");

-- CreateIndex
CREATE INDEX "FacilityBooking_date_idx" ON "FacilityBooking"("date");

-- CreateIndex
CREATE INDEX "FacilityBooking_userId_idx" ON "FacilityBooking"("userId");
