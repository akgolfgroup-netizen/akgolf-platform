CREATE OR REPLACE FUNCTION create_booking_atomic(
  p_id TEXT,
  p_student_id TEXT,
  p_instructor_id TEXT,
  p_service_type_id TEXT,
  p_start_time TIMESTAMPTZ,
  p_end_time TIMESTAMPTZ,
  p_payment_method TEXT DEFAULT 'STRIPE',
  p_payment_status TEXT DEFAULT 'PENDING',
  p_amount INT DEFAULT 0,
  p_vat_amount INT DEFAULT 0
)
RETURNS JSON
LANGUAGE plpgsql
AS $$
DECLARE
  v_conflict_id TEXT;
  v_blocked_id TEXT;
BEGIN
  -- Lock existing bookings for this instructor in the time range
  SELECT id INTO v_conflict_id
  FROM "Booking"
  WHERE "instructorId" = p_instructor_id
    AND status IN ('PENDING', 'CONFIRMED')
    AND "startTime" < p_end_time
    AND "endTime" > p_start_time
  FOR UPDATE
  LIMIT 1;

  IF v_conflict_id IS NOT NULL THEN
    RETURN json_build_object(
      'success', false,
      'error', 'TIME_SLOT_CONFLICT',
      'message', 'Tidspunktet er allerede booket'
    );
  END IF;

  -- Check blocked times
  SELECT id INTO v_blocked_id
  FROM "BlockedTime"
  WHERE ("instructorId" = p_instructor_id OR "instructorId" IS NULL)
    AND "startTime" < p_end_time
    AND "endTime" > p_start_time
  LIMIT 1;

  IF v_blocked_id IS NOT NULL THEN
    RETURN json_build_object(
      'success', false,
      'error', 'BLOCKED_TIME_CONFLICT',
      'message', 'Tidspunktet er ikke tilgjengelig'
    );
  END IF;

  -- No conflict — insert booking
  INSERT INTO "Booking" (
    id, "studentId", "instructorId", "serviceTypeId",
    "startTime", "endTime", status,
    "paymentMethod", "paymentStatus",
    amount, "vatAmount", "updatedAt"
  ) VALUES (
    p_id, p_student_id, p_instructor_id, p_service_type_id,
    p_start_time, p_end_time, 'PENDING'::"BookingStatus",
    p_payment_method::"PaymentMethod", p_payment_status::"PaymentStatus",
    p_amount, p_vat_amount, NOW()
  );

  RETURN json_build_object(
    'success', true,
    'bookingId', p_id
  );
END;
$$;
