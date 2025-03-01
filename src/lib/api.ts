import { supabase } from './supabase';
import { handleAuthError } from './auth';

export async function fetchData<T>(
  table: string,
  options: {
    select?: string;
    order?: { column: string; ascending?: boolean };
    eq?: { column: string; value: any };
  } = {}
): Promise<T[]> {
  try {
    // Check session before making request
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('No active session');
    }

    let query = supabase.from(table).select(options.select || '*');

    if (options.order) {
      query = query.order(options.order.column, {
        ascending: options.order.ascending ?? true
      });
    }

    if (options.eq) {
      query = query.eq(options.eq.column, options.eq.value);
    }

    const { data, error } = await query;

    if (error) {
      if (error.message.includes('JWT') || error.message.includes('token')) {
        await handleAuthError(error);
      }
      throw error;
    }

    return data as T[];
  } catch (error: any) {
    console.error(`Error fetching ${table}:`, error);
    if (error.message === 'No active session') {
      await handleAuthError({ name: 'AuthApiError' });
    }
    throw error;
  }
}