import { Route, Routes } from "react-router";
import { AppShell } from "../components/AppShell/AppShell";
import { PublicLayout } from "../components/PublicLayout/PublicLayout";
import { RequireAuth } from "../components/RequireAuth/RequireAuth";
import { SessionProvider } from "../hooks/useSession";
import { APropos } from "../pages/APropos/APropos";
import { Atelier } from "../pages/Atelier/Atelier";
import { Cgu } from "../pages/Cgu/Cgu";
import { Chemin } from "../pages/Chemin/Chemin";
import { Confidentialite } from "../pages/Confidentialite/Confidentialite";
import { Connexion } from "../pages/Connexion/Connexion";
import { Dashboard } from "../pages/Dashboard/Dashboard";
import { Home } from "../pages/Home/Home";
import { Inscription } from "../pages/Inscription/Inscription";
import { MentionsLegales } from "../pages/MentionsLegales/MentionsLegales";
import { Mentor } from "../pages/Mentor/Mentor";
import { MentorEspace } from "../pages/MentorEspace/MentorEspace";
import { NotFound } from "../pages/NotFound/NotFound";
import { Parametres } from "../pages/Parametres/Parametres";
import { Parcours } from "../pages/Parcours/Parcours";
import { Projet } from "../pages/Projet/Projet";
import { Ressources } from "../pages/Ressources/Ressources";
import { RessourcesEspace } from "../pages/RessourcesEspace/RessourcesEspace";

export function App() {
  return (
    <SessionProvider>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="parcours" element={<Parcours />} />
          <Route path="mentor" element={<Mentor />} />
          <Route path="ressources" element={<Ressources />} />
          <Route path="a-propos" element={<APropos />} />
          <Route path="connexion" element={<Connexion />} />
          <Route path="inscription" element={<Inscription />} />
          <Route path="mentions-legales" element={<MentionsLegales />} />
          <Route path="confidentialite" element={<Confidentialite />} />
          <Route path="cgu" element={<Cgu />} />
        </Route>
        <Route element={<RequireAuth />}>
          <Route path="app" element={<AppShell />}>
            <Route index element={<Dashboard />} />
            <Route path="chemin" element={<Chemin />} />
            <Route path="projet" element={<Projet />} />
            <Route path="atelier" element={<Atelier />} />
            <Route path="ressources" element={<RessourcesEspace />} />
            <Route path="mentor" element={<MentorEspace />} />
            <Route path="parametres" element={<Parametres />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </SessionProvider>
  );
}
