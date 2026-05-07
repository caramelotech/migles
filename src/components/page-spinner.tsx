export function PageSpinner() {
  return (
    <div role="status" className="flex min-h-[40vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
      <span className="sr-only">Carregando…</span>
    </div>
  );
}
