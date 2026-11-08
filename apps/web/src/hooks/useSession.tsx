import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { PublicUser } from "@orenys/domain";
import { fetchMe } from "../services/authService";

type SessionStatus = "loading" | "anonymous" | "authenticated";

type SessionContextValue = {
  user: PublicUser | null;
  status: SessionStatus;
  refresh: () => Promise<void>;
};

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [status, setStatus] = useState<SessionStatus>("loading");

  const refresh = useCallback(async () => {
    try {
      const nextUser = await fetchMe();
      setUser(nextUser);
      setStatus(nextUser ? "authenticated" : "anonymous");
    } catch {
      setUser(null);
      setStatus("anonymous");
    }
  }, []);

  useEffect(() => {
    let active = true;
    fetchMe()
      .then((nextUser) => {
        if (!active) {
          return;
        }
        setUser(nextUser);
        setStatus(nextUser ? "authenticated" : "anonymous");
      })
      .catch(() => {
        if (!active) {
          return;
        }
        setUser(null);
        setStatus("anonymous");
      });
    return () => {
      active = false;
    };
  }, []);

  const value = useMemo(() => ({ user, status, refresh }), [user, status, refresh]);

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionContextValue {
  const value = useContext(SessionContext);
  if (!value) {
    throw new Error("useSession doit être utilisé dans SessionProvider.");
  }
  return value;
}
