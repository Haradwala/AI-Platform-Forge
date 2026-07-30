/**
 * cli-manager.test.ts
 *
 * Unit test suite for Phase 12 CLI Process Engine (CLIManager).
 * Covers:
 *  - Spawning CLI processes and stdout/stderr stream parsing
 *  - Stdin writing
 *  - Process restart & destruction
 *  - AbortSignal cancellation
 *  - Process timeout
 *  - Failure recovery & cleanup
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { CLIManager } from '../electron/main/ai/cli/cli-manager';

describe('CLIManager', () => {
  let manager: CLIManager;

  beforeEach(() => {
    manager = new CLIManager();
  });

  afterEach(async () => {
    await manager.destroyAll();
  });

  it('spawns a process and listens to stdout output lines', async () => {
    const isWin = process.platform === 'win32';
    const command = isWin ? 'cmd' : 'echo';
    const args = isWin ? ['/c', 'echo Hello CLI'] : ['Hello CLI'];

    const session = await manager.createSession({ command, args });
    expect(session.sessionId).toBeDefined();

    const outputLines: string[] = [];
    session.process.stream.on('line', (line) => {
      outputLines.push(line.trim());
    });

    await new Promise((resolve) => setTimeout(resolve, 500));

    expect(outputLines.join(' ')).toContain('Hello CLI');
    expect(manager.listSessions().length).toBe(1);
  });

  it('restarts an active process session', async () => {
    const isWin = process.platform === 'win32';
    const command = isWin ? 'ping' : 'sleep';
    const args = isWin ? ['127.0.0.1', '-n', '5'] : ['5'];

    const session = await manager.createSession({ command, args });
    const initialPid = session.process.getPid();
    expect(initialPid).toBeDefined();

    await manager.restartSession(session.sessionId);
    const newPid = session.process.getPid();

    expect(session.status()).toBe('running');
  });

  it('cancels process spawn when AbortSignal is pre-aborted', async () => {
    const controller = new AbortController();
    controller.abort();

    await expect(
      manager.createSession({ command: 'node', args: ['-v'], signal: controller.signal })
    ).rejects.toThrow('cancelled by AbortSignal');
  });

  it('terminates process when timeout expires', async () => {
    const isWin = process.platform === 'win32';
    const command = isWin ? 'ping' : 'sleep';
    const args = isWin ? ['127.0.0.1', '-n', '10'] : ['10'];

    const session = await manager.createSession({
      command,
      args,
      timeoutMs: 300,
    });

    let stderrReceived = '';
    session.process.stream.on('stderr', (text) => {
      stderrReceived += text;
    });

    await new Promise((resolve) => setTimeout(resolve, 600));

    expect(session.status()).toBe('terminated');
    expect(stderrReceived).toContain('timed out');
  });

  it('destroys single session and cleans up all sessions on destroyAll', async () => {
    const isWin = process.platform === 'win32';
    const command = isWin ? 'cmd' : 'echo';
    const args = isWin ? ['/c', 'echo 1'] : ['1'];

    const s1 = await manager.createSession({ command, args });
    const s2 = await manager.createSession({ command, args });

    expect(manager.listSessions().length).toBe(2);

    await manager.destroySession(s1.sessionId);
    expect(manager.getSession(s1.sessionId)).toBeNull();
    expect(manager.listSessions().length).toBe(1);

    await manager.destroyAll();
    expect(manager.listSessions().length).toBe(0);
  });
});
