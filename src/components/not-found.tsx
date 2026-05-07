"use client";

import { Button } from "@/components/ui/button";

type Props = {
  message?: string;
  backLabel?: string;
  onBack: () => void;
};

export function NotFound({
  message = "Página não encontrada.",
  backLabel = "Voltar",
  onBack,
}: Props) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
      <p className="text-muted-foreground">{message}</p>
      <Button variant="outline" onClick={onBack}>
        {backLabel}
      </Button>
    </div>
  );
}
