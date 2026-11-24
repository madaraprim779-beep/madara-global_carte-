
const API_BASE = "/api";

export interface CreatePaymentRequest {
  amount: number;
  currency: string;
  countryCode: string;
  paymentMethod: string;
}

export interface PaymentResponse {
  paymentId: string;
  status: "pending";
  checkoutUrl: string;
}

export interface PaymentStatus {
  paymentId: string;
  status: "pending" | "processing" | "succeeded" | "failed";
  amount: number;
  currency: string;
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.error || `Erreur du serveur (${response.status})`
    );
  }

  return data as T;
}

export async function createPayment(
  payload: CreatePaymentRequest
): Promise<PaymentResponse> {
  if (!Number.isFinite(payload.amount) || payload.amount <= 0) {
    throw new Error("Montant invalide.");
  }

  if (!/^[A-Z]{3}$/.test(payload.currency)) {
    throw new Error("Devise invalide.");
  }

  if (!/^[A-Z]{2}$/.test(payload.countryCode)) {
    throw new Error("Code pays invalide.");
  }

  if (!payload.paymentMethod.trim()) {
    throw new Error("Moyen de paiement manquant.");
  }

  const result = await request<PaymentResponse>(
    "/payments/create",
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );

  if (
    !result.paymentId ||
    result.status !== "pending" ||
    !result.checkoutUrl
  ) {
    throw new Error("Réponse de paiement invalide.");
  }

  const checkout = new URL(result.checkoutUrl);

  if (checkout.protocol !== "https:") {
    throw new Error("Adresse de paiement non sécurisée.");
  }

  window.location.assign(checkout.toString());

  return result;
}

export async function getPaymentStatus(
  paymentId: string
): Promise<PaymentStatus> {
  if (!/^[a-zA-Z0-9_-]{1,128}$/.test(paymentId)) {
    throw new Error("Identifiant de paiement invalide.");
  }

  return request<PaymentStatus>(
    `/payments/${encodeURIComponent(paymentId)}`
  );
}
