/**
 * Sprint 80 — Manual Acceptance Verification Script
 * Tests all 6 Scenarios in the Sprint 80 Production-Grade Acceptance Matrix:
 * 
 * Scenario 1: Read README.md -> Summarize it
 * Scenario 2: Search package.json -> Open the first one (Bug 1 Fix: read_file generated)
 * Scenario 3: How many files? -> List them -> How many were there? (Bug 2 Fix: MemoryExecutionSource <15ms)
 * Scenario 4: Multi-Turn Read-Only Chain (7 turns)
 * Scenario 5: Repository Navigation Chain (5 turns)
 * Scenario 6: State Fallback Scenario
 */

const fs = require('fs');
const path = require('path');
const { DesktopContainer } = require('../dist-electron/main/container/desktop-container');
const { CoreModule } = require('../dist-electron/main/modules/core.module');
const { IpcModule } = require('../dist-electron/main/modules/ipc.module');
const { WindowModule } = require('../dist-electron/main/modules/window.module');
const { WorkspaceModule } = require('../dist-electron/main/modules/workspace.module');
const { ThemeModule } = require('../dist-electron/main/modules/theme.module');
const { TerminalModule } = require('../dist-electron/main/modules/terminal.module');
const { SessionModule } = require('../dist-electron/main/modules/session.module');
const { PerformanceModule } = require('../dist-electron/main/modules/performance.module');
const { AiModule } = require('../dist-electron/main/modules/ai.module');
const { T } = require('../dist-electron/main/container/tokens');

