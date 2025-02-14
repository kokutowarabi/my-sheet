// @/actions/userExists.ts
"use server";

import { supabase } from "@/lib/supabase-client";

/**
 * 指定したユーザーIDのユーザーが存在するかどうかを返す
 * @param userId - ユーザーID
 * @returns ユーザーが存在すれば true、存在しなければ false
 */
export default async function userExists(userId: string): Promise<boolean> {
  const { data: existingUser, error: selectError } = await supabase
    .from("users")
    .select("id")
    .eq("id", userId)
    .maybeSingle();

  if (selectError) {
    console.error("Error checking user existence in Supabase:", selectError);
    // エラー時は安全のため false を返す（または適宜エラーを投げる）
    return false;
  }

  return !!existingUser;
}
