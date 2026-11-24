
const API_BASE = "/api/cards";

export type CardStatus = "active" | "blocked" | "pending";

export interface VirtualCard {
  id: string;
  brand: string;
  lastFour: string;
  holderName: string;
  currency: string;
  status: CardStatus;
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.error || `Erreur serveur : ${response.status}`
    );
  }

  return data as T;
}

function validateCard(card: VirtualCard): VirtualCard {
  if (
    !card ||
    typeof card.id !== "string" ||
    typeof card.brand !== "string" ||
    typeof card.lastFour !== "string" ||
    !/^\d{4}$/.test(card.lastFour) ||
    typeof card.holderName !== "string" ||
    typeof card.currency !== "string" ||
    !["active", "blocked", "pending"].includes(card.status)
  ) {
    throw new Error("Données de carte invalides.");
  }

  return card;
}

export async function getCards(): Promise<VirtualCard[]> {
  const result = await request<{ cards: VirtualCard[] }>("/");

  if (!Array.isArray(result.cards)) {
    throw new Error("Réponse de cartes invalide.");
  }

  return result.cards.map(validateCard);
}

export async function getCard(
  cardId: string
): Promise<VirtualCard> {
  if (!/^[a-zA-Z0-9_-]{1,128}$/.test(cardId)) {
    throw new Error("Identifiant de carte invalide.");
  }

  const result = await request<{ card: VirtualCard }>(
    `/${encodeURIComponent(cardId)}`
  );

  return validateCard(result.card);
}

export async function blockCard(
  cardId: string
): Promise<void> {
  if (!/^[a-zA-Z0-9_-]{1,128}$/.test(cardId)) {
    throw new Error("Identifiant de carte invalide.");
  }

  await request(`/${encodeURIComponent(cardId)}/block`, {
    method: "POST",
  });
}

export async function unblockCard(
  cardId: string
): Promise<void> {
  if (!/^[a-zA-Z0-9_-]{1,128}$/.test(cardId)) {
    throw new Error("Identifiant de carte invalide.");
  }

  await request(`/${encodeURIComponent(cardId)}/unblock`, {
    method: "POST",
  });
}
