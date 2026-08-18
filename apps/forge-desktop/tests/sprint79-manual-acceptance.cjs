/**
 * Sprint 79 — Manual Acceptance Verification Script
 * Tests all 7 Scenarios in the Engineering Acceptance Matrix:
 * 
 * Scenario 1: "How many files?" -> "List them"
 * Scenario 2: "Read README.md" -> "Summarize it"
 * Scenario 3: "Search package.json" -> "What dependencies does it have?"
 * Scenario 4: "Run tests" -> Dynamic Terminal Command Execution
 * Scenario 5: "Search main.ts" -> File Search
 * Scenario 6: "How many files?" -> Fast-Path Latency (<500ms)
 * Scenario 7: 5-step end-to-end chain:
 *            "Search package.json" -> "Open the first one" -> "Summarize it" ->
 *            "What scripts does it define?" -> "Run the test script"
 */

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

async function runAcceptanceSuite() {
  console.log('═'.repeat(80));
  console.log(' SPRINT 79 — MANUAL ACCEPTANCE SUITE (7 SCENARIOS)');
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
  const results = [];

  // Scenario 1: How many files? -> List them
  console.log('\n--- Scenario 1: How many files? -> List them ---');
  const sessionManager = container.resolve(T.ISessionContextManager);
  const session1 = sessionManager.getOrCreateSession('session_s1', process.cwd());
  const s1_turn1 = await orchestrator.executeRequest({ id: 's1_1', prompt: 'How many files?' });
  const s1_turn2 = await orchestrator.executeRequest({ id: 's1_2', prompt: 'List them' });
  const s1_pass = s1_turn2.finalContext.prompt.includes('Referring to previously found files') ||
                  s1_turn2.result.response.includes('Matching files');
  results.push({ name: '1. How many files? -> List them', pass: s1_pass });
  console.log(`[Scenario 1] Pronoun "them" resolved: ${s1_pass ? 'PASSED ✅' : 'FAILED ❌'}`);

  // Scenario 2: Read README.md -> Summarize it
  console.log('\n--- Scenario 2: Read README.md -> Summarize it ---');
  const session2 = sessionManager.getOrCreateSession('session_s2', process.cwd());
  const s2_turn1 = await orchestrator.executeRequest({ id: 's2_1', prompt: 'Read README.md' });
  const s2_turn2 = await orchestrator.executeRequest({ id: 's2_2', prompt: 'Summarize it' });
  const s2_pass = s2_turn1.success && s2_turn2.finalContext.prompt.includes('Referring to document: README.md');
  results.push({ name: '2. Read README.md -> Summarize it', pass: s2_pass });
  console.log(`[Scenario 2] Document "it" resolved to README.md: ${s2_pass ? 'PASSED ✅' : 'FAILED ❌'}`);

  // Scenario 3: Search package.json -> What dependencies does it have?
  console.log('\n--- Scenario 3: Search package.json -> What dependencies does it have? ---');
  const session3 = sessionManager.getOrCreateSession('session_s3', process.cwd());
  const s3_turn1 = await orchestrator.executeRequest({ id: 's3_1', prompt: 'Search package.json' });
  const s3_turn2 = await orchestrator.executeRequest({ id: 's3_2', prompt: 'What dependencies does it have?' });
  console.log(`[Scenario 3 DEBUG] s3_turn2 prompt: "${s3_turn2.finalContext.prompt}"`);
  const s3_pass = s3_turn1.success && s3_turn2.finalContext.prompt.toLowerCase().includes('package.json');
  results.push({ name: '3. Search package.json -> What dependencies?', pass: s3_pass });
  console.log(`[Scenario 3] Search results preserved across turns: ${s3_pass ? 'PASSED ✅' : 'FAILED ❌'}`);

  // Scenario 4: Run tests (Terminal Tool Invocation)
  console.log('\n--- Scenario 4: Run tests ---');
  const session4 = sessionManager.getOrCreateSession('session_s4', process.cwd());
  const s4_turn1 = await orchestrator.executeRequest({ id: 's4_1', prompt: 'Run tests' });
  const s4_task = s4_turn1.finalContext.executionResults.find(r => r.toolId === 'run_terminal_command');
  const s4_pass = !!s4_task;
  results.push({ name: '4. Run tests (Terminal Tool)', pass: s4_pass });
  console.log(`[Scenario 4] Terminal tool invoked for "Run tests": ${s4_pass ? 'PASSED ✅' : 'FAILED ❌'}`);

  // Scenario 5: Search main.ts
  console.log('\n--- Scenario 5: Search main.ts ---');
  const session5 = sessionManager.getOrCreateSession('session_s5', process.cwd());
  const s5_turn1 = await orchestrator.executeRequest({ id: 's5_1', prompt: 'Search main.ts' });
  const s5_pass = s5_turn1.success && s5_turn1.finalContext.executionResults.length > 0;
  results.push({ name: '5. Search main.ts', pass: s5_pass });
  console.log(`[Scenario 5] File search completed: ${s5_pass ? 'PASSED ✅' : 'FAILED ❌'}`);

  // Scenario 6: Fast-Path Latency (<500ms)
  console.log('\n--- Scenario 6: Fast-Path Latency (<500ms) ---');
  const session6 = sessionManager.getOrCreateSession('session_s6', process.cwd());
  const s6_start = Date.now();
  const s6_turn1 = await orchestrator.executeRequest({ id: 's6_1', prompt: 'How many files?' });
  const s6_elapsed = s6_turn1.result.metadata?.timing?.totalMs ?? (Date.now() - s6_start);
  const s6_pass = s6_elapsed < 500 && s6_turn1.result.metadata?.timing?.fastPathUsed === true;
  results.push({ name: `6. Fast-Path Latency (${s6_elapsed}ms < 500ms)`, pass: s6_pass });
  console.log(`[Scenario 6] Fast-path returned in ${s6_elapsed}ms: ${s6_pass ? 'PASSED ✅' : 'FAILED ❌'}`);

  // Scenario 7: 5-Step End-to-End Chain
  console.log('\n--- Scenario 7: 5-Step End-to-End Chain ---');
  const session7 = sessionManager.getOrCreateSession('session_s7', process.cwd());
  const c1 = await orchestrator.executeRequest({ id: 'c1', prompt: 'Search package.json' });
  const c2 = await orchestrator.executeRequest({ id: 'c2', prompt: 'Open the first one' });
  const c3 = await orchestrator.executeRequest({ id: 'c3', prompt: 'Summarize it' });
  const c4 = await orchestrator.executeRequest({ id: 'c4', prompt: 'What scripts does it define?' });
  const c5 = await orchestrator.executeRequest({ id: 'c5', prompt: 'Run the test script' });
  
  const c5_terminal = c5.finalContext.executionResults.find(r => r.toolId === 'run_terminal_command');
  const s7_pass = c1.success && c2.success && c3.success && c4.success && !!c5_terminal;
  results.push({ name: '7. 5-Step End-to-End Chain', pass: s7_pass });
  console.log(`[Scenario 7] 5-step chain resolved terminal command: ${s7_pass ? 'PASSED ✅' : 'FAILED ❌'}`);

  console.log('\n' + '═'.repeat(80));
  console.log(' SUMMARY OF ACCEPTANCE RESULTS');
  console.log('═'.repeat(80));
  let allPass = true;
  for (const r of results) {
    console.log(`  ${r.pass ? '✅ PASS' : '❌ FAIL'}  ${r.name}`);
    if (!r.pass) allPass = false;
  }
  console.log('═'.repeat(80));
  console.log(`FINAL RESULT: ${allPass ? 'ALL 7 SCENARIOS PASSED PERFECTLY ✅' : 'SOME SCENARIOS FAILED ❌'}`);

  process.exit(allPass ? 0 : 1);
}

runAcceptanceSuite().catch(err => {
  console.error('Acceptance suite failed:', err);
  process.exit(1);
});
