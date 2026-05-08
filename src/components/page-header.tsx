import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BackConfig {
  href: string;
  /** Sempre obrigatório: aria-label quando icon-only, texto visível quando showLabel=true */
  label: string;
  /** Exibe ArrowLeft + texto; quando false/omitido, exibe apenas o ícone */
  showLabel?: boolean;
}

interface PageHeaderProps {
  title?: string;
  back?: BackConfig;
  /** Botões e ações do lado direito */
  children?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, back, children, className }: PageHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between gap-2", className)}>
      <div className="flex items-center gap-3 min-w-0">
        {back &&
          (back.showLabel ? (
            <Button variant="ghost" size="sm" className="gap-1.5 -ml-2 shrink-0" asChild>
              <Link href={back.href}>
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                {back.label}
              </Link>
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0"
              asChild
              aria-label={back.label}
            >
              <Link href={back.href}>
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          ))}
        {title && (
          <h1 className="text-2xl font-bold tracking-tight text-balance truncate">{title}</h1>
        )}
      </div>
      {children && <div className="flex items-center gap-2 shrink-0">{children}</div>}
    </div>
  );
}
