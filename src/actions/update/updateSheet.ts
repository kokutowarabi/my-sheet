// @/actions/updateSheet.ts
"use server";

import { supabase } from "@/lib/supabaseClient";

interface UpdateSheetParams {
  sheetId: string;
  newValue: string;
}

export default async function updateSheet({sheetId, newValue}: UpdateSheetParams): Promise<boolean> {
  const { error } = await supabase
    .from("sheets")
    .update({ sheetName: newValue })
    .eq("id", sheetId);

  if (error) {
    console.error("Error updating sheet:", error);
    return false;
  }

  console.log("✅ Sheet updated successfully!");

  return true;
}
