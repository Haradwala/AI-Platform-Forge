"use strict";
/**
 * prompt-composer.ts
 *
 * PromptComposer — collects, orders, and formats PromptSection objects into a
 * clean, focused prompt string for the LLM runtime.
 *
 * Enforces pure section collection, priority-based ordering, and string assembly.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromptComposer = void 0;
const prompt_formatter_registry_1 = require("./formatters/prompt-formatter-registry");
const prompt_formatter_strategy_1 = require("./formatters/prompt-formatter-strategy");
class PromptComposer {
    registry;
    constructor(registry) {
        this.registry =
            registry ||
                new prompt_formatter_registry_1.PromptFormatterRegistry([
                    new prompt_formatter_strategy_1.WorkspaceStatisticsFormatter(),
                    new prompt_formatter_strategy_1.FileListFormatter(),
                    new prompt_formatter_strategy_1.WorkspaceSearchFormatter(),
                    new prompt_formatter_strategy_1.FileContentFormatter(),
                    new prompt_formatter_strategy_1.TerminalOutputFormatter(),
                    new prompt_formatter_strategy_1.GitDiffFormatter(),
                    new prompt_formatter_strategy_1.ErrorTraceFormatter(),
                ]);
    }
    /**
     * Composes a structured ResponseRequest into a clean prompt string for LLM generation.
     */
    compose(request) {
        const sections = [];
        // 1. System Header
        sections.push({
            title: 'System Role',
            category: 'system',
            priority: 1,
            content: `You are Forge AI, an expert software engineering assistant.\nAnswer the user's request clearly and concisely.`,
        });
        // 2. User Prompt
        sections.push({
            title: 'User Request',
            category: 'system',
            priority: 2,
            content: `User request: "${request.userPrompt}"`,
        });
        // 3. Grounding Knowledge Facts
        const facts = [];
        if (request.groundedContext?.knowledgeFacts) {
            facts.push(...request.groundedContext.knowledgeFacts);
        }
        else {
            if (request.groundedContext?.repositoryFacts) {
                facts.push(...request.groundedContext.repositoryFacts);
            }
            if (request.groundedContext?.terminalFacts) {
                facts.push(...request.groundedContext.terminalFacts.map((t) => ({ ...t, kind: 'terminal_output' })));
            }
        }
        const groundingContent = [];
        for (const fact of facts) {
            const section = this.registry.format(fact);
            if (section && section.content) {
                groundingContent.push(section.content);
            }
        }
        if (groundingContent.length > 0) {
            sections.push({
                title: 'Grounding Facts',
                category: 'grounding',
                priority: 10,
                content: `Grounding Repository Facts (from executed tool results):\n${groundingContent.join('\n')}`,
            });
        }
        // 4. Context Summary
        if (request.context.summary) {
            sections.push({
                title: 'Workspace Summary',
                category: 'context',
                priority: 15,
                content: `Workspace context summary:\n${request.context.summary}`,
            });
        }
        // 5. Execution Goal
        if (request.execution.goal && request.execution.goal !== request.userPrompt) {
            sections.push({
                title: 'Interpreted Goal',
                category: 'execution',
                priority: 20,
                content: `Interpreted goal: ${request.execution.goal}`,
            });
        }
        // 6. Execution & Verification Outcomes
        sections.push({
            title: 'Outcomes',
            category: 'verification',
            priority: 25,
            content: `Task completed: ${request.execution.success ? 'Yes' : 'No'}\nVerification passed: ${request.verification.success ? 'Yes' : 'No'}`,
        });
        // 7. Reflection Recommendations
        if (request.reflection.recommendations.length > 0) {
            sections.push({
                title: 'Observations',
                category: 'context',
                priority: 30,
                content: `Observations:\n${request.reflection.recommendations.map((r) => `- ${r}`).join('\n')}`,
            });
        }
        // 8. Grounding Directive
        sections.push({
            title: 'Grounding Directive',
            category: 'system',
            priority: 99,
            content: `CRITICAL REQUIREMENT: Base your answer strictly on the Grounding Repository / Terminal Facts if present.` +
                ` Do not invent numbers or file names when tool execution facts provide actual data.` +
                ` Do not mention pipeline stages, verification, or internal processing.` +
                ` Respond naturally as a software engineering assistant.`,
        });
        // Sort sections by priority
        sections.sort((a, b) => a.priority - b.priority);
        return sections.map((s) => s.content).join('\n\n');
    }
}
exports.PromptComposer = PromptComposer;
//# sourceMappingURL=prompt-composer.js.map