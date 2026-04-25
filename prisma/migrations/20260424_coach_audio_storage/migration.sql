-- Supabase Storage bucket for coaching audio files (private)
-- The bucket is used by post-session-upload to store raw .m4a/.mp3 files
-- before transcription. Files can be linked back via CoachingSession.uploadedFilePath.

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'coaching-audio',
  'coaching-audio',
  false,
  26214400, -- 25 MB (Whisper limit)
  ARRAY['audio/mpeg', 'audio/mp4', 'audio/x-m4a', 'audio/wav', 'audio/webm', 'audio/ogg', 'video/mp4', 'application/octet-stream']
)
ON CONFLICT (id) DO UPDATE SET
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- RLS policies: only the student (owner) and staff (admins/instructors) can read.
-- Only staff can upload.

-- Drop existing policies if re-running
DROP POLICY IF EXISTS "coaching-audio-staff-upload" ON storage.objects;
DROP POLICY IF EXISTS "coaching-audio-staff-read" ON storage.objects;
DROP POLICY IF EXISTS "coaching-audio-owner-read" ON storage.objects;

-- Staff (ADMIN or INSTRUCTOR) can upload
CREATE POLICY "coaching-audio-staff-upload" ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'coaching-audio'
  AND auth.uid() IS NOT NULL
  AND EXISTS (
    SELECT 1 FROM "User" u
    WHERE u."supabaseId" = auth.uid()::text
    AND u.role IN ('ADMIN', 'INSTRUCTOR')
  )
);

-- Staff can read everything
CREATE POLICY "coaching-audio-staff-read" ON storage.objects
FOR SELECT
USING (
  bucket_id = 'coaching-audio'
  AND auth.uid() IS NOT NULL
  AND EXISTS (
    SELECT 1 FROM "User" u
    WHERE u."supabaseId" = auth.uid()::text
    AND u.role IN ('ADMIN', 'INSTRUCTOR')
  )
);

-- Students can read their own audio (path format: <studentSupabaseId>/<sessionId>/<filename>)
CREATE POLICY "coaching-audio-owner-read" ON storage.objects
FOR SELECT
USING (
  bucket_id = 'coaching-audio'
  AND auth.uid() IS NOT NULL
  AND (storage.foldername(name))[1] = auth.uid()::text
);
