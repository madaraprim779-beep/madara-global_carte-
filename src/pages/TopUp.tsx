
import { useState } from "react";
import {
  ArrowDownToLine,
  Globe,
  ShieldCheck,
  CreditCard,
} from "lucide-react";

const countries = [
  {
    code: "CI",
    name: "Côte d'Ivoire",
    currency: "XOF",
    methods: ["Wave", "Orange Money", "MTN MoMo"],
  },
  {
    code: "SN",
    name: "Sénégal",
    currency: "XOF",
    methods: ["Wave", "Orange Money"],
  },
  {
    code: "KE",
    name: "Kenya",
    currency: "KES",
    methods: ["M-Pesa"],
  },
  {
    code: "BR",
    name: "Brésil",
    currency: "BRL",
    methods: ["Pix"],
  },
  {
    code: "IN",
    name: "Inde",
    currency: "INR",
    methods: ["UPI"],
  },
];

export default function TopUp() {
  const [countryCode, setCountryCode] = useState("CI");
  const [method, setMethod] = useState("");
  const [amount, setAmount] = useState("");

  const country = countries.find(
    (item) => item.code === countryCode
  )!;

  const validAmount =
    amount.trim() !== "" &&
    Number.isFinite(Number(amount)) &&
    Number(amount) > 0;

  function handleContinue() {
    if (!validAmount) {
      alert("Veuillez saisir un montant valide.");
      return;
    }

    if (!method) {
      alert("Veuillez choisir un moyen de paiement.");
      return;
    }

    alert(
      "Le prestataire de paiement doit être configuré et autorisé avant de pouvoir effectuer ce rechargement."
    );
  }

  return (
    <main className="page-container">
      <section className="page-heading">
        <span className="eyebrow">MADARA GLOBAL</span>
        <h1>Recharger mon portefeuille</h1>
        <p>
          Choisissez votre pays et votre moyen de paiement.
        </p>
      </section>

      <section className="panel">
        <div className="field-group">
          <label htmlFor="topup-country">
            <Globe size={17} /> Pays
          </label>

          <select
            id="topup-country"
            value={countryCode}
            onChange={(event) => {
              setCountryCode(event.target.value);
              setMethod("");
            }}
          >
            {countries.map((item) => (
              <option key={item.code} value={item.code}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        <div className="field-group">
          <label htmlFor="topup-amount">
            Montant ({country.currency})
          </label>

          <input
            id="topup-amount"
            type="number"
            min="1"
            step="1"
            placeholder="Saisir le montant"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
          />
        </div>

        <div className="field-group">
          <label>
            <CreditCard size={17} /> Moyen de paiement
          </label>

          <div className="payment-methods">
            {country.methods.map((item) => (
              <button
                key={item}
                type="button"
                className={
                  method === item
                    ? "payment-option selected"
                    : "payment-option"
                }
                onClick={() => setMethod(item)}
                aria-pressed={method === item}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={handleContinue}
          disabled={!validAmount || !method}
        >
          <ArrowDownToLine size={18} />
          Continuer
        </button>

        <p className="demo-notice">
          <ShieldCheck size={17} />
          Paiement indisponible tant que le prestataire
          agréé n'est pas connecté.
        </p>
      </section>
    </main>
  );
}
