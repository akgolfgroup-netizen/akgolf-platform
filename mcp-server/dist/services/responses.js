import { CHARACTER_LIMIT } from '../constants.js';
// ── Success response with structuredContent ─────────────────
export function success(data, markdown) {
    const json = JSON.stringify(data, null, 2);
    const text = markdown ?? json;
    const truncated = text.length > CHARACTER_LIMIT
        ? text.slice(0, CHARACTER_LIMIT) + '\n\n… (truncated — use pagination for more)'
        : text;
    return {
        content: [{ type: 'text', text: truncated }],
        structuredContent: data,
    };
}
// ── Error response with actionable message ──────────────────
export function error(message, suggestion) {
    const parts = [`Error: ${message}`];
    if (suggestion)
        parts.push(`Suggestion: ${suggestion}`);
    return {
        isError: true,
        content: [{ type: 'text', text: parts.join('\n') }],
    };
}
// ── Supabase error handler ──────────────────────────────────
export function handleSupabaseError(err, context) {
    const msg = err instanceof Error ? err.message : JSON.stringify(err);
    if (msg.includes('duplicate key')) {
        return error(`Duplikat i ${context}. Oppføringen eksisterer allerede.`, 'Bruk søk for å finne eksisterende oppføring.');
    }
    if (msg.includes('foreign key')) {
        return error(`Ugyldig referanse i ${context}. Sjekk at player_id, session_id, etc. eksisterer.`, 'Bruk ak_player_list for å finne gyldige IDer.');
    }
    if (msg.includes('not-null')) {
        return error(`Manglende påkrevd felt i ${context}.`, 'Sjekk at alle obligatoriske parametere er satt.');
    }
    return error(`Database-feil i ${context}: ${msg}`);
}
// ── Markdown formatters ─────────────────────────────────────
export function formatPlayerMarkdown(p) {
    return `**${p.name}** (Kat ${p.category})\nHCP: ${p.handicap ?? '—'} | Snitt: ${p.avg_score ?? '—'} | Periode: ${p.current_period ?? '—'}`;
}
export function formatDrillMarkdown(d) {
    return `**${d.name}** [${d.pyramid_level}/${d.difficulty}]\n${d.goal}\nVarighet: ${d.duration_minutes} min | Miljø: ${d.environments?.join(', ')}`;
}
export function formatPaginationMarkdown(total, count, offset, hasMore) {
    return `Viser ${offset + 1}–${offset + count} av ${total}${hasMore ? ' (flere tilgjengelig)' : ''}`;
}
//# sourceMappingURL=responses.js.map