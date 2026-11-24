
import {
  Globe2,
  ShieldCheck,
  CreditCard,
  Wallet,
  ArrowRight,
  Menu,
  X,
  Smartphone,
  Lock,
  ChevronRight
} from "lucide-react";
import { useState } from "react";

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main>
      <nav className="navbar">
        <a href="#" className="brand">
          <Globe2 size={27} />
          <span>MADARA <b>GLOBAL</b></span>
        </a>

        <div className={`nav-links ${menuOpen ? "open" : ""}`}>
          <a href="#features" onClick={() => setMenuOpen(false)}>Fonctionnalités</a>
          <a href="#cards" onClick={() => setMenuOpen(false)}>Cartes</a>
          <a href="#security" onClick={() => setMenuOpen(false)}>Sécurité</a>
        </div>

        <div className="nav-actions">
          <a href="#access" className="login">Connexion</a>
          <a href="#access" className="nav-button">Commencer <ArrowRight size={16}/></a>
        </div>

        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Ouvrir le menu">
          {menuOpen ? <X /> : <Menu />}
        </button>
      </nav>

      <section className="hero">
        <div className="hero-content">
          <div className="eyebrow">
            <span className="live-dot"></span>
            FINANCE NUMÉRIQUE INTERNATIONALE
          </div>

          <h1>
            Le monde<br />
            dans votre <span>poche.</span>
          </h1>

          <p>
            Découvrez une nouvelle expérience financière.
            Gérez votre portefeuille et vos cartes virtuelles
            depuis une plateforme conçue pour le monde entier.
          </p>

          <div className="hero-buttons">
            <a href="#access" className="primary-button">
              Découvrir MADARA <ArrowRight size={18}/>
            </a>
            <a href="#features" className="secondary-button">
              Explorer
            </a>
          </div>

          <div className="hero-trust">
            <ShieldCheck size={17}/>
            <span>La sécurité au cœur de notre vision</span>
          </div>
        </div>

        <div className="hero-visual">
          <div className="glow"></div>
          <div className="virtual-card">
            <div className="card-top">
              <span>MADARA GLOBAL</span>
              <Globe2 size={24}/>
            </div>

            <div className="chip">
              <div></div>
            </div>

            <div className="card-number">
              •••• &nbsp; •••• &nbsp; •••• &nbsp; 2026
            </div>

            <div className="card-bottom">
              <div>
                <small>CARTE DE DÉMONSTRATION</small>
                <strong>GLOBAL MEMBER</strong>
              </div>
              <span className="card-symbol">MG</span>
            </div>
          </div>

          <div className="floating-label">
            <ShieldCheck size={18}/>
            <span>Concept sécurisé</span>
          </div>
        </div>
      </section>

      <section className="stats">
        <div>
          <strong>GLOBAL</strong>
          <span>Vision internationale</span>
        </div>
        <div>
          <strong>24/7</strong>
          <span>Accès à la plateforme</span>
        </div>
        <div>
          <strong>ONE</strong>
          <span>Expérience unifiée</span>
        </div>
      </section>

      <section className="features section" id="features">
        <div className="section-heading">
          <span className="section-tag">L'ÉCOSYSTÈME MADARA</span>
          <h2>Tout au même endroit.</h2>
          <p>Une plateforme pensée pour simplifier la gestion financière numérique.</p>
        </div>

        <div className="feature-grid">
          <article className="feature-card">
            <div className="feature-icon"><Wallet /></div>
            <h3>Portefeuille</h3>
            <p>Un espace personnel pour consulter son solde et suivre ses opérations.</p>
            <ChevronRight />
          </article>

          <article className="feature-card">
            <div className="feature-icon"><CreditCard /></div>
            <h3>Cartes virtuelles</h3>
            <p>Un espace de gestion pour les cartes individuelles émises par nos partenaires.</p>
            <ChevronRight />
          </article>

          <article className="feature-card">
            <div className="feature-icon"><Globe2 /></div>
            <h3>International</h3>
            <p>Une vision mondiale avec des services adaptés aux pays pris en charge.</p>
            <ChevronRight />
          </article>
        </div>
      </section>

      <section className="card-section section" id="cards">
        <div>
          <span className="section-tag">VOTRE ESPACE PERSONNEL</span>
          <h2>Une expérience<br/><span>à votre image.</span></h2>
          <p>
            Chaque utilisateur disposera de son propre espace
            pour consulter ses cartes, ses informations et
            ses transactions.
          </p>
        </div>

        <div className="dashboard-preview">
          <div className="dashboard-header">
            <span>MADARA GLOBAL</span>
            <div className="avatar">MG</div>
          </div>
          <small>APERÇU DU PORTEFEUILLE</small>
          <div className="balance">••••••••</div>
          <span className="private-label">Solde masqué — aperçu uniquement</span>
          <div className="dashboard-items">
            <div><Wallet/> Portefeuille</div>
            <div><CreditCard/> Mes cartes</div>
            <div><Smartphone/> Transactions</div>
          </div>
        </div>
      </section>

      <section className="security section" id="security">
        <div className="security-icon"><Lock size={32}/></div>
        <span className="section-tag">SÉCURITÉ ET CONFIANCE</span>
        <h2>Votre confiance,<br/>notre priorité.</h2>
        <p>
          Nous concevons MADARA GLOBAL autour de la protection
          des comptes, de la confidentialité et de la sécurité
          des opérations.
        </p>
        <div className="security-points">
          <span><ShieldCheck/> Protection des comptes</span>
          <span><Lock/> Confidentialité</span>
          <span><Globe2/> Vision internationale</span>
        </div>
      </section>

      <section className="cta" id="access">
        <span className="section-tag">MADARA GLOBAL</span>
        <h2>Le monde vous attend.</h2>
        <p>Une nouvelle vision de la finance numérique.</p>
        <a href="#top" className="primary-button">
          Découvrir notre plateforme <ArrowRight size={18}/>
        </a>
        <small>Présentation uniquement — aucun paiement réel ni émission de carte activé.</small>
      </section>

      <footer>
        <a href="#" className="brand">
          <Globe2 size={23}/>
          <span>MADARA <b>GLOBAL</b></span>
        </a>
        <p>Your World. Your Money.</p>
        <span>© 2026 MADARA GLOBAL — Concept en développement.</span>
      </footer>
    </main>
  );
}
