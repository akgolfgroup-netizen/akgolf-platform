const WHISPER_URL = "https://api.openai.com/v1/audio/transcriptions";
const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB (Whisper limit)

export interface TranscriptionResult {
  text: string;
}

export async function transcribeAudio(file: File): Promise<TranscriptionResult> {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(
      `Filen er for stor (${(file.size / 1024 / 1024).toFixed(1)} MB). Maks 25 MB.`
    );
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY er ikke konfigurert");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("model", "whisper-1");
  formData.append("language", "no");
  formData.append("response_format", "text");

  const response = await fetch(WHISPER_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}` },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Transkribering feilet: ${error}`);
  }

  const text = await response.text();
  return { text: text.trim() };
}
