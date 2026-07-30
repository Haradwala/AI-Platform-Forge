import type { IToolRegistry, ITool, IToolDefinition } from '../../container/service-interfaces';

export class ToolRegistry implements IToolRegistry {
  private readonly tools = new Map<string, ITool<any, any>>();

  register(tool: ITool<any, any>): void {
    this.tools.set(tool.id, tool);
  }

  getById(id: string): ITool<any, any> | null {
    return this.tools.get(id) || null;
  }

  getAll(): IToolDefinition[] {
    return Array.from(this.tools.values()).map(t => ({
      id: t.id,
      description: t.description,
      inputSchema: t.inputSchema,
      outputSchema: t.outputSchema
    }));
  }

  async execute<TInput = any, TOutput = any>(id: string, input: TInput): Promise<TOutput> {
    const tool = this.getById(id);
    if (!tool) {
      throw new Error(`Tool with ID "${id}" is not registered in the system.`);
    }
    return await tool.execute(input) as TOutput;
  }
}
