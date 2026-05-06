import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type EventRow = Database["public"]["Tables"]["events"]["Row"];
export type EventVisibility = Database["public"]["Enums"]["event_visibility"];
export type EventLocationType = Database["public"]["Enums"]["event_location_type"];
export type RsvpStatus = Database["public"]["Enums"]["rsvp_status"];
export type RsvpRow = Database["public"]["Tables"]["rsvps"]["Row"];

export type EventWithCounts = EventRow & {
  confirmed_count: number;
  my_rsvp: RsvpStatus | null;
  community_name: string | null;
};

// Local join shapes returned by Supabase relational queries
type EventWithFullJoins = EventRow & {
  rsvps: Array<{ status: RsvpStatus; user_id: string }>;
  communities: { name: string } | null;
};

type EventWithRsvpStatus = EventRow & {
  rsvps: Array<{ status: RsvpStatus }>;
};

function countConfirmed(rsvps: Array<{ status: RsvpStatus }>): number {
  return rsvps.filter((r) => r.status === "confirmed").length;
}

export async function listMyEvents(userId: string): Promise<EventWithCounts[]> {
  const { data: events, error } = await supabase
    .from("events")
    .select("*, communities(name), rsvps(status, user_id)")
    .order("starts_at", { ascending: true });

  if (error) throw error;

  return (events ?? []).map((e) => {
    const event = e as unknown as EventWithFullJoins;
    return {
      ...event,
      confirmed_count: countConfirmed(event.rsvps),
      my_rsvp: event.rsvps.find((r) => r.user_id === userId)?.status ?? null,
      community_name: event.communities?.name ?? null,
    };
  });
}

export async function getEventByInviteCode(code: string): Promise<EventRow | null> {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("invite_code", code)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function getEvent(eventId: string) {
  const { data, error } = await supabase
    .from("events")
    .select("*, communities(id, name)")
    .eq("id", eventId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function getEventOrganizerIds(eventId: string) {
  const { data, error } = await supabase
    .from("event_organizers")
    .select("user_id")
    .eq("event_id", eventId);
  if (error) throw error;
  return (data ?? []).map((organizer) => organizer.user_id);
}

export async function listCommunityEvents(communityId: string) {
  const { data, error } = await supabase
    .from("events")
    .select("*, rsvps(status)")
    .eq("community_id", communityId)
    .order("starts_at", { ascending: true });
  if (error) throw error;
  return (data ?? []).map((e) => {
    const event = e as unknown as EventWithRsvpStatus;
    return {
      ...event,
      confirmed_count: countConfirmed(event.rsvps),
    };
  });
}

export async function getEventRsvps(eventId: string) {
  const { data, error } = await supabase
    .from("rsvps")
    .select("*, profiles:user_id(display_name, avatar_url)")
    .eq("event_id", eventId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function createEvent(input: {
  title: string;
  description?: string;
  location?: string;
  location_type: EventLocationType;
  cover_url?: string | null;
  starts_at: string;
  capacity?: number | null;
  visibility: EventVisibility;
  community_id?: string | null;
  created_by: string;
}) {
  const { data, error } = await supabase
    .from("events")
    .insert({
      title: input.title,
      description: input.description || null,
      location: input.location || null,
      location_type: input.location_type,
      cover_url: input.cover_url ?? null,
      starts_at: input.starts_at,
      capacity: input.capacity ?? null,
      visibility: input.visibility,
      community_id: input.community_id ?? null,
      created_by: input.created_by,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function setRsvp(eventId: string, userId: string, status: RsvpStatus) {
  const { error } = await supabase
    .from("rsvps")
    .upsert({ event_id: eventId, user_id: userId, status }, { onConflict: "event_id,user_id" });
  if (error) throw error;
}

export async function updateEventCover(eventId: string, coverUrl: string | null) {
  const { data, error } = await supabase
    .from("events")
    .update({ cover_url: coverUrl })
    .eq("id", eventId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateEvent(
  eventId: string,
  input: {
    title?: string;
    description?: string | null;
    location?: string | null;
    location_type?: EventLocationType;
    starts_at?: string;
    capacity?: number | null;
    visibility?: EventVisibility;
    cover_url?: string | null;
  },
) {
  const { data, error } = await supabase
    .from("events")
    .update(input)
    .eq("id", eventId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function listEventComments(eventId: string) {
  const { data, error } = await supabase
    .from("event_comments")
    .select("*, profiles:user_id(display_name, avatar_url)")
    .eq("event_id", eventId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function addComment(
  eventId: string,
  userId: string,
  content: string,
  parentId?: string | null,
) {
  const { error } = await supabase
    .from("event_comments")
    .insert({ event_id: eventId, user_id: userId, content, parent_id: parentId ?? null });
  if (error) throw error;
}

export async function deleteEvent(eventId: string) {
  const { error } = await supabase.from("events").delete().eq("id", eventId);
  if (error) throw error;
}

export async function deleteComment(commentId: string) {
  const { error } = await supabase.from("event_comments").delete().eq("id", commentId);
  if (error) throw error;
}

export async function removeRsvp(eventId: string, userId: string) {
  const { error } = await supabase
    .from("rsvps")
    .delete()
    .eq("event_id", eventId)
    .eq("user_id", userId);
  if (error) throw error;
}

export async function inviteUserToEvent(eventId: string, userId: string) {
  const { error } = await supabase
    .from("rsvps")
    .upsert(
      { event_id: eventId, user_id: userId, status: "pending" },
      { onConflict: "event_id,user_id", ignoreDuplicates: true },
    );
  if (error) throw error;
}
