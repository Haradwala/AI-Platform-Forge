/**
 * cli-runtime.ts — Phase 19 Generic CLI Runtime
 *
 * Generic CLI Runtime executing ANY CLI-based AI agent via pluggable CLIAdapters.
 */

import { EventEmitter } from 'events';
import type { IAiRuntime, RuntimeHealth, RuntimeType } from '../runtime/runtime-types';
import type { IAiTokenStream, IAiModel } from '../../container/service-interfaces';
import type { CLIAdapter } from './cli-adapter';
import { ExternalRuntime } from '../external/external-runtime';
import { CLIGenericSession } from './cli-session';
import { CLIDiscovery, type DiscoveredCLIResult } from './cli-discovery';
import { LaunchError } from './cli-errors';

class CLITokenStream implements IAiTokenStream {
  private tokenCallbacks: Array<(token: string) => void> = [];
  private completeCallbacks: Array<(fullText: string) => void> = [];
  private errorCallbacks: Array<(err: Error) => void> = [];
  private isCancelled = false;

  onToken(callback: (token: string) => void): this {
    this.tokenCallbacks.push(callback);
    return this;
  }

  onComplete(callback: (fullText: string) => void): this {
    this.completeCallbacks.push(callback);
    return this;
  }

  onError(callback: (err: Error) => void): this {
    this.errorCallbacks.push(callback);
    return this;
  }

  cancel(): void {
    this.isCancelled = true;
  }

  emitToken(token: string): void {
    if (this.isCancelled) return;
    for (const cb of this.tokenCallbacks) {
      cb(token);
    }
  }

  emitComplete(fullText: string): void {
    if (this.isCancelled) return;
    for (const cb of this.completeCallbacks) {
      cb(fullText);
    }
  }

  emitError(err: Error): void {
    if (this.isCancelled) return;
    for (const cb of this.errorCallbacks) {
      cb(err);
    }
  }
}

export class GenericCLIRuntime extends EventEmitter implements IAiRuntime {
  readonly id: string;
  readonly name: string;
  readonly runtimeType: RuntimeType = 'cli';

  private adapter: CLIAdapter;
  private externalRuntime: ExternalRuntime | null = null;
  private currentSession: CLIGenericSession | null = null;
  private discovery: CLIDiscovery;

  constructor(adapter: CLIAdapter) {
    super();
    this.adapter = adapter;
    this.id = adapter.id;
    this.name = adapter.name;
    this.discovery = new CLIDiscovery();
  }

  // ─── IAiProvider Interface ──────────────────────────────────────────────────

  async generateStream(prompt: string, context?: any, signal?: AbortSignal): Promise<IAiTokenStream> {
    const stream = new CLITokenStream();
    let accumulatedText = '';

    if (signal) {
      signal.addEventListener('abort', () => {
        stream.cancel();
        this.cancel();
      });
    }

    if (!this.externalRuntime) {
      await this.start(context);
    }

    const onStreamEvent = (evt: any) => {
      if (evt.type === 'token' && evt.payload?.text) {
        accumulatedText += evt.payload.text;
        stream.emitToken(evt.payload.text);
      }
    };

    this.externalRuntime?.on('stream-event', onStreamEvent);

    this.send(prompt, context)
      .then(() => {
        stream.emitComplete(accumulatedText);
      })
      .catch((err) => {
        stream.emitError(err instanceof Error ? err : new Error(String(err)));
      });

    return stream;
  }

  async listAvailableModels(): Promise<string[]> {
    return [`${this.id}-default`];
  }

  // ─── Lifecycle APIs ────────────────────────────────────────────────────────

  async initialize(): Promise<void> {
    const isInstalled = await this.adapter.detect();
    if (!isInstalled) {
      throw new LaunchError(`CLI Agent "${this.name}" is not installed on system.`);
    }

    this.currentSession = new CLIGenericSession({
      sessionId: `cli_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      runtimeId: this.id,
      adapterId: this.adapter.id,
      workspace: process.cwd(),
    });
    this.currentSession.setState('starting');
  }

  async start(options?: Record<string, unknown>): Promise<void> {
    if (!this.currentSession) {
      await this.initialize();
    }

    const cmd = this.adapter.command();
    const args = this.adapter.arguments('', options);
    const env = this.adapter.environment(options);
    const cwd = this.adapter.workingDirectory(options);

    this.externalRuntime = new ExternalRuntime({
      id: this.id,
      name: this.name,
      command: cmd,
      args,
      mode: 'cli',
      transport: 'stdio',
      cwd,
      env,
    });

    await this.externalRuntime.start();
    this.currentSession?.setState('running');
  }

  async stop(): Promise<void> {
    if (this.externalRuntime) {
      await this.externalRuntime.stop();
      this.externalRuntime = null;
    }
    this.currentSession?.setState('stopped');
  }

  async restart(options?: Record<string, unknown>): Promise<void> {
    await this.stop();
    await this.start(options);
  }

  async send(prompt: string, options?: Record<string, unknown>): Promise<void> {
    if (!this.externalRuntime) {
      await this.start(options);
    }
    const args = this.adapter.arguments(prompt, options);
    const promptText = args.join(' ') || prompt;
    await this.externalRuntime?.send(promptText);
  }

  cancel(): void {
    if (this.externalRuntime) {
      this.externalRuntime.cancel();
    }
  }

  async resume(sessionId: string): Promise<void> {
    if (this.adapter.supportsResume()) {
      await this.start({ resumeSessionId: sessionId });
    }
  }

  async healthCheck(): Promise<RuntimeHealth> {
    const isHealthy = await this.adapter.detect();
    return {
      healthy: isHealthy,
      latencyMs: isHealthy ? 15 : -1,
      error: isHealthy ? undefined : `CLI Agent "${this.name}" binary not detected.`,
    };
  }

  async discover(): Promise<DiscoveredCLIResult> {
    return this.discovery.discoverAgent(this.id, this.adapter.command());
  }

  getAdapter(): CLIAdapter {
    return this.adapter;
  }

  getCurrentSession(): CLIGenericSession | null {
    return this.currentSession;
  }
}
