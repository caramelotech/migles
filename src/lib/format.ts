export function formatEventDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatRelativeDate(iso: string): string {
  const d = new Date(iso);
  const diffMs = d.getTime() - Date.now();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "hoje";
  if (diffDays === 1) return "amanhã";
  if (diffDays > 1 && diffDays < 7) return `em ${diffDays} dias`;
  if (diffDays < 0 && diffDays > -7) return `há ${Math.abs(diffDays)} dias`;
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}
