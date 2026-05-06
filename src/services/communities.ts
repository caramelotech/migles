import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type CommunityRow = Database["public"]["Tables"]["communities"]["Row"];
export type CommunityType = Database["public"]["Enums"]["community_type"];

type MemberWithCommunity = { role: string; communities: CommunityRow };

export async function listMyCommunities(userId: string) {
  const { data, error } = await supabase
    .from("community_members")
    .select("role, status, communities(*)")
    .eq("user_id", userId)
    .eq("status", "active");
  if (error) throw error;
  return (data ?? []).map((m) => {
    const member = m as unknown as MemberWithCommunity;
    return { role: member.role, community: member.communities };
  });
}

export async function searchPublicCommunities(query: string) {
  let q = supabase.from("communities").select("*").eq("type", "public").limit(30);
  if (query.trim()) q = q.ilike("name", `%${query.trim()}%`);
  const { data, error } = await q;
  if (error) throw error;
  return data ?? [];
}

export async function createCommunity(input: {
  name: string;
  description?: string;
  type: CommunityType;
  cover_url?: string | null;
  created_by: string;
}) {
  const { data, error } = await supabase
    .from("communities")
    .insert({
      name: input.name,
      description: input.description || null,
      type: input.type,
      cover_url: input.cover_url ?? null,
      created_by: input.created_by,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function joinCommunity(communityId: string, userId: string) {
  const { error } = await supabase
    .from("community_members")
    .insert({ community_id: communityId, user_id: userId, role: "member", status: "active" });
  if (error) throw error;
}

export async function getCommunity(communityId: string) {
  const { data, error } = await supabase
    .from("communities")
    .select("*")
    .eq("id", communityId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function updateCommunity(
  communityId: string,
  input: {
    name?: string;
    description?: string | null;
    type?: CommunityType;
    cover_url?: string | null;
  },
) {
  const { data, error } = await supabase
    .from("communities")
    .update(input)
    .eq("id", communityId)
    .select()
    .single();
  if (error) throw error;
  return data;
}
