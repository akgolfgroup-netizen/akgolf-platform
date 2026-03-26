import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import express from 'express';
import { registerDrillTools } from './tools/drills.js';
import { registerDrillAgentTools } from './tools/drill-agent.js';
import { registerPlayerTools } from './tools/players.js';
import { registerTrackmanTools } from './tools/trackman.js';
import { registerVoiceTools } from './tools/voice.js';
import { registerTrainingTools } from './tools/training.js';
import { registerTestTools } from './tools/tests.js';
import { registerBreakingPointTools } from './tools/breaking-points.js';
import { registerResources } from './resources.js';
import { registerPrompts } from './prompts.js';
// ── Server ──────────────────────────────────────────────────
const server = new McpServer({
    name: 'ak-golf-mcp-server',
    version: '1.0.0',
});
// ── Register Tools (25) ─────────────────────────────────────
registerDrillTools(server); // ak_drill_create, ak_drill_search, ak_drill_approve, ak_drill_stats
registerDrillAgentTools(server); // ak_drill_suggest, ak_drill_import_batch, ak_drill_coverage_gaps
registerPlayerTools(server); // ak_player_create, ak_player_get, ak_player_list, ak_session_log, ak_session_history
registerTrackmanTools(server); // ak_trackman_log, ak_trackman_analyze
registerVoiceTools(server); // ak_voice_save, ak_voice_search
registerTrainingTools(server); // ak_training_analyze, ak_training_plan_save, ak_training_plan_get
registerTestTools(server); // ak_test_log, ak_test_compare, ak_test_history
registerBreakingPointTools(server); // ak_bp_log, ak_bp_history, ak_bp_progression
// ── Register Resources (4) ──────────────────────────────────
registerResources(server); // ak://reference/formula, distributions, hours, invariants
// ── Register Prompts (4) ────────────────────────────────────
registerPrompts(server); // ak_weekly_plan, ak_player_assessment, ak_build_drill_library, ak_session_debrief
console.error('AK Golf MCP Server v1.0.0');
console.error('  25 tools | 4 resources | 4 prompts');
console.error('  All tools prefixed: ak_*');
// ── Transport: stdio ────────────────────────────────────────
async function runStdio() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('Transport: stdio');
}
// ── Transport: Streamable HTTP with DNS rebinding protection ─
async function runHTTP() {
    const app = express();
    app.use(express.json());
    // DNS rebinding protection — validate Host header on localhost
    app.use((req, res, next) => {
        const host = req.headers.host ?? '';
        const isLocalhost = host.startsWith('localhost') || host.startsWith('127.0.0.1') || host.startsWith('[::1]');
        const isAllowed = process.env.ALLOWED_ORIGINS?.split(',').some(o => host.startsWith(o));
        if (!isLocalhost && !isAllowed) {
            res.status(403).json({ error: 'Forbidden: invalid Host header' });
            return;
        }
        next();
    });
    // MCP endpoint — stateless per request
    app.post('/mcp', async (req, res) => {
        const transport = new StreamableHTTPServerTransport({
            sessionIdGenerator: undefined, // stateless
            enableJsonResponse: true,
        });
        res.on('close', () => transport.close());
        await server.connect(transport);
        await transport.handleRequest(req, res, req.body);
    });
    // Health check
    app.get('/health', (_req, res) => {
        res.json({
            status: 'ok',
            server: 'ak-golf-mcp-server',
            version: '1.0.0',
            tools: 25,
            resources: 4,
            prompts: 4,
        });
    });
    const port = parseInt(process.env.PORT || '3100');
    app.listen(port, '127.0.0.1', () => {
        console.error(`Transport: HTTP on http://127.0.0.1:${port}/mcp`);
    });
}
// ── Start ───────────────────────────────────────────────────
const transport = process.env.TRANSPORT || 'stdio';
if (transport === 'http') {
    runHTTP().catch(err => { console.error('Fatal:', err); process.exit(1); });
}
else {
    runStdio().catch(err => { console.error('Fatal:', err); process.exit(1); });
}
//# sourceMappingURL=index.js.map