import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export async function POST(request: NextRequest) {
  const { email, password, display_name } = await request.json();

  if (!email || !password || !display_name) {
    return NextResponse.json({ error: "Dados incompletos." }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { display_name },
  });

  if (error) {
    const status = error.message.includes("already been registered") ? 409 : 400;
    return NextResponse.json({ error: error.message }, { status });
  }

  return NextResponse.json({ id: data.user.id }, { status: 201 });
}
