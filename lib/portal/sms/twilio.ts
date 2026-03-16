let _twilioClient: TwilioClient | null = null;

interface TwilioClient {
  sendSms(to: string, body: string): Promise<{ success: boolean; sid?: string }>;
}

/**
 * Lazy-init Twilio SMS client.
 * Returns null if TWILIO credentials are not configured.
 */
export function getTwilioClient(): TwilioClient | null {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_FROM_NUMBER;

  if (!accountSid || !authToken || !fromNumber) return null;

  if (!_twilioClient) {
    _twilioClient = {
      async sendSms(to: string, body: string) {
        try {
          const res = await fetch(
            `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
            {
              method: "POST",
              headers: {
                Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`,
                "Content-Type": "application/x-www-form-urlencoded",
              },
              body: new URLSearchParams({
                To: to,
                From: fromNumber,
                Body: body,
              }),
            }
          );

          if (!res.ok) {
            const errorBody = await res.text();
            console.error("[Twilio] SMS failed:", res.status, errorBody);
            return { success: false };
          }

          const data = await res.json();
          return { success: true, sid: data.sid };
        } catch (error) {
          console.error("[Twilio] SMS error:", error);
          return { success: false };
        }
      },
    };
  }

  return _twilioClient;
}
