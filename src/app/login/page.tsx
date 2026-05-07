"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const signUpSchema = z.object({
  displayName: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
});

function LoginPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      const redirect = searchParams.get("redirect") || "/events";
      router.push(redirect);
    }
  }, [user, loading, router, searchParams]);

  async function handleSignIn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      const data = signInSchema.parse({
        email: formData.get("email"),
        password: formData.get("password"),
      });

      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        toast.error(`Erro: ${error.message}`);
      } else {
        toast.success("Logado com sucesso!");
        router.push("/events");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error("Erro ao fazer login");
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSignUp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      const data = signUpSchema.parse({
        displayName: formData.get("displayName"),
        email: formData.get("email"),
        password: formData.get("password"),
      });

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          display_name: data.displayName,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        const msg =
          res.status === 409 ? "E-mail já cadastrado." : (json.error ?? "Erro ao criar conta.");
        toast.error(msg);
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        toast.error(`Conta criada, mas erro ao entrar: ${error.message}`);
        return;
      }

      toast.success("Conta criada com sucesso!");
      router.push("/events");
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error("Erro ao criar conta");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Migles</h1>
          <p className="text-muted-foreground mt-2">Organize eventos com amigos e comunidades</p>
        </div>

        <div className="bg-card rounded-lg shadow-md p-6 border border-border">
          <Tabs defaultValue="signin">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="signin">Entrar</TabsTrigger>
              <TabsTrigger value="signup">Criar conta</TabsTrigger>
            </TabsList>
            <TabsContent value="signin">
              <form method="post" onSubmit={handleSignIn} className="space-y-4 mt-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email">E-mail</Label>
                  <Input id="email" name="email" type="email" autoComplete="email" required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? "Carregando..." : "Entrar"}
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="signup">
              <form method="post" onSubmit={handleSignUp} className="space-y-4 mt-4">
                <div className="space-y-1.5">
                  <Label htmlFor="displayName">Nome</Label>
                  <Input id="displayName" name="displayName" required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email-signup">E-mail</Label>
                  <Input
                    id="email-signup"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="password-signup">Senha</Label>
                  <Input
                    id="password-signup"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? "Carregando..." : "Criar conta"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      }
    >
      <LoginPageInner />
    </Suspense>
  );
}
