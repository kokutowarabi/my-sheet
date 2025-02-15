'use server';
import { supabase } from "@/lib/supabase-client"
import { revalidatePath } from "next/cache";

/**
 * activeセルとoverセルの columnId, rowId を入れ替えて更新する関数
 *
 * @param active - ドラッグ開始時のセル情報（更新対象）
 * @param over - ドラッグ終了時のセル情報（更新対象）
 * @returns 更新された active と over のセル情報、エラー発生時は null を返す
 */
export const updateCellPositions = async (
  active: Cell,
  over: Cell,
): Promise<{ active: Cell; over: Cell } | null> => {
  // activeセルは overセルの位置情報に更新、overセルは activeセルの位置情報に更新
  const [activeUpdate, overUpdate] = await Promise.all([
    supabase
      .from('cells')
      .update({
        columnId: over.columnId,
        rowId: over.rowId,
      })
      .eq('id', active.id)
      .select()
      .single(),
    supabase
      .from('cells')
      .update({
        columnId: active.columnId,
        rowId: active.rowId,
      })
      .eq('id', over.id)
      .select()
      .single(),
  ]);

  if (activeUpdate.error) {
    console.error('Supabaseへのactiveセル更新でエラーが発生しました:', activeUpdate.error);
    return null;
  }
  if (overUpdate.error) {
    console.error('Supabaseへのoverセル更新でエラーが発生しました:', overUpdate.error);
    return null;
  }

  revalidatePath('/');
  return { active: activeUpdate.data, over: overUpdate.data };
}
