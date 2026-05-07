"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import { createEvent } from "@/services/events";
import { listMyCommunities } from "@/services/communities";
import { uploadCover } from "@/lib/upload-cover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CoverUpload } from "@/components/cover-upload";

export default function NewEventPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [locationType, setLocationType] = useState<"in_person" | "online">("in_person");
  const [location, setLocation] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [capacity, setCapacity] = useState("");
  const [visibility, setVisibility] = useState<"private" | "community">("private");
  const [communityId, setCommunityId] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { data: memberships = [] } = useQuery({
    queryKey: ["my-communities", user?.id],
    queryFn: () => listMyCommunities(user!.id),
    enabled: !!user,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    if (!title.trim()) {
      toast.error("O título é obrigatório.");
      return;
    }
    if (!startsAt) {
      toast.error("A data e hora são obrigatórias.");
      return;
    }

    setSubmitting(true);
    try {
      let cover_url: string | null = null;
      if (coverFile) {
        cover_url = await uploadCover(user.id, coverFile);
      }

      const event = await createEvent({
        title: title.trim(),
        description: description.trim() || undefined,
        location: locationType === "in_person" ? location.trim() || undefined : undefined,
        location_type: locationType,
        cover_url,
        starts_at: new Date(startsAt).toISOString(),
        capacity: capacity ? Number(capacity) : null,
        visibility,
        community_id: visibility === "community" && communityId ? communityId : null,
        created_by: user.id,
      });

      toast.success("Evento criado!");
      router.push(`/events/${event.id}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao criar evento.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/events" aria-label="Voltar para eventos">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Novo evento</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <CoverUpload
          preview={coverPreview}
          onFileSelect={(file, url) => {
            setCoverFile(file);
            setCoverPreview(url);
          }}
          label="Capa do evento"
        />

        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title">
            Título <span className="text-destructive">*</span>
          </Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Nome do evento"
            required
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Descrição</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Fale um pouco sobre o evento..."
            rows={4}
          />
        </div>

        {/* Location type */}
        <div className="space-y-2">
          <Label htmlFor="location-type">Tipo de local</Label>
          <Select
            value={locationType}
            onValueChange={(v) => setLocationType(v as "in_person" | "online")}
          >
            <SelectTrigger id="location-type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="in_person">Presencial</SelectItem>
              <SelectItem value="online">Online</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Location (only for in_person) */}
        {locationType === "in_person" && (
          <div className="space-y-2">
            <Label htmlFor="location">Endereço / local</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Ex: Rua das Flores, 100 - São Paulo"
            />
          </div>
        )}

        {/* Date/time */}
        <div className="space-y-2">
          <Label htmlFor="starts-at">
            Data e hora <span className="text-destructive">*</span>
          </Label>
          <Input
            id="starts-at"
            type="datetime-local"
            value={startsAt}
            onChange={(e) => setStartsAt(e.target.value)}
            required
          />
        </div>

        {/* Capacity */}
        <div className="space-y-2">
          <Label htmlFor="capacity">Capacidade (opcional)</Label>
          <Input
            id="capacity"
            type="number"
            min="1"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            placeholder="Ilimitado"
          />
        </div>

        {/* Visibility */}
        <div className="space-y-2">
          <Label htmlFor="visibility">Visibilidade</Label>
          <Select
            value={visibility}
            onValueChange={(v) => {
              setVisibility(v as "private" | "community");
              if (v !== "community") setCommunityId("");
            }}
          >
            <SelectTrigger id="visibility">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="private">Privado</SelectItem>
              <SelectItem value="community">Comunidade</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Community (only if visibility = community) */}
        {visibility === "community" && (
          <div className="space-y-2">
            <Label htmlFor="community">Comunidade</Label>
            <Select value={communityId} onValueChange={setCommunityId}>
              <SelectTrigger id="community">
                <SelectValue placeholder="Selecione uma comunidade" />
              </SelectTrigger>
              <SelectContent>
                {memberships.map(({ community }) => (
                  <SelectItem key={community.id} value={community.id}>
                    {community.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => router.push("/events")}
            disabled={submitting}
          >
            Cancelar
          </Button>
          <Button type="submit" className="flex-1" disabled={submitting}>
            {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" aria-hidden="true" />}
            Criar evento
          </Button>
        </div>
      </form>
    </div>
  );
}
