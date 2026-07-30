"use strict";
/**
 * intent-analyzer.ts — Phase 25-28 Rich Intent Analysis Engine
 *
 * Converts natural language user prompts and task metadata into structured
 * ExecutionRequest schemas containing required capabilities, priority, complexity,
 * estimated tokens, and context size.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntentAnalyzer = void 0;
class IntentAnalyzer {
    /**
     * Analyzes natural language input and context to produce a structured ExecutionRequest.
     */
    analyze(intentText, workspaceRoot) {
        const text = intentText.toLowerCase();
        const capabilities = ['streaming'];
        // Deducing required capabilities
        if (text.includes('file') || text.includes('edit') || text.includes('write') || text.includes('run') || text.includes('terminal') || text.includes('command')) {
            capabilities.push('tools');
        }
        if (text.includes('image') || text.includes('screenshot') || text.includes('ui') || text.includes('mockup') || text.includes('diagram') || text.includes('vision')) {
            capabilities.push('vision');
            capabilities.push('images');
        }
        if (text.includes('reason') || text.includes('think') || text.includes('architect') || text.includes('math') || text.includes('proof') || text.includes('complex')) {
            capabilities.push('reasoning');
            capabilities.push('thinking');
        }
        if (text.includes('mcp') || text.includes('server') || text.includes('tool server')) {
            capabilities.push('mcp');
        }
        // Default to tools for engineering prompts
        if (!capabilities.includes('tools')) {
            capabilities.push('tools');
        }
        // Deduce priority
        let priority = 'normal';
        if (text.includes('urgent') || text.includes('critical') || text.includes('fix immediately') || text.includes('production break')) {
            priority = 'critical';
        }
        else if (text.includes('high priority') || text.includes('important')) {
            priority = 'high';
        }
        else if (text.includes('background') || text.includes('whenever') || text.includes('low priority')) {
            priority = 'low';
        }
        // Deduce complexity & token estimation
        let complexity = 'moderate';
        let estimatedTokens = 2500;
        let contextSize = 8000;
        if (text.length > 500 || text.includes('refactor') || text.includes('architecture') || text.includes('rewrite') || text.includes('complex')) {
            complexity = 'complex';
            estimatedTokens = 6000;
            contextSize = 32000;
        }
        else if (text.length < 50 && (text.includes('fix typo') || text.includes('format') || text.includes('comment'))) {
            complexity = 'simple';
            estimatedTokens = 800;
            contextSize = 2000;
        }
        // Suggested runtime hint detection
        let suggestedRuntime;
        if (text.includes('claude'))
            suggestedRuntime = 'claude';
        else if (text.includes('ollama') || text.includes('local'))
            suggestedRuntime = 'ollama';
        else if (text.includes('gemini'))
            suggestedRuntime = 'gemini';
        else if (text.includes('codex') || text.includes('openai'))
            suggestedRuntime = 'codex';
        else if (text.includes('aider'))
            suggestedRuntime = 'aider';
        return {
            taskId: `task_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            intent: intentText,
            capabilities,
            priority,
            complexity,
            estimatedTokens,
            contextSize,
            workspaceRoot,
            suggestedRuntime,
            requiresLocal: text.includes('local') || text.includes('offline'),
        };
    }
}
exports.IntentAnalyzer = IntentAnalyzer;
//# sourceMappingURL=intent-analyzer.js.map