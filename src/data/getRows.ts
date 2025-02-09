// @/data/getRows.ts
import { supabase } from "@/lib/supabaseClient";

export default async function getRows(sheetId: string): Promise<Row[]> {
  const { data, error } = await supabase
    .from("rows")
    .select("*")
    .eq("sheetId", sheetId);

  if (error) {
    console.error("Error fetching rows:", error);
    return [];
  }

  return data || [];
}
