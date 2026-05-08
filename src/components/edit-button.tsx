import Link from "next/link";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EditButtonProps {
  href: string;
  label?: string;
  className?: string;
}

export function EditButton({ href, label = "Editar", className }: EditButtonProps) {
  return (
    <Button variant="outline" size="sm" asChild className={cn(className)}>
      <Link href={href}>
        <Pencil className="h-4 w-4 mr-1" aria-hidden="true" />
        {label}
      </Link>
    </Button>
  );
}
