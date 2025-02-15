// @/actions/updateCell.ts
"use server";

import { supabase } from "@/lib/supabase-client";
import { revalidatePath } from "next/cache";

interface UpdateCellParams {
  cellId: string;
  newValue: string;
}

export default async function updateCell({cellId, newValue}: UpdateCellParams): Promise<boolean> {
  const { error } = await supabase
    .from("cells")
    .update({ value: newValue })
    .eq("id", cellId);

  if (error) {
    console.error("Error updating cell:", error);
    return false;
  }

  console.log("✅ Cell updated successfully!");

  revalidatePath('/');
  return true;
}
