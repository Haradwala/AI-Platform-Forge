"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToolRegistry = void 0;
class ToolRegistry {
    tools = new Map();
    register(tool) {
        this.tools.set(tool.id, tool);
    }
    getById(id) {
        return this.tools.get(id) || null;
    }
    getAll() {
        return Array.from(this.tools.values()).map(t => ({
            id: t.id,
            description: t.description,
            inputSchema: t.inputSchema,
            outputSchema: t.outputSchema
        }));
    }
    async execute(id, input) {
        const tool = this.getById(id);
        if (!tool) {
            throw new Error(`Tool with ID "${id}" is not registered in the system.`);
        }
        return await tool.execute(input);
    }
}
exports.ToolRegistry = ToolRegistry;
//# sourceMappingURL=tool-registry.js.map