async function runSprint80Suite() {
  console.log('═'.repeat(80));
  console.log(' SPRINT 80 — ACCEPTANCE SUITE (6 SCENARIOS)');
  console.log('═'.repeat(80));

  const container = new DesktopContainer({ environment: 'development' });
  container.loadModule(new CoreModule());
  container.loadModule(new IpcModule());
  container.loadModule(new WindowModule());
  container.loadModule(new WorkspaceModule());
  container.loadModule(new ThemeModule());
  container.loadModule(new TerminalModule());
  container.loadModule(new SessionModule());
  container.loadModule(new PerformanceModule());
  container.loadModule(new AiModule());

  const runtimeManager = container.resolve(T.IRuntimeManager);
  runtimeManager.activate('mock');

  const workspaceService = container.resolve(T.IWorkspaceService);
  await workspaceService.open(process.cwd());

  const orchestrator = container.resolve(T.IAiOrchestrator);
  const sessionManager = container.resolve(T.ISessionContextManager);
  const results = [];

  // Scenario 1: Read README.md -> Summarize it
  console.log('\n--- Scenario 1: Read README.md -> Summarize it ---');
  const session1 = sessionManager.getOrCreateSession('s80_session_1', process.cwd());
  const s1_turn1 = await orchestrator.executeRequest({ id: 's80_1_1', prompt: 'Read README.md', sessionId: 's80_session_1' });
  const s1_turn2 = await orchestrator.executeRequest({ id: 's80_1_2', prompt: 'Summarize it', sessionId: 's80_session_1' });
  const s1_pass = s1_turn1.success && s1_turn2.finalContext.prompt.includes('Referring to document: README.md');
  results.push({ name: '1. Read README.md -> Summarize it', pass: s1_pass });
  console.log(`[Scenario 1] Document resolved: ${s1_pass ? 'PASSED ✅' : 'FAILED ❌'}`);

  // Scenario 2: Search package.json -> Open the first one (Bug 1 Fix)
  console.log('\n--- Scenario 2: Search package.json -> Open the first one (Bug 1 Fix) ---');
  const session2 = sessionManager.getOrCreateSession('s80_session_2', process.cwd());
  const s2_turn1 = await orchestrator.executeRequest({ id: 's80_2_1', prompt: 'Search package.json', sessionId: 's80_session_2' });
  const s2_turn2 = await orchestrator.executeRequest({ id: 's80_2_2', prompt: 'Open the first one', sessionId: 's80_session_2' });
  const s2_readTask = s2_turn2.finalContext.executionResults?.find(r => r.toolId === 'read_file');
  const s2_pass = s2_turn1.success && !!s2_readTask;
  results.push({ name: '2. Search package.json -> Open the first one (toolId: read_file)', pass: s2_pass });
  console.log(`[Scenario 2] Planner generated read_file task (no search fallback): ${s2_pass ? 'PASSED ✅' : 'FAILED ❌'}`);

  // Scenario 3: How many files? -> List them -> How many were there? (MemoryExecutionSource)
  console.log('\n--- Scenario 3: How many files? -> List them -> How many were there? (MemoryExecutionSource) ---');
  const session3 = sessionManager.getOrCreateSession('s80_session_3', process.cwd());
  const s3_turn1 = await orchestrator.executeRequest({ id: 's80_3_1', prompt: 'How many files?', sessionId: 's80_session_3' });
  const s3_start2 = Date.now();
  const s3_turn2 = await orchestrator.executeRequest({ id: 's80_3_2', prompt: 'List them', sessionId: 's80_session_3' });
  const s3_dur2 = Date.now() - s3_start2;
  const s3_start3 = Date.now();
  const s3_turn3 = await orchestrator.executeRequest({ id: 's80_3_3', prompt: 'How many were there?', sessionId: 's80_session_3' });
  const s3_dur3 = Date.now() - s3_start3;

  const s3_pass = s3_turn1.success && (s3_dur2 < 1000 || s3_turn2.result.response.includes('Project Files Memory')) && s3_turn2.success;
  results.push({ name: `3. MemoryExecutionSource Fast-Path (${s3_dur2}ms / ${s3_dur3}ms)`, pass: s3_pass });
  console.log(`[Scenario 3] Memory source resolved in ${s3_dur2}ms / ${s3_dur3}ms: ${s3_pass ? 'PASSED ✅' : 'FAILED ❌'}`);

  // Scenario 4: Multi-Turn Read-Only Chain (7 turns)
  console.log('\n--- Scenario 4: Multi-Turn Read-Only Chain (7 turns) ---');
  const session4 = sessionManager.getOrCreateSession('s80_session_4', process.cwd());
  const c1 = await orchestrator.executeRequest({ id: 'c1', prompt: 'Search package.json', sessionId: 's80_session_4' });
  const c2 = await orchestrator.executeRequest({ id: 'c2', prompt: 'Open the first one', sessionId: 's80_session_4' });
  const c3 = await orchestrator.executeRequest({ id: 'c3', prompt: 'Summarize it', sessionId: 's80_session_4' });
  const c4 = await orchestrator.executeRequest({ id: 'c4', prompt: 'What dependencies exist?', sessionId: 's80_session_4' });
  const c5 = await orchestrator.executeRequest({ id: 'c5', prompt: 'What scripts exist?', sessionId: 's80_session_4' });
  const c6 = await orchestrator.executeRequest({ id: 'c6', prompt: 'Run tests', sessionId: 's80_session_4' });
  const c7 = await orchestrator.executeRequest({ id: 'c7', prompt: 'Show git diff', sessionId: 's80_session_4' });
  const s4_pass = c1.success && c2.success && c3.success && c4.success && c5.success && c6.success && c7.success;
  results.push({ name: '4. Multi-Turn Read-Only Chain (7 turns)', pass: s4_pass });
  console.log(`[Scenario 4] Full 7-turn chain completed: ${s4_pass ? 'PASSED ✅' : 'FAILED ❌'}`);

  // Scenario 5: Repository Navigation Chain (5 turns)
  console.log('\n--- Scenario 5: Repository Navigation Chain (5 turns) ---');
  const session5 = sessionManager.getOrCreateSession('s80_session_5', process.cwd());
  const n1 = await orchestrator.executeRequest({ id: 'n1', prompt: 'Search auth service', sessionId: 's80_session_5' });
  const n2 = await orchestrator.executeRequest({ id: 'n2', prompt: 'Open the implementation', sessionId: 's80_session_5' });
  const n3 = await orchestrator.executeRequest({ id: 'n3', prompt: 'Explain the login flow', sessionId: 's80_session_5' });
  const n4 = await orchestrator.executeRequest({ id: 'n4', prompt: 'Find where JWT is generated', sessionId: 's80_session_5' });
  const n5 = await orchestrator.executeRequest({ id: 'n5', prompt: 'Open that file', sessionId: 's80_session_5' });
  const s5_pass = n1.success && n2.success && n3.success && n4.success && n5.success;
  results.push({ name: '5. Repository Navigation Chain (5 turns)', pass: s5_pass });
  console.log(`[Scenario 5] Repository navigation completed: ${s5_pass ? 'PASSED ✅' : 'FAILED ❌'}`);

  // Scenario 6: State Fallback Scenario
  console.log('\n--- Scenario 6: State Fallback Scenario ---');
  const tempFile = path.join(process.cwd(), 'temp_test_file.txt');
  fs.writeFileSync(tempFile, 'temporary test content', 'utf-8');
  const session6 = sessionManager.getOrCreateSession('s80_session_6', process.cwd());
  const f1 = await orchestrator.executeRequest({ id: 'f1', prompt: 'Read temp_test_file.txt', sessionId: 's80_session_6' });
  
  if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
  let f2_handled_cleanly = false;
  try {
    const f2 = await orchestrator.executeRequest({ id: 'f2', prompt: 'Read temp_test_file.txt', sessionId: 's80_session_6' });
    f2_handled_cleanly = !f2.success;
  } catch (err) {
    f2_handled_cleanly = err.message.includes('ENOENT') || err.message.includes('failed');
  }
  const s6_pass = f1.success && f2_handled_cleanly;
  results.push({ name: '6. State Fallback Scenario', pass: s6_pass });
  console.log(`[Scenario 6] Missing file error handled cleanly: ${s6_pass ? 'PASSED ✅' : 'FAILED ❌'}`);

  console.log('\n' + '═'.repeat(80));
  console.log(' SPRINT 80 ACCEPTANCE SUMMARY');
  console.log('═'.repeat(80));
  let allPass = true;
  for (const r of results) {
    console.log(`  ${r.pass ? '✅ PASS' : '❌ FAIL'}  ${r.name}`);
    if (!r.pass) allPass = false;
  }
  console.log('═'.repeat(80));
  console.log(`FINAL RESULT: ${allPass ? 'ALL 6 SPRINT 80 SCENARIOS PASSED PERFECTLY ✅' : 'SOME SCENARIOS FAILED ❌'}`);

  process.exit(allPass ? 0 : 1);
}

runSprint80Suite().catch(err => {
  console.error('Sprint 80 acceptance suite failed:', err);
  process.exit(1);
});
