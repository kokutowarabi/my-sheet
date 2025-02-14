// @/data/getColumns.ts
import { supabase } from "@/lib/supabase-client";

export default async function getColumns(sheetId: string): Promise<Column[]> {
  const { data, error } = await supabase
    .from("columns")
    .select("*")
    .eq("sheetId", sheetId)
    .order("columnOrder", { ascending: true });

  if (error) {
    console.error("Error fetching columns:", error);
    return [];
  }

  return data || [];
}
