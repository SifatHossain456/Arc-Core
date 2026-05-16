export type PaymentRequest = {
  to: string;
  amount: string;
  token: "USDC" | "EURC";
  note: string;
  label: string;
  createdAt: number;
};

export const encodeRequest = (req: Omit<PaymentRequest, "createdAt">) => {
  const payload = JSON.stringify({ ...req, createdAt: Date.now() });
  if (typeof window !== "undefined") {
    return btoa(unescape(encodeURIComponent(payload)));
  }
  return Buffer.from(payload, "utf-8").toString("base64");
};

export const decodeRequest = (encoded: string): PaymentRequest | null => {
  try {
    const raw =
      typeof window !== "undefined"
        ? decodeURIComponent(escape(atob(encoded)))
        : Buffer.from(encoded, "base64").toString("utf-8");
    return JSON.parse(raw) as PaymentRequest;
  } catch {
    return null;
  }
};

const STORAGE_KEY = "arc-flow:requests:v1";

export const loadRequests = (): Array<PaymentRequest & { encoded: string }> => {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
};

export const saveRequest = (req: PaymentRequest, encoded: string) => {
  if (typeof window === "undefined") return;
  const all = loadRequests();
  const next = [{ ...req, encoded }, ...all].slice(0, 30);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
};
