// Vipps eCommerce API v2 — native fetch, no SDK
// Env vars: VIPPS_CLIENT_ID, VIPPS_CLIENT_SECRET, VIPPS_SUBSCRIPTION_KEY,
//           VIPPS_MERCHANT_SERIAL_NUMBER, VIPPS_IS_TEST

interface VippsTokenResponse {
  access_token: string;
  expires_in: string; // seconds as string
  token_type: string;
}

interface VippsPaymentResponse {
  orderId: string;
  url: string;
}

// Token is cached per serverless instance (not globally shared across instances)
let cachedToken: string | null = null;
let tokenExpiresAt: number = 0;

function getBaseUrl(): string {
  return process.env.VIPPS_IS_TEST === "true"
    ? "https://apitest.vipps.no"
    : "https://api.vipps.no";
}

function getSubscriptionKey(): string {
  const key = process.env.VIPPS_SUBSCRIPTION_KEY;
  if (!key) throw new Error("VIPPS_SUBSCRIPTION_KEY is not configured");
  return key;
}

function getMerchantSerialNumber(): string {
  const msn = process.env.VIPPS_MERCHANT_SERIAL_NUMBER;
  if (!msn) throw new Error("VIPPS_MERCHANT_SERIAL_NUMBER is not configured");
  return msn;
}

export async function getVippsToken(): Promise<string> {
  // Return cached token if still valid (with 60s buffer)
  if (cachedToken && Date.now() < tokenExpiresAt - 60_000) {
    return cachedToken;
  }

  const clientId = process.env.VIPPS_CLIENT_ID;
  const clientSecret = process.env.VIPPS_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("VIPPS_CLIENT_ID or VIPPS_CLIENT_SECRET is not configured");
  }

  const baseUrl = getBaseUrl();
  const subscriptionKey = getSubscriptionKey();

  const res = await fetch(`${baseUrl}/accesstoken/get`, {
    method: "POST",
    headers: {
      "client_id": clientId,
      "client_secret": clientSecret,
      "Ocp-Apim-Subscription-Key": subscriptionKey,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `Vipps token request failed (${res.status}): ${text}`
    );
  }

  const data: VippsTokenResponse = await res.json();
  cachedToken = data.access_token;
  tokenExpiresAt = Date.now() + parseInt(data.expires_in, 10) * 1000;

  return cachedToken;
}

export interface InitiateVippsPaymentParams {
  bookingId: string;
  orderId: string;
  amount: number; // in øre
  description: string;
  callbackUrl: string;
  fallbackUrl: string;
  phoneNumber?: string;
}

export async function initiateVippsPayment(
  params: InitiateVippsPaymentParams
): Promise<{ url: string }> {
  const { orderId, amount, description, callbackUrl, fallbackUrl, phoneNumber } =
    params;

  const token = await getVippsToken();
  const baseUrl = getBaseUrl();
  const subscriptionKey = getSubscriptionKey();
  const merchantSerialNumber = getMerchantSerialNumber();

  const body = {
    merchantInfo: {
      merchantSerialNumber,
      callbackPrefix: callbackUrl,
      fallBack: fallbackUrl,
      isApp: false,
    },
    customerInfo: {
      ...(phoneNumber ? { mobileNumber: phoneNumber } : {}),
    },
    transaction: {
      orderId,
      amount,
      transactionText: description,
    },
  };

  const res = await fetch(`${baseUrl}/ecomm/v2/payments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "Ocp-Apim-Subscription-Key": subscriptionKey,
      "Merchant-Serial-Number": merchantSerialNumber,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `Vipps payment initiation failed (${res.status}): ${text}`
    );
  }

  const data: VippsPaymentResponse = await res.json();
  return { url: data.url };
}

export async function getVippsPaymentDetails(
  orderId: string
): Promise<{ transactionInfo?: { status?: string } }> {
  const token = await getVippsToken();
  const baseUrl = getBaseUrl();
  const msn = getMerchantSerialNumber();
  const subKey = getSubscriptionKey();

  const res = await fetch(`${baseUrl}/ecomm/v2/payments/${orderId}/details`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Ocp-Apim-Subscription-Key": subKey,
      "Merchant-Serial-Number": msn,
    },
  });
  if (!res.ok) {
    throw new Error(`Vipps details fetch failed (${res.status})`);
  }
  return res.json();
}
