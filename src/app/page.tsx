"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";

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
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between h-20">
          <h1 className="text-2xl font-bold">Migles</h1>
          <Button asChild>
            <Link href="/login">Entrar</Link>
          </Button>
        </nav>

        <section className="py-20 text-center">
          <h2 className="text-5xl font-bold tracking-tight mb-6">
            Organize seus eventos com facilidade
          </h2>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto">
            Migles organiza o que acontece fora do chat: presenças confirmadas, lista de espera
            automática e tudo num único lugar para amigos e comunidades.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Button asChild size="lg">
              <a href="/login">Começar</a>
            </Button>
          </div>
        </section>

        <section className="grid md:grid-cols-3 gap-8 py-20">
          <div className="text-center">
            <div className="h-12 w-12 mx-auto mb-4 rounded-lg bg-primary/10 flex items-center justify-center">
              <svg
                className="h-6 w-6 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Agendamento fácil</h3>
            <p className="text-muted-foreground">Crie e organize eventos em segundos</p>
          </div>

          <div className="text-center">
            <div className="h-12 w-12 mx-auto mb-4 rounded-lg bg-primary/10 flex items-center justify-center">
              <svg
                className="h-6 w-6 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.856-1.487M15 10a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Gerenciamento de presença</h3>
            <p className="text-muted-foreground">Acompanhe confirmações em tempo real</p>
          </div>

          <div className="text-center">
            <div className="h-12 w-12 mx-auto mb-4 rounded-lg bg-primary/10 flex items-center justify-center">
              <svg
                className="h-6 w-6 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Lista de espera automática</h3>
            <p className="text-muted-foreground">
              Adicione pessoas automaticamente quando alguém sai
            </p>
          </div>
        </section>

        <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Caramelo Tech
        </footer>
      </div>
    </div>
  );
}
