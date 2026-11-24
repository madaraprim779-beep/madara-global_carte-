
export interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  email: string | null;
  country: string | null;
  currency: string | null;
  createdAt: string;
}

const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

async function profileRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      Accept: "application/json",
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });

  if (response.status === 401) {
    throw new Error("Session expirée. Reconnecte-toi.");
  }

  if (!response.ok) {
    throw new Error("Impossible de communiquer avec le serveur.");
  }

  return response.json() as Promise<T>;
}

function validateProfile(value: unknown): UserProfile {
  if (!value || typeof value !== "object") {
    throw new Error("Données du profil invalides.");
  }

  const item = value as Record<string, unknown>;

  if (
    typeof item.id !== "string" ||
    typeof item.username !== "string" ||
    typeof item.displayName !== "string"
  ) {
    throw new Error("Format du profil invalide.");
  }

  return {
    id: item.id,
    username: item.username,
    displayName: item.displayName,
    email: typeof item.email === "string" ? item.email : null,
    country: typeof item.country === "string" ? item.country : null,
    currency: typeof item.currency === "string" ? item.currency : null,
    createdAt: typeof item.createdAt === "string" ? item.createdAt : "",
  };
}

export async function getProfile(): Promise<UserProfile> {
  const result = await profileRequest<{ user: unknown }>("/api/users/me");

  return validateProfile(result.user);
}

export async function updateProfile(
  changes: { displayName: string }
): Promise<UserProfile> {
  const displayName = changes.displayName.trim();

  if (displayName.length < 2 || displayName.length > 40) {
    throw new Error("Le nom doit contenir entre 2 et 40 caractères.");
  }

  const result = await profileRequest<{ user: unknown }>("/api/users/me", {
    method: "PATCH",
    body: JSON.stringify({ displayName }),
  });

  return validateProfile(result.user);
}
