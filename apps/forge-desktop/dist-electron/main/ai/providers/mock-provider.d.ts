import type { IAiTokenStream } from '../../container/service-interfaces';
import type { IAiRuntime, RuntimeType, RuntimeHealth } from '../runtime/runtime-types';
export declare class MockProvider implements IAiRuntime {
    readonly id = "mock";
    readonly name = "Mock Provider (Offline Mode)";
    readonly runtimeType: RuntimeType;
    listAvailableModels(): Promise<string[]>;
    healthCheck(): Promise<RuntimeHealth>;
    generateStream(prompt: string, context: any, signal: AbortSignal): Promise<IAiTokenStream>;
    private simulateResponse;
}
