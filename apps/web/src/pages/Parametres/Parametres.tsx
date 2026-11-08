import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "@orenys/ui";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { useSession } from "../../hooks/useSession";
import { logoutAccount } from "../../services/authService";

export function Parametres() {
  useDocumentTitle("Paramètres");
  const { user, refresh } = useSession();
  const navigate = useNavigate();
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
    <div className="stack">
      <h1>Paramètres</h1>
      <p>Adresse e-mail : {user?.email}</p>
      <p className="muted">Rôle : membre.</p>
      <p className="prose muted">
        L'export et la suppression du compte seront proposés ici. En attendant, écrire à [adresse
        e-mail à compléter].
      </p>
      <Button variant="secondary" onClick={() => void logout()} disabled={leaving}>
        {leaving ? "Sortie…" : "Se déconnecter"}
      </Button>
    </div>
  );
}
