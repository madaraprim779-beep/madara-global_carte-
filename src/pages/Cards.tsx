
import { useEffect, useState } from "react";
import {
  CreditCard,
  RefreshCw,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";

interface VirtualCard {
  id: string;
  brand: string;
  lastFour: string;
  currency: string;
  status: "active" | "blocked" | "pending";
  holderName: string;
}

export default function Cards() {
  const [cards, setCards] = useState<VirtualCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadCards() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/cards", {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      });

      if (response.status === 401) {
        throw new Error("Connectez-vous pour consulter vos cartes.");
      }

      if (!response.ok) {
        throw new Error("Impossible de récupérer vos cartes.");
      }

      const data: unknown = await response.json();

      if (
        typeof data !== "object" ||
        data === null ||
        !("cards" in data) ||
        !Array.isArray(data.cards)
      ) {
        throw new Error("Réponse du serveur invalide.");
      }

      const validCards = data.cards.filter(
        (card: unknown): card is VirtualCard => {
          if (typeof card !== "object" || card === null) {
            return false;
          }

          const item = card as Record<string, unknown>;

          return (
            typeof item.id === "string" &&
            typeof item.brand === "string" &&
            typeof item.lastFour === "string" &&
            /^\d{4}$/.test(item.lastFour) &&
            typeof item.currency === "string" &&
            typeof item.holderName === "string" &&
            ["active", "blocked", "pending"].includes(
              String(item.status)
            )
          );
        }
      );

      setCards(validCards);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Une erreur est survenue."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadCards();
  }, []);

  function statusLabel(status: VirtualCard["status"]) {
    switch (status) {
      case "active":
        return "Active";
      case "blocked":
        return "Bloquée";
      case "pending":
        return "En attente";
    }
  }

  return (
    <main className="page-container">
      <section className="page-heading">
        <span className="eyebrow">MADARA GLOBAL</span>
        <h1>Mes cartes</h1>
        <p>Consultez les cartes associées à votre compte.</p>
      </section>

      <section className="panel">
        <div className="row-between">
          <h2>Cartes virtuelles</h2>

          <button
            type="button"
            className="icon-button"
            onClick={() => void loadCards()}
            disabled={loading}
            aria-label="Actualiser les cartes"
          >
            <RefreshCw size={18} />
          </button>
        </div>

        {loading && <p>Chargement des cartes...</p>}

        {!loading && error && (
          <div role="alert" className="error-message">
            <AlertCircle size={18} />
            <span>{error}</span>
            <button type="button" onClick={() => void loadCards()}>
              Réessayer
            </button>
          </div>
        )}

        {!loading && !error && cards.length === 0 && (
          <div className="empty-state">
            <CreditCard size={36} />
            <h3>Aucune carte disponible</h3>
            <p>
              Aucune carte émise par un partenaire autorisé
              n'est associée à ce compte.
            </p>
          </div>
        )}

        {!loading && !error && cards.length > 0 && (
          <div className="cards-list">
            {cards.map((card) => (
              <article className="virtual-card" key={card.id}>
                <div className="row-between">
                  <span>{card.brand}</span>
                  <CreditCard size={24} />
                </div>

                <h3>•••• •••• •••• {card.lastFour}</h3>

                <div className="row-between">
                  <span>{card.holderName}</span>
                  <span>{card.currency}</span>
                </div>

                <p className={`card-status ${card.status}`}>
                  {statusLabel(card.status)}
                </p>
              </article>
            ))}
          </div>
        )}

        <p className="demo-notice">
          <ShieldCheck size={17} />
          Les cartes sont fournies uniquement par un émetteur
          financier autorisé. Les données sensibles ne sont
          jamais affichées ici.
        </p>
      </section>
    </main>
  );
}
