/**
 * external-runtime.ts — Phase 18 External Runtime Foundation
 *
 * Base ExternalRuntime implementing lifecycle management and satisfying IAiRuntime / IAiProvider.
 */
import { EventEmitter } from 'events';
import type { IAiRuntime, RuntimeHealth, RuntimeType } from '../runtime/runtime-types';
import type { IAiTokenStream } from '../../container/service-interfaces';
import type { ExternalRuntimeConfig, ExternalRuntimeState } from './external-types';
import { ExternalSession } from './external-session';
export declare class ExternalRuntime extends EventEmitter implements IAiRuntime {
    readonly id: string;
    readonly name: string;
    readonly runtimeType: RuntimeType;
    private config;
    private state;
    private env;
    private process;
    private currentSession;
    private parser;
    constructor(config: ExternalRuntimeConfig);
    generateStream(prompt: string): Promise<IAiTokenStream>;
    listAvailableModels(): Promise<string[]>;
    initialize(): Promise<void>;
    start(): Promise<void>;
    stop(): Promise<void>;
    restart(): Promise<void>;
    dispose(): Promise<void>;
    healthCheck(): Promise<RuntimeHealth>;
    supportsStreaming(): boolean;
    send(prompt: string): Promise<void>;
    cancel(): void;
    getState(): ExternalRuntimeState;
    getCurrentSession(): ExternalSession | null;
}
