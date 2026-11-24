
import {
  UserRound,
  AtSign,
  Mail,
  Globe2,
  Wallet,
  ShieldCheck,
} from "lucide-react";

export interface ProfileInfoData {
  displayName: string;
  username: string;
  email: string | null;
  country: string | null;
  currency: string | null;
}

interface ProfileInfoProps {
  profile: ProfileInfoData;
}

export default function ProfileInfo({ profile }: ProfileInfoProps) {
  const fields = [
    {
      label: "Nom affiché",
      value: profile.displayName,
      icon: UserRound,
    },
    {
      label: "Nom d'utilisateur",
      value: `@${profile.username}`,
      icon: AtSign,
    },
    {
      label: "Adresse e-mail",
      value: profile.email || "Non renseignée",
      icon: Mail,
    },
    {
      label: "Pays",
      value: profile.country || "Non renseigné",
      icon: Globe2,
    },
    {
      label: "Devise",
      value: profile.currency || "Non renseignée",
      icon: Wallet,
    },
  ];

  return (
    <section className="profile-info">
      <header className="profile-info-header">
        <div className="profile-info-avatar">
          <UserRound size={26} />
        </div>

        <div>
          <h2>{profile.displayName}</h2>
          <p>@{profile.username}</p>
        </div>

        <span className="profile-verified">
          <ShieldCheck size={15} />
          Connecté
        </span>
      </header>

      <div className="profile-info-fields">
        {fields.map(({ label, value, icon: Icon }) => (
          <div className="profile-info-row" key={label}>
            <span className="profile-info-icon">
              <Icon size={18} />
            </span>

            <div>
              <small>{label}</small>
              <strong>{value}</strong>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
