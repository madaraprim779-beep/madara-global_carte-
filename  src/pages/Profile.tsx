
import { useEffect, useState } from "react";
import {
  UserRound,
  Mail,
  ShieldCheck,
  RefreshCw,
  Save,
} from "lucide-react";

interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  email: string | null;
  country: string | null;
  currency: string | null;
  createdAt: string;
}

export default function Profile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function loadProfile() {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/users/me", {
        method: "GET",
        credentials: "include",
        headers: { Accept: "application/json" },
      });

      if (response.status === 401) {
        throw new Error("Connecte-toi pour consulter ton profil.");
      }

      if (!response.ok) {
        throw new Error("Impossible de charger le profil.");
      }

      const data: unknown = await response.json();

      if (!data || typeof data !== "object") {
        throw new Error("Réponse du serveur invalide.");
      }

      const user = (data as { user?: unknown }).user;

      if (!user || typeof user !== "object") {
        throw new Error("Données du profil indisponibles.");
      }

      const item = user as Record<string, unknown>;

      if (
        typeof item.id !== "string" ||
        typeof item.username !== "string" ||
        typeof item.displayName !== "string"
      ) {
        throw new Error("Format du profil invalide.");
      }

      const result: UserProfile = {
        id: item.id,
        username: item.username,
        displayName: item.displayName,
        email: typeof item.email === "string" ? item.email : null,
        country: typeof item.country === "string" ? item.country : null,
        currency: typeof item.currency === "string" ? item.currency : null,
        createdAt:
          typeof item.createdAt === "string" ? item.createdAt : "",
      };

      setProfile(result);
      setDisplayName(result.displayName);
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
    void loadProfile();
  }, []);

  async function saveProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    const cleanedName = displayName.trim();

    if (cleanedName.length < 2 || cleanedName.length > 40) {
      setError("Le nom doit contenir entre 2 et 40 caractères.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch("/api/users/me", {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ displayName: cleanedName }),
      });

      if (response.status === 401) {
        throw new Error("Ta session a expiré. Reconnecte-toi.");
      }

      if (!response.ok) {
        throw new Error("Le serveur n'a pas pu modifier ton profil.");
      }

      await loadProfile();
      setMessage("Profil mis à jour.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Impossible d'enregistrer les modifications."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <main className="profile-page">Chargement du profil...</main>;
  }

  if (!profile) {
    return (
      <main className="profile-page">
        <p>{error || "Profil indisponible."}</p>
        <button type="button" onClick={() => void loadProfile()}>
          <RefreshCw size={16} /> Réessayer
        </button>
      </main>
    );
  }

  return (
    <main className="profile-page">
      <header className="page-header">
        <div>
          <span className="page-eyebrow">MADARA GLOBAL</span>
          <h1>Mon profil</h1>
          <p>Gère les informations de ton compte.</p>
        </div>

        <div className="profile-avatar">
          <UserRound size={30} />
        </div>
      </header>

      <section className="profile-identity">
        <h2>{profile.displayName}</h2>
        <p>@{profile.username}</p>
        <span>
          <ShieldCheck size={15} />
          Compte connecté
        </span>
      </section>

      <form className="profile-form" onSubmit={saveProfile}>
        <h2>Informations personnelles</h2>

        <label>
          Nom affiché
          <input
            type="text"
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
            minLength={2}
            maxLength={40}
            required
          />
        </label>

        <label>
          Nom d'utilisateur
          <input type="text" value={profile.username} readOnly />
        </label>

        <label>
          <Mail size={16} />
          Adresse e-mail
          <input
            type="text"
            value={profile.email || "Non renseignée"}
            readOnly
          />
        </label>

        <label>
          Pays
          <input
            type="text"
            value={profile.country || "Non renseigné"}
            readOnly
          />
        </label>

        <label>
          Devise du compte
          <input
            type="text"
            value={profile.currency || "Non renseignée"}
            readOnly
          />
        </label>

        {error && <p className="form-error">{error}</p>}
        {message && <p className="form-success">{message}</p>}

        <button type="submit" disabled={saving}>
          <Save size={17} />
          {saving ? "Enregistrement..." : "Enregistrer les modifications"}
        </button>
      </form>
    </main>
  );
}
