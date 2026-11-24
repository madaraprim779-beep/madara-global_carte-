
import { useEffect, useMemo, useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Clock,
  RefreshCw,
  ReceiptText,
  Search,
} from "lucide-react";
import {
  getTransactions,
  type Transaction,
} from "../services/transactions";
import TransactionItem from "../components/TransactionItem";

type Filter = "all" | "credit" | "debit";

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadTransactions() {
    setLoading(true);
    setError("");

    try {
      const result = await getTransactions({ page: 1, limit: 50 });
      setTransactions(result.items);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Impossible de charger les transactions."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadTransactions();
  }, []);

  const filteredTransactions = useMemo(() => {
    const term = search.trim().toLowerCase();

    return transactions.filter((transaction) => {
      const matchesFilter =
        filter === "all" || transaction.direction === filter;

      const matchesSearch =
        !term ||
        transaction.description.toLowerCase().includes(term) ||
        transaction.reference?.toLowerCase().includes(term);

      return matchesFilter && matchesSearch;
    });
  }, [transactions, filter, search]);

  return (
    <main className="transactions-page">
      <header className="page-header">
        <div>
          <span className="page-eyebrow">MADARA GLOBAL</span>
          <h1>Transactions</h1>
          <p>Consulte l'historique de tes opérations.</p>
        </div>

        <button
          type="button"
          className="icon-button"
          onClick={() => void loadTransactions()}
          disabled={loading}
          aria-label="Actualiser les transactions"
        >
          <RefreshCw size={19} />
        </button>
      </header>

      <section className="transaction-summary">
        <div>
          <ReceiptText size={22} />
          <span>Opérations affichées</span>
          <strong>{filteredTransactions.length}</strong>
        </div>
        <div>
          <Clock size={22} />
          <span>Historique</span>
          <strong>En temps réel selon le serveur</strong>
        </div>
      </section>

      <section className="transaction-controls">
        <label className="transaction-search">
          <Search size={18} />
          <input
            type="search"
            placeholder="Rechercher une opération..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>

        <div className="transaction-filters">
          <button
            type="button"
            className={filter === "all" ? "active" : ""}
            onClick={() => setFilter("all")}
          >
            Toutes
          </button>
          <button
            type="button"
            className={filter === "credit" ? "active" : ""}
            onClick={() => setFilter("credit")}
          >
            <ArrowDownLeft size={15} />
            Entrées
          </button>
          <button
            type="button"
            className={filter === "debit" ? "active" : ""}
            onClick={() => setFilter("debit")}
          >
            <ArrowUpRight size={15} />
            Sorties
          </button>
        </div>
      </section>

      <section className="transaction-list">
        {loading ? (
          <p className="transaction-message">Chargement de l'historique...</p>
        ) : error ? (
          <div className="transaction-error">
            <p>{error}</p>
            <button type="button" onClick={() => void loadTransactions()}>
              Réessayer
            </button>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="transaction-empty">
            <ReceiptText size={34} />
            <h2>Aucune transaction</h2>
            <p>
              Les opérations confirmées par le serveur apparaîtront ici.
            </p>
          </div>
        ) : (
          filteredTransactions.map((transaction) => (
            <TransactionItem
              key={transaction.id}
              transaction={transaction}
            />
          ))
        )}
      </section>
    </main>
  );
}
