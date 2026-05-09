"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { resetPasswordSchema, type ResetPasswordValues } from "@/schemas/authSchema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Notification } from "@/components/notification";
import { PublicNavbar } from "@/components/public-navbar";
import { PageSpinner } from "@/components/page-spinner";
import { cn } from "@/lib/utils";

type PageState = "loading" | "form" | "invalid" | "success";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [pageState, setPageState] = useState<PageState>("loading");
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors, touchedFields },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const password = watch("password");

  useEffect(() => {
    if (touchedFields.confirmPassword) {
      trigger("confirmPassword");
    }
  }, [password, touchedFields.confirmPassword, trigger]);

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setPageState("form");
      } else if (event === "SIGNED_IN" && pageState === "loading") {
        // Already signed in but not via recovery link
        setPageState("invalid");
      }
    });

    // Give the hash token a moment to be processed by the Supabase client
    const timeout = setTimeout(() => {
      setPageState((s) => (s === "loading" ? "invalid" : s));
    }, 2000);

    return () => {
      listener.subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function fieldClass(name: keyof ResetPasswordValues) {
    const touched = touchedFields[name];
    return cn(
      touched && errors[name] && "border-red-500 focus-visible:ring-red-500",
      touched && !errors[name] && "border-green-500 focus-visible:ring-green-500",
    );
  }

  async function onSubmit(data: ResetPasswordValues) {
    setSubmitting(true);
    setServerError(null);

    const { error } = await supabase.auth.updateUser({ password: data.password });

    if (error) {
      setServerError(error.message);
      setSubmitting(false);
      return;
    }

    await supabase.auth.signOut();
    setPageState("success");
    toast.success("Senha redefinida com sucesso!");
    setSubmitting(false);
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <PublicNavbar showLogin={false} />
      </div>

      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          {pageState === "loading" && <PageSpinner />}

          {pageState === "invalid" && (
            <div className="text-center space-y-4">
              <p className="font-semibold">Link inválido ou expirado</p>
              <p className="text-sm text-muted-foreground">
                Este link de recuperação não é válido ou já foi utilizado. Solicite um novo link.
              </p>
              <Button className="w-full" onClick={() => router.push("/login")}>
                Voltar para o login
              </Button>
            </div>
          )}

          {pageState === "success" && (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10">
                  <CheckCircle2 className="h-6 w-6 text-emerald-600" aria-hidden="true" />
                </div>
              </div>
              <div>
                <p className="font-semibold">Senha redefinida</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Sua senha foi atualizada com sucesso. Faça login com a nova senha.
                </p>
              </div>
              <Button className="w-full" onClick={() => router.push("/login")}>
                Ir para o login
              </Button>
            </div>
          )}

          {pageState === "form" && (
            <>
              <h1 className="text-2xl font-semibold tracking-tight text-center">Nova senha</h1>
              <p className="mt-1 text-sm text-muted-foreground text-center">
                Escolha uma nova senha para sua conta.
              </p>
              <div className="my-6 h-px bg-border" />

              {serverError && (
                <Notification
                  variant="error"
                  message={serverError}
                  onDismiss={() => setServerError(null)}
                />
              )}

              <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="password">Nova senha</Label>
                  <Input
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    autoFocus
                    {...register("password")}
                    className={fieldClass("password")}
                  />
                  {errors.password ? (
                    <p className="text-xs text-red-600 dark:text-red-400">
                      {errors.password.message}
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground">Mínimo 6 caracteres</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    {...register("confirmPassword")}
                    className={fieldClass("confirmPassword")}
                  />
                  {errors.confirmPassword && (
                    <p className="text-xs text-red-600 dark:text-red-400">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? "Salvando…" : "Redefinir senha"}
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
