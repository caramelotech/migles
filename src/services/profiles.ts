import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function updateProfile(
  userId: string,
  input: { display_name?: string; bio?: string | null; avatar_url?: string | null },
) {
  const current = await getProfile(userId);
  const { data, error } = await supabase
    .from("profiles")
    .upsert(
      {
        id: userId,
        display_name: input.display_name ?? current?.display_name ?? "Usuário",
        email: current?.email ?? null,
        bio: input.bio !== undefined ? input.bio : (current?.bio ?? null),
        avatar_url:
          input.avatar_url !== undefined ? input.avatar_url : (current?.avatar_url ?? null),
      },
      { onConflict: "id" },
    )
    .select()
    .single();
  if (error) throw error;
  return data;
}
