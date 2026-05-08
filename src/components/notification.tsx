"use client";

import { X, CheckCircle2, AlertCircle, AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

const variantStyles = {
  success: {
    container:
      "bg-green-50 border-green-200 text-green-800 dark:bg-green-950/30 dark:border-green-800 dark:text-green-300",
    icon: CheckCircle2,
    iconClass: "text-green-500 dark:text-green-400",
  },
  error: {
    container:
      "bg-red-50 border-red-200 text-red-800 dark:bg-red-950/30 dark:border-red-800 dark:text-red-300",
    icon: AlertCircle,
    iconClass: "text-red-500 dark:text-red-400",
  },
  warning: {
    container:
      "bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-950/30 dark:border-amber-800 dark:text-amber-300",
    icon: AlertTriangle,
    iconClass: "text-amber-500 dark:text-amber-400",
  },
  info: {
    container:
      "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950/30 dark:border-blue-800 dark:text-blue-300",
    icon: Info,
    iconClass: "text-blue-500 dark:text-blue-400",
  },
};

export interface NotificationProps {
  variant?: keyof typeof variantStyles;
  title?: string;
  message: string;
  onDismiss?: () => void;
  className?: string;
}

export function Notification({
  variant = "info",
  title,
  message,
  onDismiss,
  className,
}: NotificationProps) {
  const { container, icon: Icon, iconClass } = variantStyles[variant];

  return (
    <div
      role="alert"
      className={cn(
        "flex items-start gap-3 rounded-lg border px-4 py-3 text-sm animate-in fade-in slide-in-from-top-1 duration-200",
        container,
        className,
      )}
    >
      <Icon className={cn("h-4 w-4 mt-0.5 shrink-0", iconClass)} aria-hidden="true" />
      <div className="flex-1 min-w-0">
        {title && <p className="font-medium leading-snug">{title}</p>}
        <p className={cn(title && "mt-0.5 opacity-90")}>{message}</p>
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Fechar notificação"
          className="shrink-0 rounded p-0.5 opacity-50 hover:opacity-100 transition-opacity focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-current"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
