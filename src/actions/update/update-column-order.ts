// /functions/update_column_order.ts
"use server";

import { supabase } from "@/lib/supabase-client";

export interface ColumnOrder {
  id: string;
  order: number;
  name: string; // デバッグ用。データベース更新には不要
}

export default async function updateColumnOrder(columnOrders: ColumnOrder[]): Promise<void> {
  // 更新用のオブジェクトを作成
  // SQL関数では各更新の値として { columnOrder: 数値 } を期待しているため、
  // デバッグ用の name は除外して、order を columnOrder に変換する
  console.log(columnOrders);
  const updates: { [key: string]: { columnOrder: number } } = Object.fromEntries(
    columnOrders.map(({ id, order }) => [id, { columnOrder: order }])
  );

  const { error } = await supabase.rpc("update_column_order", {
    updates,
  });

  if (error) {
    console.error("❌ updateColumnOrder error:", error);
    throw new Error(`カラムの順序更新に失敗しました: ${error.message}`);
  }

  console.log("✅ Column order updated successfully!");  
}
