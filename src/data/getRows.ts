// @/data/getRows.ts
import { supabase } from "@/lib/supabase-client";

export default async function getRows(sheetId: string): Promise<Row[]> {
  const { data, error } = await supabase
    .from("rows")
    .select("*")
    .eq("sheetId", sheetId)
    .order("rowOrder", { ascending: true });

  if (error) {
    console.error("Error fetching rows:", error);
    return [];
  }

  return data || [];
}
