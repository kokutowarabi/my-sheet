// @/actions/update/update-row-order.ts
"use server";

import { supabase } from "@/lib/supabaseClient";

export interface RowOrder {
  id: string;
  order: number;
}

export default async function updateRowOrder(rowOrders: RowOrder[]): Promise<void> {
  // 更新用のオブジェクトを作成
  // SQL関数では各更新の値として { rowOrder: 数値 } を期待しているため、
  // デバッグ用の name は除外して、order を rowOrder に変換する
  console.log(rowOrders);
  const updates: { [key: string]: { rowOrder: number } } = Object.fromEntries(
    rowOrders.map(({ id, order }) => [id, { rowOrder: order }])
  );

  const { error } = await supabase.rpc("update_row_order", {
    updates,
  });

  if (error) {
    console.error("❌ updateRowOrder error:", error);
    throw new Error(`カラムの順序更新に失敗しました: ${error.message}`);
  }

  console.log("✅ Row order updated successfully!");  
}
