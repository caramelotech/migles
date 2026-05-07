export function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
      {children}
    </h2>
  );
}
