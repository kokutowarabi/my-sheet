import type { Database as DB } from "@/types/database.types";

declare global {
    type Database = DB;
    type User = DB['public']['Tables']['users']['Row'];
    type Sheet = DB['public']['Tables']['sheets']['Row'];
    type Column = DB['public']['Tables']['columns']['Row'];
    type Row = DB['public']['Tables']['rows']['Row'];
    type Cell = DB['public']['Tables']['cells']['Row'];
}