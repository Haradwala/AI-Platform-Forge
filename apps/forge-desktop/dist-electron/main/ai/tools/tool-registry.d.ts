import type { IToolRegistry, ITool, IToolDefinition } from '../../container/service-interfaces';
export declare class ToolRegistry implements IToolRegistry {
    private readonly tools;
    register(tool: ITool<any, any>): void;
    getById(id: string): ITool<any, any> | null;
    getAll(): IToolDefinition[];
    execute<TInput = any, TOutput = any>(id: string, input: TInput): Promise<TOutput>;
}
