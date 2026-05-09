"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ArrowLeft, MailCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { createUser } from "@/app/actions/auth";
import {
  signInSchema,
  signUpSchema,
  forgotPasswordSchema,
  type SignInValues,
  type SignUpValues,
  type ForgotPasswordValues,
} from "@/schemas/authSchema";
import { Button } from "@/components/ui/button";
import { PublicNavbar } from "@/components/public-navbar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Notification } from "@/components/notification";
import { cn } from "@/lib/utils";

function ForgotPasswordForm({ onBack }: { onBack: () => void }) {
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, touchedFields },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  async function onSubmit(data: ForgotPasswordValues) {
    setSubmitting(true);
    setServerError(null);

    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setServerError(error.message);
    } else {
      setSent(true);
    }

    setSubmitting(false);
  }

  if (sent) {
    return (
      <div className="space-y-4 mt-4">
        <div className="flex flex-col items-center gap-3 py-6 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <MailCheck className="h-6 w-6 text-primary" aria-hidden="true" />
          </div>
          <div>
            <p className="font-medium">E-mail enviado</p>
            <p className="text-sm text-muted-foreground mt-1">
              Enviamos as instruções para <span className="font-medium">{getValues("email")}</span>.
              Verifique sua caixa de entrada.
            </p>
          </div>
        </div>
        <Button variant="outline" className="w-full" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-1.5" aria-hidden="true" />
          Voltar para o login
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 mt-4">
      <div>
        <h2 className="font-semibold">Recuperar senha</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Digite seu e-mail e enviaremos um link para redefinir sua senha.
        </p>
      </div>

      {serverError && (
        <Notification
          variant="error"
          message={serverError}
          onDismiss={() => setServerError(null)}
        />
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="forgot-email">E-mail</Label>
          <Input
            id="forgot-email"
            type="email"
            autoComplete="email"
            autoFocus
            {...register("email")}
            className={cn(
              touchedFields.email && errors.email && "border-red-500 focus-visible:ring-red-500",
              touchedFields.email && !errors.email && "border-green-500 focus-visible:ring-green-500",
            )}
          />
          {errors.email && (
            <p className="text-xs text-red-600 dark:text-red-400">{errors.email.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? "Enviando…" : "Enviar link de recuperação"}
        </Button>
      </form>

      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
        Voltar para o login
      </button>
    </div>
  );
}

function SignInForm({ onForgotPassword }: { onForgotPassword: () => void }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
  } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  function fieldClass(name: keyof SignInValues) {
    const touched = touchedFields[name];
    return cn(
      touched && errors[name] && "border-red-500 focus-visible:ring-red-500",
      touched && !errors[name] && "border-green-500 focus-visible:ring-green-500",
    );
  }

  async function onSubmit(data: SignInValues) {
    setSubmitting(true);
    setServerError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      setServerError(error.message);
    } else {
      toast.success("Logado com sucesso!");
      router.push("/feed");
    }

    setSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4 mt-4">
      {serverError && (
        <Notification
          variant="error"
          message={serverError}
          onDismiss={() => setServerError(null)}
        />
      )}

      <div className="space-y-1.5">
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          {...register("email")}
          className={fieldClass("email")}
        />
        {errors.email && (
          <p className="text-xs text-red-600 dark:text-red-400">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Senha</Label>
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Esqueci minha senha
          </button>
        </div>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          {...register("password")}
          className={fieldClass("password")}
        />
        {errors.password && (
          <p className="text-xs text-red-600 dark:text-red-400">{errors.password.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={submitting}>
        {submitting ? "Carregando…" : "Entrar"}
      </Button>
    </form>
  );
}

function SignUpForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors, touchedFields },
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const password = watch("password");

  useEffect(() => {
    if (touchedFields.confirmPassword) {
      trigger("confirmPassword");
    }
  }, [password, touchedFields.confirmPassword, trigger]);

  function fieldClass(name: keyof SignUpValues) {
    const touched = touchedFields[name];
    return cn(
      touched && errors[name] && "border-red-500 focus-visible:ring-red-500",
      touched && !errors[name] && "border-green-500 focus-visible:ring-green-500",
    );
  }

  async function onSubmit(data: SignUpValues) {
    setSubmitting(true);
    setServerError(null);

    const result = await createUser(data.email, data.password, data.displayName);

    if ("error" in result) {
      const msg =
        result.status === 409 ? "E-mail já cadastrado." : (result.error ?? "Erro ao criar conta.");
      setServerError(msg);
      setSubmitting(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      setServerError(`Conta criada, mas erro ao entrar: ${error.message}`);
      setSubmitting(false);
      return;
    }

    toast.success("Conta criada com sucesso!");
    router.push("/feed");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4 mt-4">
      {serverError && (
        <Notification
          variant="error"
          message={serverError}
          onDismiss={() => setServerError(null)}
        />
      )}

      <div className="space-y-1.5">
        <Label htmlFor="displayName">Nome</Label>
        <Input
          id="displayName"
          autoComplete="name"
          {...register("displayName")}
          className={fieldClass("displayName")}
        />
        {errors.displayName && (
          <p className="text-xs text-red-600 dark:text-red-400">{errors.displayName.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email-signup">E-mail</Label>
        <Input
          id="email-signup"
          type="email"
          autoComplete="email"
          {...register("email")}
          className={fieldClass("email")}
        />
        {errors.email && (
          <p className="text-xs text-red-600 dark:text-red-400">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="password-signup">Senha</Label>
        <Input
          id="password-signup"
          type="password"
          autoComplete="new-password"
          {...register("password")}
          className={fieldClass("password")}
        />
        {errors.password ? (
          <p className="text-xs text-red-600 dark:text-red-400">{errors.password.message}</p>
        ) : (
          <p className="text-xs text-muted-foreground">Mínimo 6 caracteres</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="confirmPassword">Confirmar senha</Label>
        <Input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          {...register("confirmPassword")}
          className={fieldClass("confirmPassword")}
        />
        {errors.confirmPassword && (
          <p className="text-xs text-red-600 dark:text-red-400">{errors.confirmPassword.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={submitting}>
        {submitting ? "Carregando…" : "Criar conta"}
      </Button>
    </form>
  );
}

function LoginPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading } = useAuth();
  const [view, setView] = useState<"tabs" | "forgot">("tabs");

  const defaultTab = searchParams.get("tab") === "signup" ? "signup" : "signin";

  useEffect(() => {
    if (!loading && user) {
      const redirect = searchParams.get("redirect") || "/feed";
      router.push(redirect);
    }
  }, [user, loading, router, searchParams]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <PublicNavbar showLogin={false} />
      </div>
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-semibold tracking-tight text-center">Bem-vindo</h1>
          <p className="mt-1 text-sm text-muted-foreground text-center">
            Entre ou crie sua conta para começar.
          </p>
          <div className="my-6 h-px bg-border" />

          {view === "forgot" ? (
            <ForgotPasswordForm onBack={() => setView("tabs")} />
          ) : (
            <Tabs defaultValue={defaultTab}>
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="signin">Entrar</TabsTrigger>
                <TabsTrigger value="signup">Criar conta</TabsTrigger>
              </TabsList>
              <TabsContent value="signin">
                <SignInForm onForgotPassword={() => setView("forgot")} />
              </TabsContent>
              <TabsContent value="signup">
                <SignUpForm />
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div role="status" className="flex min-h-screen items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          <span className="sr-only">Carregando…</span>
        </div>
      }
    >
      <LoginPageInner />
    </Suspense>
  );
}
