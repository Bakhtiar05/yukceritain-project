import { createClient } from "@/lib/supabase/server";

export type UserRole = "super_admin" | "admin_artikel" | "admin_konseling" | "admin_community" | null;

export async function getUserRole(): Promise<UserRole> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (error || !data) {
      return null;
    }

    return data.role as UserRole;
  } catch (error) {
    console.error("Error fetching user role:", error);
    return null;
  }
}
