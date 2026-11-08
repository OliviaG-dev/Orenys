import { Link, NavLink, Outlet } from "react-router";
import { BrandMark } from "../BrandMark/BrandMark";
import "./PublicLayout.css";

const links = [
  { to: "/parcours", label: "Le parcours" },
  { to: "/mentor", label: "Le mentor" },
  { to: "/ressources", label: "Ressources" },
  { to: "/a-propos", label: "À propos" },
];

export function PublicLayout() {
  return (
    <>
      <a className="skip-link" href="#contenu">
        Aller au contenu
      </a>
      <header className="public-header">
        <Link className="brand" to="/">
          <BrandMark />
          ORÉNYS
        </Link>
        <nav className="public-nav" aria-label="Pages publiques">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to}>
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="public-actions">
          <Link to="/connexion">Connexion</Link>
          <Link className="orenys-button orenys-button-primary" to="/inscription">
            Commencer
          </Link>
        </div>
      </header>
      <div id="contenu">
        <Outlet />
      </div>
      <footer className="public-footer">
        <span>Le début de tout ce que tu peux devenir.</span>
        <nav aria-label="Informations légales">
          <Link to="/mentions-legales">Mentions légales</Link>
          {" · "}
          <Link to="/confidentialite">Confidentialité</Link>
          {" · "}
          <Link to="/cgu">CGU</Link>
        </nav>
      </footer>
    </>
  );
}
