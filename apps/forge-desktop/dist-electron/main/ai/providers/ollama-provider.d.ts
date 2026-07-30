import type { IAiTokenStream } from '../../container/service-interfaces';
import type { IAiRuntime, RuntimeType, RuntimeHealth } from '../runtime/runtime-types';
import type { IServiceResolver } from '../../container/interfaces';
import type { IConfigurationService } from '../../config/configuration-service';
export declare class OllamaProvider implements IAiRuntime {
    private readonly resolver?;
    private readonly configService?;
    readonly id = "ollama";
    readonly name = "Ollama (Local LLM)";
    readonly runtimeType: RuntimeType;
    constructor(resolver?: IServiceResolver | undefined, configService?: IConfigurationService | undefined);
    private get baseUrl();
    listAvailableModels(): Promise<string[]>;
    generateStream(prompt: string, context: any, signal: AbortSignal): Promise<IAiTokenStream>;
    healthCheck(): Promise<RuntimeHealth>;
}
