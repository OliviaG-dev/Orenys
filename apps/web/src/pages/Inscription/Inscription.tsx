import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { registerSchema, zodFieldErrors } from "@orenys/domain";
import { Button, TextField } from "@orenys/ui";
import { AuthCard } from "../../components/AuthCard/AuthCard";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { useSession } from "../../hooks/useSession";
import { ApiRequestError } from "../../services/apiClient";
import { registerAccount } from "../../services/authService";

export function Inscription() {
  useDocumentTitle("Inscription");
  const navigate = useNavigate();
  const { refresh } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [pending, setPending] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");
    const parsed = registerSchema.safeParse({ email, password });
    if (!parsed.success) {
      setFieldErrors(Object.fromEntries(zodFieldErrors(parsed.error).map((issue) => [issue.path, issue.message])));
      return;
    }
    setFieldErrors({});
    setPending(true);
    try {
      await registerAccount(parsed.data);
      await refresh();
      navigate("/app");
    } catch (error) {
      setFormError(error instanceof ApiRequestError ? error.message : "Le service ne répond pas. Réessaie dans un instant.");
    } finally {
      setPending(false);
    }
  };

  return (
    <AuthCard
      title="Créer ton compte"
      intro="Le premier pas est un compte. Le parcours s'ouvrira ensuite."
      error={formError}
      onSubmit={(event) => void onSubmit(event)}
      footer={
        <>
          Déjà un compte ? <Link to="/connexion">Se connecter</Link>
        </>
      }
    >
      <TextField
        label="Adresse e-mail"
        name="email"
        type="email"
        autoComplete="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        error={fieldErrors.email}
        required
      />
      <TextField
        label="Mot de passe"
        name="password"
        type="password"
        autoComplete="new-password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        hint="10 caractères minimum, avec une lettre et un chiffre."
        error={fieldErrors.password}
        required
      />
      <Button type="submit" disabled={pending}>
        {pending ? "Création…" : "Créer mon compte"}
      </Button>
    </AuthCard>
  );
}
