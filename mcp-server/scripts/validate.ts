// Validate the MCP server builds and registers correctly
// Run: npx tsx scripts/validate.ts

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import { registerDrillTools } from '../src/tools/drills.js';
import { registerDrillAgentTools } from '../src/tools/drill-agent.js';
import { registerPlayerTools } from '../src/tools/players.js';
import { registerTrackmanTools } from '../src/tools/trackman.js';
import { registerVoiceTools } from '../src/tools/voice.js';
import { registerTrainingTools } from '../src/tools/training.js';
import { registerTestTools } from '../src/tools/tests.js';
import { registerBreakingPointTools } from '../src/tools/breaking-points.js';
import { registerResources } from '../src/resources.js';
import { registerPrompts } from '../src/prompts.js';

const server = new McpServer({ name: 'ak-golf-mcp-server', version: '1.0.0' });

// Register everything
registerDrillTools(server);
registerDrillAgentTools(server);
registerPlayerTools(server);
registerTrackmanTools(server);
registerVoiceTools(server);
registerTrainingTools(server);
registerTestTools(server);
registerBreakingPointTools(server);
registerResources(server);
registerPrompts(server);

console.log('✓ AK Golf MCP Server — registrering OK');
console.log('');
console.log('Klar for deploy. Neste:');
console.log('  1. Kjør 001_initial_schema.sql i Supabase SQL Editor');
console.log('  2. Sett SUPABASE_URL og SUPABASE_SERVICE_KEY');
console.log('  3. npx tsx scripts/seed-drills.ts');
console.log('  4. npm start');
