export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      cells: {
        Row: {
          columnId: string
          createdAt: string
          id: string
          rowId: string
          sheetId: string
          value: string
        }
        Insert: {
          columnId?: string
          createdAt?: string
          id?: string
          rowId: string
          sheetId: string
          value: string
        }
        Update: {
          columnId?: string
          createdAt?: string
          id?: string
          rowId?: string
          sheetId?: string
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "cells_columnId_fkey"
            columns: ["columnId"]
            isOneToOne: false
            referencedRelation: "columns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cells_rowId_fkey"
            columns: ["rowId"]
            isOneToOne: false
            referencedRelation: "rows"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cells_sheetId_fkey"
            columns: ["sheetId"]
            isOneToOne: false
            referencedRelation: "sheets"
            referencedColumns: ["id"]
          },
        ]
      }
      columns: {
        Row: {
          columnName: string
          columnOrder: number
          createdAt: string
          id: string
          sheetId: string
        }
        Insert: {
          columnName: string
          columnOrder: number
          createdAt?: string
          id?: string
          sheetId: string
        }
        Update: {
          columnName?: string
          columnOrder?: number
          createdAt?: string
          id?: string
          sheetId?: string
        }
        Relationships: [
          {
            foreignKeyName: "columns_sheetId_fkey"
            columns: ["sheetId"]
            isOneToOne: false
            referencedRelation: "sheets"
            referencedColumns: ["id"]
          },
        ]
      }
      rows: {
        Row: {
          createdAt: string
          id: string
          rowName: string
          rowOrder: number
          sheetId: string
        }
        Insert: {
          createdAt?: string
          id?: string
          rowName: string
          rowOrder: number
          sheetId: string
        }
        Update: {
          createdAt?: string
          id?: string
          rowName?: string
          rowOrder?: number
          sheetId?: string
        }
        Relationships: [
          {
            foreignKeyName: "rows_sheetId_fkey"
            columns: ["sheetId"]
            isOneToOne: false
            referencedRelation: "sheets"
            referencedColumns: ["id"]
          },
        ]
      }
      sheets: {
        Row: {
          createdAt: string
          id: string
          sheetName: string
          userId: string
        }
        Insert: {
          createdAt?: string
          id?: string
          sheetName: string
          userId: string
        }
        Update: {
          createdAt?: string
          id?: string
          sheetName?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "sheets_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          createdAt: string
          id: string
          userName: string
        }
        Insert: {
          createdAt?: string
          id: string
          userName: string
        }
        Update: {
          createdAt?: string
          id?: string
          userName?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      transaction_create_sheet_data: {
        Args: {
          user_id: string
          sheet_name?: string
          column_names?: string[]
          row_names?: string[]
        }
        Returns: undefined
      }
      transaction_create_sheet_data02: {
        Args: {
          userid: string
          sheetname?: string
          columnnames?: string[]
          rownames?: string[]
        }
        Returns: undefined
      }
      transaction_create_sheet_data03: {
        Args: {
          userid: string
          sheetname?: string
          columnnames?: string[]
          rownames?: string[]
        }
        Returns: undefined
      }
      transaction_create_sheet_data05: {
        Args: {
          userId: string
          sheetName?: string
          columnNames?: string[]
          rowNames?: string[]
        }
        Returns: undefined
      }
      transaction_create_sheet_data06: {
        Args: {
          userId: string
          sheetName?: string
          columnNames?: string[]
          rowNames?: string[]
        }
        Returns: undefined
      }
      transaction_create_sheet_data07: {
        Args: {
          userId: string
          sheetName?: string
          columnNames?: string[]
          rowNames?: string[]
        }
        Returns: undefined
      }
      transaction_create_sheet_data08: {
        Args: {
          userId: string
          sheetName?: string
          columnNames?: string[]
          rowNames?: string[]
        }
        Returns: undefined
      }
      transaction_create_sheet_data09: {
        Args: {
          userId: string
          sheetName?: string
          columnNames?: string[]
          rowNames?: string[]
        }
        Returns: string
      }
      transaction_create_sheet_data10: {
        Args: {
          userId: string
          sheetName: string
          columnNames: string[]
          rowNames: string[]
        }
        Returns: string
      }
      transaction_create_sheet_data11: {
        Args: {
          userId: string
          sheetName: string
          columnNames: string[]
          rowNames: string[]
        }
        Returns: string
      }
      transaction_create_sheet_data12: {
        Args: {
          userId: string
          sheetName: string
          columnNames: string[]
          rowNames: string[]
        }
        Returns: string
      }
      transaction_create_sheet_data13: {
        Args: {
          userId: string
          sheetName: string
          columnNames: string[]
          rowNames: string[]
        }
        Returns: string
      }
      transaction_create_sheet_data14: {
        Args: {
          userId: string
          sheetName: string
          columnNames: string[]
          rowNames: string[]
        }
        Returns: string
      }
      transaction_create_sheet_data15: {
        Args: {
          newUserId: string
          newSheetName: string
          columnNames: string[]
          rowNames: string[]
        }
        Returns: string
      }
      transaction_create_sheet_data16: {
        Args: {
          newUserId: string
          newSheetName: string
          newColumnNames: string[]
          newRowNames: string[]
        }
        Returns: string
      }
      transaction_create_sheet_data17: {
        Args: {
          newUserId: string
          newSheetName: string
          newColumnNames: string[]
          newRowNames: string[]
        }
        Returns: string
      }
      update_column_order: {
        Args: {
          updates: Json
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
