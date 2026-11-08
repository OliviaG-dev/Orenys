import { Navigate, Outlet, useLocation } from "react-router";
import { useSession } from "../../hooks/useSession";

export function RequireAuth() {
  const { status } = useSession();
  const location = useLocation();

  if (status === "loading") {
    return (
      <main className="page">
        <p>Ouverture de ta session…</p>
      </main>
    );
  }

  if (status === "anonymous") {
    const next = encodeURIComponent(`${location.pathname}${location.search}`);
    return <Navigate to={`/connexion?next=${next}`} replace />;
  }

  return <Outlet />;
}
