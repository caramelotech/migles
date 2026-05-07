"use client";

import { useRef } from "react";
import { ImagePlus } from "lucide-react";
import { Label } from "@/components/ui/label";

type Props = {
  preview: string | null;
  onFileSelect: (file: File, previewUrl: string) => void;
  label?: string;
  height?: string;
};

export function CoverUpload({ preview, onFileSelect, label, height = "h-40" }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    onFileSelect(file, URL.createObjectURL(file));
  }

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={`relative w-full ${height} rounded-xl border-2 border-dashed border-border bg-muted/30 hover:bg-muted/50 transition-colors flex flex-col items-center justify-center gap-2 overflow-hidden`}
      >
        {preview ? (
          <img
            src={preview}
            alt="Preview da capa"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <>
            <ImagePlus className="h-8 w-8 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Clique para adicionar capa</span>
          </>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
}
