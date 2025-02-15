// /functions/update_order.ts
"use server";

import { supabase } from "@/lib/supabase-client";
import { revalidatePath } from "next/cache";

export interface Order {
  id: string;
  order: number;
  name?: string; // デバッグ用。データベース更新には不要
}

export type OrderType = "column" | "row";

/**
 * カラムまたは行の順序を更新する共通関数
 * 
 * @param type 更新対象の種別 ("column" なら columns テーブルの columnOrder、"row" なら rows テーブルの rowOrder)
 * @param orders 更新する順序情報の配列
 */
export default async function updateOrder(type: OrderType, orders: Order[]): Promise<void> {
  // 対象テーブル名と更新対象のフィールド名を決定
  const tableName = type === "column" ? "columns" : "rows";
  const orderField = type === "column" ? "columnOrder" : "rowOrder";

  // 更新用のオブジェクトを作成
  // 例: { "uuid-1": { columnOrder: 1 }, "uuid-2": { columnOrder: 2 } } または
  //     { "uuid-3": { rowOrder: 1 }, "uuid-4": { rowOrder: 2 } }
  const updates: { [key: string]: { [key: string]: number } } = Object.fromEntries(
    orders.map(({ id, order }) => [id, { [orderField]: order }])
  );

  // 共通の SQL 関数 update_order を呼び出す
  const { error } = await supabase.rpc("update_order", {
    p_table_name: tableName,
    p_order_field: orderField,
    p_updates: updates,
  });

  if (error) {
    console.error(`❌ updateOrder error (${type}):`, error);
    throw new Error(`更新に失敗しました: ${error.message}`);
  }

  console.log(`✅ ${type} order updated successfully!`);
  revalidatePath("/");
}
