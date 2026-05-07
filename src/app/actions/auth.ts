"use server";

import { supabaseAdmin } from "@/integrations/supabase/client.server";

export async function createUser(
  email: string,
  password: string,
  displayName: string,
): Promise<{ id: string } | { error: string; status: number }> {
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { display_name: displayName },
  });

  if (error) {
    const status = error.message.includes("already been registered") ? 409 : 400;
    return { error: error.message, status };
  }

  return { id: data.user.id };
}
