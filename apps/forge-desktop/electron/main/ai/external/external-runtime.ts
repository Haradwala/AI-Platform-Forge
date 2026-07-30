/**
 * external-runtime.ts — Phase 18 External Runtime Foundation
 *
 * Base ExternalRuntime implementing lifecycle management and satisfying IAiRuntime / IAiProvider.
 */

import { EventEmitter } from 'events';
import type { IAiRuntime, RuntimeHealth, RuntimeType } from '../runtime/runtime-types';
import type { IAiTokenStream } from '../../container/service-interfaces';
import type { ExternalRuntimeConfig, ExternalRuntimeState, NormalizedStreamEvent } from './external-types';
import { ExternalEnvironment } from './external-environment';
import { ExternalProcess } from './external-process';
import { ExternalSession } from './external-session';
import { ExternalStreamParser } from './external-stream-parser';

export class ExternalRuntime extends EventEmitter implements IAiRuntime {
  readonly id: string;
  readonly name: string;
  readonly runtimeType: RuntimeType;

  private config: ExternalRuntimeConfig;
  private state: ExternalRuntimeState = 'uninitialized';
  private env: ExternalEnvironment;
  private process: ExternalProcess | null = null;
  private currentSession: ExternalSession | null = null;
  private parser: ExternalStreamParser;

  constructor(config: ExternalRuntimeConfig) {
    super();
    this.config = config;
    this.id = config.id;
    this.name = config.name;
    this.runtimeType = config.mode === 'cli' ? 'cli' : config.mode === 'mcp' ? 'mcp' : 'local';
    this.env = new ExternalEnvironment(config.cwd, config.env);
    this.parser = new ExternalStreamParser();

    this.parser.on('event', (evt: NormalizedStreamEvent) => {
      if (this.currentSession && evt.payload.text) {
        this.currentSession.appendLog(evt.payload.text);
      }
      this.emit('stream-event', evt);
    });
  }

  // ─── IAiProvider Interface ──────────────────────────────────────────────────

  async generateStream(prompt: string): Promise<IAiTokenStream> {
    const tokenCbs: Array<(token: string) => void> = [];
    const completeCbs: Array<(fullText: string) => void> = [];
    const errorCbs: Array<(err: Error) => void> = [];
    let fullOutput = '';
    let cancelled = false;

    const stream: IAiTokenStream = {
      onToken: (cb) => { tokenCbs.push(cb); return stream; },
      onComplete: (cb) => { completeCbs.push(cb); return stream; },
      onError: (cb) => { errorCbs.push(cb); return stream; },
      cancel: () => {
        cancelled = true;
        this.cancel();
      },
    };

    if (this.state !== 'running') {
      await this.start();
    }

    const onToken = (evt: NormalizedStreamEvent) => {
      if (cancelled) return;
      if (evt.type === 'token' && evt.payload.text) {
        fullOutput += evt.payload.text;
        tokenCbs.forEach((cb) => cb(evt.payload.text!));
      }
    };

    const onComplete = () => {
      if (cancelled) return;
      this.parser.off('token', onToken);
      this.parser.off('complete', onComplete);
      completeCbs.forEach((cb) => cb(fullOutput));
    };

    this.parser.on('token', onToken);
    this.parser.on('complete', onComplete);

    this.send(prompt).catch((err) => {
      errorCbs.forEach((cb) => cb(err instanceof Error ? err : new Error(String(err))));
    });

    return stream;
  }

  async listAvailableModels(): Promise<string[]> {
    return [`${this.id}-default`];
  }

  // ─── Lifecycle APIs ────────────────────────────────────────────────────────

  async initialize(): Promise<void> {
    this.state = 'starting';
    this.currentSession = new ExternalSession({
      sessionId: `sess_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      workspaceRoot: this.env.getWorkingDirectory(),
      runtimeId: this.id,
    });
    this.currentSession.setState('starting');
  }

  async start(): Promise<void> {
    if (this.state === 'uninitialized') {
      await this.initialize();
    }

    if (this.process && this.process.isRunning()) {
      return; // Already running
    }

    this.process = new ExternalProcess({
      command: this.config.command,
      args: this.config.args || [],
      cwd: this.env.getWorkingDirectory(),
      env: this.env.getMergedEnvironment(),
      usePty: this.config.usePty,
    });

    this.process.on('stdout', (data: string) => {
      this.parser.writeChunk(data);
    });

    this.process.on('stderr', (data: string) => {
      this.parser.writeChunk(data);
    });

    this.process.on('exit', ({ code }) => {
      this.state = code === 0 ? 'stopped' : 'error';
      if (this.currentSession) {
        this.currentSession.setState(this.state);
      }
      this.parser.flush();
      this.emit('state-changed', this.state);
    });

    this.process.spawnProcess();
    const pid = this.process.getPid();
    if (pid && this.currentSession) {
      this.currentSession.setProcessId(pid);
    }

    this.state = 'running';
    if (this.currentSession) {
      this.currentSession.setState('running');
    }
    this.emit('state-changed', this.state);
  }

  async stop(): Promise<void> {
    this.state = 'stopping';
    if (this.process) {
      this.process.kill('SIGTERM');
    }
    this.state = 'stopped';
    if (this.currentSession) {
      this.currentSession.setState('stopped');
    }
    this.emit('state-changed', this.state);
  }

  async restart(): Promise<void> {
    await this.stop();
    await this.start();
  }

  async dispose(): Promise<void> {
    await this.stop();
    if (this.process) {
      this.process.dispose();
      this.process = null;
    }
    this.env.dispose();
    this.state = 'stopped';
    this.removeAllListeners();
  }

  async healthCheck(): Promise<RuntimeHealth> {
    const isRunning = this.process !== null && this.process.isRunning();
    return {
      healthy: isRunning || this.state !== 'error',
      latencyMs: isRunning ? 12 : -1,
      error: this.state === 'error' ? 'External process error exit' : undefined,
    };
  }

  supportsStreaming(): boolean {
    return true;
  }

  async send(prompt: string): Promise<void> {
    if (!this.process || !this.process.isRunning()) {
      await this.start();
    }
    this.process?.writeStdin(prompt + '\n');
  }

  cancel(): void {
    if (this.process && this.process.isRunning()) {
      this.process.kill('SIGINT');
    }
  }

  getState(): ExternalRuntimeState {
    return this.state;
  }

  getCurrentSession(): ExternalSession | null {
    return this.currentSession;
  }
}
