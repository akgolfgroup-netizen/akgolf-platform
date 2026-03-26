import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { getSupabase } from '../services/supabase.js';
import { success, handleSupabaseError } from '../services/responses.js';
import { VoiceNoteCreateInput, VoiceNoteSearchInput } from '../schemas/index.js';

export function registerVoiceTools(server: McpServer): void {

  server.registerTool('ak_voice_save', {
    title: 'Save Voice Note', description: `Save transcribed coaching note (coach or player). Link to player and/or session.\n\nArgs: transcript (required), player_id, session_id, author_type, summary, key_points[], tags[]\nReturns: Saved voice note with UUID.`,
    inputSchema: VoiceNoteCreateInput,
    annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: false },
  }, async (params) => {
    const sb = getSupabase();
    const { data, error: err } = await sb.from('voice_notes').insert(params).select().single();
    if (err) return handleSupabaseError(err, 'ak_voice_save');
    return success(data as Record<string, unknown>);
  });

  server.registerTool('ak_voice_search', {
    title: 'Search Voice Notes', description: `Search coaching notes by player, text content, or time period.\n\nArgs: player_id (optional), query (text search), days (default 30), limit (default 20)\nReturns: Matching notes with transcripts and key_points.`,
    inputSchema: VoiceNoteSearchInput,
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  }, async (params) => {
    const sb = getSupabase();
    const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - params.days);
    let q = sb.from('voice_notes').select('*').gte('created_at', cutoff.toISOString()).order('created_at', { ascending: false }).limit(params.limit);
    if (params.player_id) q = q.eq('player_id', params.player_id);
    if (params.query) q = q.or(`transcript.ilike.%${params.query}%,summary.ilike.%${params.query}%`);
    const { data, error: err } = await q;
    if (err) return handleSupabaseError(err, 'ak_voice_search');
    return success({ count: (data ?? []).length, notes: data ?? [] });
  });
}
