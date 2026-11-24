
export type TransactionDirection = "credit" | "debit";

export type TransactionStatus =
  | "pending"
  | "succeeded"
  | "failed";

export type TransactionType =
  | "top_up"
  | "payment"
  | "refund"
  | "transfer";

export interface Transaction {
  id: string;
  type: TransactionType;
  direction: TransactionDirection;
  description: string;
  amount: number;
  currency: string;
  status: TransactionStatus;
  createdAt: string;
  reference?: string;
}

export interface TransactionsResponse {
  items: Transaction[];
  page: number;
  totalPages: number;
}

interface GetTransactionsOptions {
  page?: number;
  limit?: number;
}

const API_BASE = (
  import.meta.env.VITE_API_URL || ""
).replace(/\/$/, "");

function isValidTransaction(value: unknown): value is Transaction {
  if (!value || typeof value !== "object") {
    return false;
  }

  const item = value as Record<string, unknown>;

  return (
    typeof item.id === "string" &&
    item.id.length > 0 &&
    ["top_up", "payment", "refund", "transfer"].includes(
      String(item.type)
    ) &&
    ["credit", "debit"].includes(String(item.direction)) &&
    typeof item.description === "string" &&
    typeof item.amount === "number" &&
    Number.isFinite(item.amount) &&
    item.amount >= 0 &&
    typeof item.currency === "string" &&
    /^[A-Z]{3}$/.test(item.currency) &&
    ["pending", "succeeded", "failed"].includes(
      String(item.status)
    ) &&
    typeof item.createdAt === "string" &&
    !Number.isNaN(Date.parse(item.createdAt)) &&
    (item.reference === undefined ||
      typeof item.reference === "string")
  );
}

export async function getTransactions(
  options: GetTransactionsOptions = {}
): Promise<TransactionsResponse> {
  const page = options.page ?? 1;
  const limit = options.limit ?? 50;

  if (
    !Number.isInteger(page) ||
    page < 1 ||
    !Number.isInteger(limit) ||
    limit < 1 ||
    limit > 100
  ) {
    throw new Error("Paramètres de pagination invalides.");
  }

  const response = await fetch(
    `${API_BASE}/api/transactions?page=${page}&limit=${limit}`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
    }
  );

  if (response.status === 401) {
    throw new Error("Connecte-toi pour consulter tes transactions.");
  }

  if (!response.ok) {
    throw new Error("Le serveur n'a pas pu charger les transactions.");
  }

  const data: unknown = await response.json();

  if (!data || typeof data !== "object") {
    throw new Error("Réponse invalide du serveur.");
  }

  const result = data as Record<string, unknown>;

  if (
    !Array.isArray(result.items) ||
    !result.items.every(isValidTransaction) ||
    typeof result.page !== "number" ||
    typeof result.totalPages !== "number" ||
    !Number.isInteger(result.page) ||
    !Number.isInteger(result.totalPages) ||
    result.page < 1 ||
    result.totalPages < 0
  ) {
    throw new Error("Format des transactions invalide.");
  }

  return {
    items: result.items,
    page: result.page,
    totalPages: result.totalPages,
  };
}
