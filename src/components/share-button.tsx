import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ShareButtonProps {
  onClick: () => void;
  label?: string;
  className?: string;
}

export function ShareButton({ onClick, label = "Compartilhar", className }: ShareButtonProps) {
  return (
    <Button variant="outline" size="sm" onClick={onClick} className={cn(className)}>
      <Share2 className="h-4 w-4 mr-1" aria-hidden="true" />
      {label}
    </Button>
  );
}
