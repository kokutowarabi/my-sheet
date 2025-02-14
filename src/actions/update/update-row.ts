// @/actions/updateRow.ts
"use server";

import { supabase } from "@/lib/supabase-client";

interface UpdateRowParams {
  rowId: string;
  newValue: string;
}

export default async function updateRow({ rowId, newValue }: UpdateRowParams): Promise<boolean> {
  const { error } = await supabase
    .from("rows")
    .update({ rowName: newValue })
    .eq("id", rowId);

  if (error) {
    console.error("Error updating row:", error);
    return false;
  }

  console.log("✅ Row updated successfully!");

  return true;
}
