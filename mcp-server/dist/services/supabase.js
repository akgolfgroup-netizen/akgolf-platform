import { createClient } from '@supabase/supabase-js';
let supabase = null;
export function getSupabase() {
    if (supabase)
        return supabase;
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_KEY;
    if (!url || !key) {
        throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY environment variables. ' +
            'Set them before starting the server.');
    }
    supabase = createClient(url, key);
    return supabase;
}
// Generic query helper with error handling
export async function query(table, builder) {
    const sb = getSupabase();
    const { data, error } = await builder(sb.from(table));
    if (error) {
        const msg = error instanceof Error ? error.message : JSON.stringify(error);
        throw new Error(`Supabase query on '${table}' failed: ${msg}`);
    }
    if (data === null) {
        throw new Error(`No data returned from '${table}' query`);
    }
    return data;
}
//# sourceMappingURL=supabase.js.map