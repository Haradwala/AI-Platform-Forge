/**
 * cli-runtime.ts — Phase 19 Generic CLI Runtime
 *
 * Generic CLI Runtime executing ANY CLI-based AI agent via pluggable CLIAdapters.
 */
import { EventEmitter } from 'events';
import type { IAiRuntime, RuntimeHealth, RuntimeType } from '../runtime/runtime-types';
import type { IAiTokenStream } from '../../container/service-interfaces';
import type { CLIAdapter } from './cli-adapter';
import { CLIGenericSession } from './cli-session';
import { type DiscoveredCLIResult } from './cli-discovery';
export declare class GenericCLIRuntime extends EventEmitter implements IAiRuntime {
    readonly id: string;
    readonly name: string;
    readonly runtimeType: RuntimeType;
    private adapter;
    private externalRuntime;
    private currentSession;
    private discovery;
    constructor(adapter: CLIAdapter);
    generateStream(prompt: string, context?: any, signal?: AbortSignal): Promise<IAiTokenStream>;
    listAvailableModels(): Promise<string[]>;
    initialize(): Promise<void>;
    start(options?: Record<string, unknown>): Promise<void>;
    stop(): Promise<void>;
    restart(options?: Record<string, unknown>): Promise<void>;
    send(prompt: string, options?: Record<string, unknown>): Promise<void>;
    cancel(): void;
    resume(sessionId: string): Promise<void>;
    healthCheck(): Promise<RuntimeHealth>;
    discover(): Promise<DiscoveredCLIResult>;
    getAdapter(): CLIAdapter;
    getCurrentSession(): CLIGenericSession | null;
}
