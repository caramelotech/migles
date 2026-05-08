"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { PublicNavbar } from "@/components/public-navbar";

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      router.push("/events");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div role="status" className="flex min-h-screen items-center justify-center">
        <div
          className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"
          aria-hidden="true"
        />
        <span className="sr-only">Carregando…</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-background/80">
      <div className="flex flex-col flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <PublicNavbar />

        <section className="mx-auto max-w-3xl pt-24 pb-16 text-center">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
            Organização para encontros sociais
          </p>
          <h2 className="text-4xl md:text-6xl font-semibold tracking-tight text-foreground">
            Encontros simples,
            <br />
            sem rolagem infinita.
          </h2>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto">
            Migles organiza o que acontece fora do chat: presenças confirmadas, lista de espera
            automática e tudo num único lugar para amigos e comunidades.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Button asChild size="lg">
              <a href="/login?tab=signup">Criar minha conta</a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="/login">Já tenho conta</a>
            </Button>
          </div>
        </section>

        <section className="mx-auto max-w-5xl pb-24 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-lg border border-border bg-card p-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5 text-foreground"
              aria-hidden="true"
            >
              <path d="M8 2v4" />
              <path d="M16 2v4" />
              <rect width="18" height="18" x="3" y="4" rx="2" />
              <path d="M3 10h18" />
            </svg>
            <h3 className="mt-3 font-medium">Eventos no centro</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Tudo gira em torno do encontro: data, local, vagas e quem confirmou.
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5 text-foreground"
              aria-hidden="true"
            >
              <path d="M13 5h8" />
              <path d="M13 12h8" />
              <path d="M13 19h8" />
              <path d="m3 17 2 2 4-4" />
              <path d="m3 7 2 2 4-4" />
            </svg>
            <h3 className="mt-3 font-medium">Lista de espera automática</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Definiu um limite? A fila se ajusta sozinha quando alguém desiste.
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5 text-foreground"
              aria-hidden="true"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <path d="M16 3.128a4 4 0 0 1 0 7.744" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <circle cx="9" cy="7" r="4" />
            </svg>
            <h3 className="mt-3 font-medium">Comunidades leves</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Agrupe pessoas com interesses comuns e centralize seus eventos.
            </p>
          </div>
        </section>

        <footer className="mt-auto border-t border-border py-8 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Caramelo Tech
        </footer>
      </div>
    </div>
  );
}
