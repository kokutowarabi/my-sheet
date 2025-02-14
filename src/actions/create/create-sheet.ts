// @/actions/create/createSheet.ts
"use server";

import { supabase } from "@/lib/supabaseClient";

// sheet作成処理の例（エラー処理は省略）
interface CreateSheetParams {
  userId: string;
  sheetName?: string;
}

export default async function createSheet({ userId, sheetName }: CreateSheetParams): Promise<string> {
  const { data: sheetId, error } = await supabase.rpc("transaction_create_sheet_data", {
    newUserId: userId,
    newSheetName: sheetName ?? "新規シート",
    newColumnNames: "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(''),
    newRowNames: Array.from({ length: 15 }, (_, i) => (i + 1).toString()), // 1-10 の行
  });

  if (error) {
    throw new Error(`シートの作成に失敗しました: ${error.message}`);
  }

  return sheetId;
}
