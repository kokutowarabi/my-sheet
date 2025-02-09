// @/actions/updateColumn.ts
"use server";

import { supabase } from "@/lib/supabaseClient";

interface UpdateColumnParams {
  columnId: string;
  newValue: string;
}

export default async function updateColumn({columnId, newValue}: UpdateColumnParams): Promise<boolean> {
  const { error } = await supabase
    .from("columns")
    .update({ columnName: newValue })
    .eq("id", columnId);

  if (error) {
    console.error("Error updating column:", error);
    return false;
  }

  console.log("✅ Column updated successfully!");

  return true;
}
