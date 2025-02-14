// @/data/getCells.ts
import { supabase } from "@/lib/supabase-client";

export default async function getCells(sheetId: string): Promise<Cell[]> {
  const { data, error } = await supabase
    .from("cells")
    .select("*")
    .eq('sheetId', sheetId);

  if (error) {
    console.error("Error fetching cells:", error);
    return [];
  }

  return data || [];
}
