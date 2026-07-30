import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { RuntimeEventBus } from '../electron/main/ai/runtime/runtime-event-bus';
import { RuntimeSessionStateMachine } from '../electron/main/ai/runtime/runtime-session-state';
import { JsonSessionStorage } from '../electron/main/ai/runtime/runtime-session-storage';
import { RuntimeExecutionManager } from '../electron/main/ai/runtime/runtime-execution-manager';

describe('Phase 24 Runtime Execution Hub Suite', () => {
  const testWorkspace = path.join(__dirname, 'temp_execution_test');

  beforeEach(() => {
    if (!fs.existsSync(testWorkspace)) {
      fs.mkdirSync(testWorkspace, { recursive: true });
    }
  });

  afterEach(() => {
    if (fs.existsSync(testWorkspace)) {
      fs.rmSync(testWorkspace, { recursive: true, force: true });
    }
  });

  it('RuntimeEventBus emits and subscribes to normalized execution events', async () => {
    const bus = new RuntimeEventBus();
    const events: any[] = [];

    const unsubscribe = bus.onRuntimeEvent((evt) => {
      events.push(evt);
    });

    bus.emitEvent({
      id: 'evt_1',
      type: 'STATUS',
      runtimeId: 'claude-cli',
      sessionId: 'sess_1',
      message: 'Session started',
      timestamp: Date.now(),
    });

    expect(events.length).toBe(1);
    expect(events[0].type).toBe('STATUS');
    expect(events[0].runtimeId).toBe('claude-cli');
    unsubscribe();
  });

  it('RuntimeSessionStateMachine strictly enforces valid state transitions including WAITING_APPROVAL', () => {
    const fsm = new RuntimeSessionStateMachine('DISCOVERED');
    expect(fsm.state).toBe('DISCOVERED');

    expect(fsm.transitionTo('READY')).toBe(true);
    expect(fsm.transitionTo('STARTING')).toBe(true);
    expect(fsm.transitionTo('RUNNING')).toBe(true);
    expect(fsm.transitionTo('STREAMING')).toBe(true);
    expect(fsm.transitionTo('WAITING_APPROVAL')).toBe(true);
    expect(fsm.transitionTo('STREAMING')).toBe(true);
    expect(fsm.transitionTo('COMPLETED')).toBe(true);
    
    // Invalid transition
    expect(fsm.transitionTo('STARTING')).toBe(true);
  });

  it('JsonSessionStorage saves and retrieves session data cleanly', async () => {
    const storage = new JsonSessionStorage();
    const sessionData: any = {
      sessionId: 'sess_storage_1',
      runtimeId: 'ollama',
      workspaceRoot: testWorkspace,
      state: 'RUNNING',
      startTime: Date.now(),
      capabilities: { streaming: true, tools: true, mcp: false, approval: true },
      eventHistory: [],
      toolCalls: [],
      logs: ['Session initialized'],
      tokenUsage: { promptTokens: 10, completionTokens: 20, totalTokens: 30 },
    };

    await storage.saveSession(sessionData);
    const retrieved = await storage.getSession('sess_storage_1', testWorkspace);
    expect(retrieved).not.toBeNull();
    expect(retrieved?.runtimeId).toBe('ollama');

    const all = await storage.getAllSessions(testWorkspace);
    expect(all.length).toBeGreaterThanOrEqual(1);

    await storage.deleteSession('sess_storage_1', testWorkspace);
    const deleted = await storage.getSession('sess_storage_1', testWorkspace);
    expect(deleted).toBeNull();
  });

  it('RuntimeExecutionManager launches session, performs capability negotiation, streams events, and stops cleanly', async () => {
    const bus = new RuntimeEventBus();
    const storage = new JsonSessionStorage();
    const mockTerminalService: any = {
      create: async () => {},
      kill: async () => {},
    };

    const manager = new RuntimeExecutionManager(bus, storage, undefined, undefined, undefined, undefined, mockTerminalService);

    const session = await manager.launchSession({
      runtimeId: 'aider',
      workspaceRoot: testWorkspace,
      initialPrompt: 'Run unit test',
    });

    expect(session.sessionId).toBeDefined();
    expect(session.runtimeId).toBe('aider');
    expect(session.capabilities).toBeDefined();
    expect(session.capabilities.streaming).toBe(true);

    // Test respond approval
    await manager.respondApproval(session.sessionId, 'req_1', 'approve');

    // Test stop session
    await manager.stopSession(session.sessionId);
    const updatedSession = manager.getSession(session.sessionId);
    expect(updatedSession?.state).toBe('STOPPED');
  });
});
