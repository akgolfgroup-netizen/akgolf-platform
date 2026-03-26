import { SupabaseClient } from '@supabase/supabase-js';
export declare function getSupabase(): SupabaseClient;
export declare function query<T>(table: string, builder: (q: ReturnType<SupabaseClient['from']>) => Promise<{
    data: T | null;
    error: unknown;
}>): Promise<T>;
//# sourceMappingURL=supabase.d.ts.map