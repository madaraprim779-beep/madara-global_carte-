
import { CheckCircle2, CreditCard } from "lucide-react";

export interface PaymentMethodOption {
  id: string;
  name: string;
  country: string;
  currency: string;
  providerAvailable: boolean;
}

interface PaymentMethodProps {
  methods: PaymentMethodOption[];
  selected: string;
  onSelect: (methodId: string) => void;
}

export default function PaymentMethod({
  methods,
  selected,
  onSelect,
}: PaymentMethodProps) {
  if (methods.length === 0) {
    return (
      <section className="panel">
        <p>Aucun moyen de paiement disponible pour ce pays.</p>
      </section>
    );
  }

  return (
    <section className="payment-methods" aria-label="Moyens de paiement">
      {methods.map((method) => {
        const isSelected = selected === method.id;

        return (
          <button
            key={method.id}
            type="button"
            className={
              isSelected
                ? "payment-option selected"
                : "payment-option"
            }
            disabled={!method.providerAvailable}
            aria-pressed={isSelected}
            onClick={() => onSelect(method.id)}
          >
            <CreditCard size={20} />

            <span>
              <strong>{method.name}</strong>
              <small>
                {method.providerAvailable
                  ? `${method.country} · ${method.currency}`
                  : "Prestataire non connecté"}
              </small>
            </span>

            {isSelected && <CheckCircle2 size={19} />}
          </button>
        );
      })}
    </section>
  );
}
