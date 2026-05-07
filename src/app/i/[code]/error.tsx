"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function InviteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center px-4">
      <p className="text-lg font-semibold">Erro ao carregar convite</p>
      <p className="text-sm text-muted-foreground max-w-sm">
        {error.message || "Não foi possível carregar este convite."}
      </p>
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => router.push("/events")}>
          Ver eventos
        </Button>
        <Button onClick={reset}>Tentar novamente</Button>
      </div>
    </div>
  );
}
