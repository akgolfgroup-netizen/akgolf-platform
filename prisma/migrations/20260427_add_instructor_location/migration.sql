-- Multi-location per coach (M:N)
CREATE TABLE "InstructorLocation" (
  "id" TEXT PRIMARY KEY,
  "instructorId" TEXT NOT NULL,
  "locationId" TEXT NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT "InstructorLocation_instructor_fk"
    FOREIGN KEY ("instructorId") REFERENCES "Instructor"("id") ON DELETE CASCADE,
  CONSTRAINT "InstructorLocation_location_fk"
    FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE CASCADE
);

CREATE UNIQUE INDEX "InstructorLocation_instructorId_locationId_key"
  ON "InstructorLocation" ("instructorId", "locationId");

CREATE INDEX "InstructorLocation_locationId_idx"
  ON "InstructorLocation" ("locationId");

-- Tjenester per coach × lokasjon (3-veis)
CREATE TABLE "InstructorLocationService" (
  "id" TEXT PRIMARY KEY,
  "instructorId" TEXT NOT NULL,
  "locationId" TEXT NOT NULL,
  "serviceTypeId" TEXT NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT "InstructorLocationService_instructor_fk"
    FOREIGN KEY ("instructorId") REFERENCES "Instructor"("id") ON DELETE CASCADE,
  CONSTRAINT "InstructorLocationService_location_fk"
    FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE CASCADE,
  CONSTRAINT "InstructorLocationService_serviceType_fk"
    FOREIGN KEY ("serviceTypeId") REFERENCES "ServiceType"("id") ON DELETE CASCADE
);

CREATE UNIQUE INDEX "InstructorLocationService_instructor_location_service_key"
  ON "InstructorLocationService" ("instructorId", "locationId", "serviceTypeId");

CREATE INDEX "InstructorLocationService_locationId_serviceTypeId_idx"
  ON "InstructorLocationService" ("locationId", "serviceTypeId");
