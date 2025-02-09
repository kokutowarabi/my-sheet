// /app/actions/create/createUser.ts
"use server";

import { supabase } from "@/lib/supabaseClient";
import createSheet from "./createSheet";

export interface CreateUserState {
  error: string | null;
  success: boolean;
  user: User | null;
  sheetId: string | null;
}

export default async function createUser(
  prevState: CreateUserState,
  formData: FormData
): Promise<CreateUserState> {
  const userName = formData.get("userName") as string;
  const sheetName = formData.get("sheetName") as string;

  if (!userName) {
    return { error: "ユーザー名を入力してください", success: false, user: null, sheetId: null };
  }

  // Supabaseを使ってユーザーを作成
  const { data, error } = await supabase
    .from("users")
    .insert([{ userName }])
    .select()
    .single();

  if (error) {
    console.error("❌ createUser error:", error);
    return { error: "ユーザー作成に失敗しました", success: false, user: null, sheetId: null };
  }

  if (!data || !data.id) {
    console.error("❌ createUser error: Failed to retrieve user ID");
    return { error: "ユーザーIDの取得に失敗しました", success: false, user: null, sheetId: null };
  }

  console.log("✅ User created successfully!", data);

  try {
    // 作成したユーザーIDを元にシートを作成し、sheetIdを取得
    const sheetId = await createSheet({ userId: data.id, sheetName });
    return { success: true, error: null, user: data, sheetId };
  } catch (sheetError) {
    console.error("❌ createUser error while creating sheet:", sheetError);
    return { error: "シートの作成に失敗しました", success: false, user: data, sheetId: null };
  }
}
