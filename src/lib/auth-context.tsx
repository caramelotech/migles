"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type AuthContextValue = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setLoading(true);
    let subscription:
      | ReturnType<typeof supabase.auth.onAuthStateChange>["data"]["subscription"]
      | undefined;

    try {
      const { data } = supabase.auth.onAuthStateChange((_event, newSession) => {
        setSession(newSession);
        setLoading(false);
      });
      subscription = data.subscription;

      supabase.auth
        .getSession()
        .then(({ data: sessionData }) => {
          setSession(sessionData.session);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    } catch (e) {
      console.error("[Auth] Falha ao inicializar Supabase:", e);
      setLoading(false);
    }

    return () => subscription?.unsubscribe();
  }, []);

  const value: AuthContextValue = {
    user: session?.user ?? null,
    session,
    loading,
    signOut: async () => {
      await supabase.auth.signOut();
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
