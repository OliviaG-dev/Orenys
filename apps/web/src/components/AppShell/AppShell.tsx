import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router";
import { Button } from "@orenys/ui";
import { logoutAccount } from "../../services/authService";
import { useSession } from "../../hooks/useSession";
import { BrandMark } from "../BrandMark/BrandMark";
import "./AppShell.css";

const sidebar = [
  { to: "/app", label: "Accueil", end: true },
  { to: "/app/chemin", label: "Mon chemin" },
  { to: "/app/projet", label: "Mon projet" },
  { to: "/app/atelier", label: "Atelier" },
  { to: "/app/ressources", label: "Ressources" },
  { to: "/app/parametres", label: "Paramètres" },
];

const tabs = [
  { to: "/app", label: "Accueil", end: true },
  { to: "/app/chemin", label: "Chemin" },
  { to: "/app/projet", label: "Projet" },
  { to: "/app/mentor", label: "Mentor" },
];

const moreLinks = [
  { to: "/app/atelier", label: "Atelier" },
  { to: "/app/ressources", label: "Ressources" },
  { to: "/app/parametres", label: "Paramètres" },
];

export function AppShell() {
  const navigate = useNavigate();
  const { refresh } = useSession();
  const [moreOpen, setMoreOpen] = useState(false);
  const [leaving, setLeaving] = useState(false);

  const logout = async () => {
    setLeaving(true);
    try {
      await logoutAccount();
      await refresh();
      navigate("/connexion");
    } finally {
      setLeaving(false);
    }
  };

  return (
    <div className="app-shell">
      <a className="skip-link" href="#contenu">
        Aller au contenu
      </a>
      <aside className="app-sidebar">
        <Link className="brand" to="/app">
          <BrandMark />
          ORÉNYS
        </Link>
        <nav aria-label="Espace personnel">
          {sidebar.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end}>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="app-main">
        <header className="app-topbar">
          <Link className="brand mobile-brand" to="/app">
            <BrandMark />
            ORÉNYS
          </Link>
          <Link className="mentor-link" to="/app/mentor">
            Mentor
          </Link>
          <Button variant="ghost" onClick={() => void logout()} disabled={leaving}>
            {leaving ? "Sortie…" : "Se déconnecter"}
          </Button>
        </header>
        <main id="contenu" className="app-content">
          <Outlet />
        </main>
      </div>
      <nav className="app-tabbar" aria-label="Navigation principale">
        {tabs.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.end} onClick={() => setMoreOpen(false)}>
            {item.label}
          </NavLink>
        ))}
        <button
          type="button"
          aria-expanded={moreOpen}
          aria-controls="more-menu"
          onClick={() => setMoreOpen((open) => !open)}
        >
          Plus
        </button>
        {moreOpen ? (
          <div id="more-menu" className="more-panel">
            {moreLinks.map((item) => (
              <Link key={item.to} to={item.to} onClick={() => setMoreOpen(false)}>
                {item.label}
              </Link>
            ))}
          </div>
        ) : null}
      </nav>
    </div>
  );
}
