// @/data/getSheets.ts

import { supabase } from '@/lib/supabaseClient';

/**
 * userId が指定されている場合は、そのユーザーに紐づくシートのみを取得し、
 * 指定されていない場合は全てのシートを取得します。
 */
export default async function getSheets(userId?: string): Promise<Sheet[]> {
  // Supabase の from メソッドは、レコード型と挿入型の 2 つの型引数が必要です。
  let query = supabase.from('sheets').select('*');

  if (userId) {
    // userId が存在する場合、その userId に紐づくシートのみを取得
    query = query.eq('userId', userId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching sheets:', error);
    return [];
  }

  return data || [];
}
