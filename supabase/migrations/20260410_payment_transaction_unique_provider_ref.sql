-- Prevent duplicate PaymentTransaction rows from webhook + confirm-payment race condition
CREATE UNIQUE INDEX IF NOT EXISTS "PaymentTransaction_providerRef_key"
ON "PaymentTransaction" ("providerRef")
WHERE "providerRef" IS NOT NULL;
