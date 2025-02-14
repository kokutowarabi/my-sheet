// @/actions/create/createUser.ts
"use server";

import { supabase } from "@/lib/supabaseClient";
import userExists from "../user-exists";

interface createUserParams {
  userId: string;
  userName: string;
}

export default async function createUser(
  { userId, userName }: createUserParams
): Promise<boolean> {
  if (await userExists(userId)) {
    return false;
  }

  // 存在しなければ、新規ユーザーとして挿入する
  const { data: user, error: insertError } = await supabase
    .from("users")
    .insert({
      id: userId,
      userName: userName ?? 'ユーザー名', // 必須カラム userName を設定
    });

  if (insertError) {
    console.error("Error inserting user in Supabase:", insertError);
    return false;
  }

  console.log("✅ User created successfully!", user);
  return true;
}
