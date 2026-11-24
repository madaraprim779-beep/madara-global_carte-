
import {
  CreditCard,
  ShieldCheck,
  LockKeyhole,
} from "lucide-react";

export interface VirtualCardData {
  id: string;
  brand: string;
  lastFour: string;
  holderName: string;
  currency: string;
  status: "active" | "blocked" | "pending";
}

interface VirtualCardProps {
  card: VirtualCardData;
  onBlock?: (cardId: string) => void;
  onUnblock?: (cardId: string) => void;
  actionLoading?: boolean;
}

export default function VirtualCard({
  card,
  onBlock,
  onUnblock,
  actionLoading = false,
}: VirtualCardProps) {
  const statusLabels = {
    active: "Active",
    blocked: "Bloquée",
    pending: "En attente",
  };

  const canManage =
    card.status === "active" || card.status === "blocked";

  return (
    <article className="virtual-card">
      <div className="row-between">
        <span className="card-brand">{card.brand}</span>
        <CreditCard size={26} />
      </div>

      <div className="card-number">
        •••• •••• •••• {card.lastFour}
      </div>

      <div className="row-between">
        <div>
          <small>TITULAIRE</small>
          <p>{card.holderName}</p>
        </div>

        <div>
          <small>DEVISE</small>
          <p>{card.currency}</p>
        </div>
      </div>

      <div className="row-between">
        <span className={`card-status ${card.status}`}>
          {statusLabels[card.status]}
        </span>

        <ShieldCheck size={19} />
      </div>

      {canManage && (
        <button
          type="button"
          className="secondary-button"
          disabled={actionLoading}
          onClick={() => {
            if (card.status === "active") {
              onBlock?.(card.id);
            } else {
              onUnblock?.(card.id);
            }
          }}
        >
          <LockKeyhole size={17} />
          {actionLoading
            ? "Traitement..."
            : card.status === "active"
              ? "Demander le blocage"
              : "Demander le déblocage"}
        </button>
      )}

      {card.status === "pending" && (
        <p className="notice">
          La carte attend la confirmation de son émetteur.
        </p>
      )}
    </article>
  );
}
