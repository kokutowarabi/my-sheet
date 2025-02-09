// @/actions/verify/verifyUser.ts
import { supabase } from "@/lib/supabaseClient";

export default async function verifyUser(userId: string): Promise<boolean> {
  const { data: existingUser, error: selectError } = await supabase
    .from("users")
    .select("id")
    .eq("id", userId)
    .maybeSingle(); // 存在しなければ undefined が返る

  if (selectError) {
    console.error("Error checking user existence in Supabase:", selectError);
    return false;
  }
  if (existingUser) {
    // ユーザーが既に存在する場合は、insert せずに true を返す
    return true;
  }

  return false;
}
