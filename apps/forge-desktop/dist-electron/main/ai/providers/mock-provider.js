"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockProvider = void 0;
const token_stream_1 = require("./token-stream");
class MockProvider {
    id = 'mock';
    name = 'Mock Provider (Offline Mode)';
    runtimeType = 'local';
    async listAvailableModels() {
        return ['mock-general-v1', 'mock-code-v1'];
    }
    async healthCheck() {
        // Mock runtime is always available — it has no external dependency.
        return { healthy: true, latencyMs: 0 };
    }
    async generateStream(prompt, context, signal) {
        const stream = new token_stream_1.AiTokenStream();
        const responseText = this.simulateResponse(prompt, context);
        const tokens = responseText.split(' ');
        let index = 0;
        let fullText = '';
        const interval = setInterval(() => {
            if (signal.aborted) {
                clearInterval(interval);
                stream.emitError(new Error('AI stream generation aborted by user.'));
                return;
            }
            if (index >= tokens.length) {
                clearInterval(interval);
                stream.emitComplete(fullText);
                return;
            }
            const nextToken = tokens[index] + (index === tokens.length - 1 ? '' : ' ');
            fullText += nextToken;
            stream.emitToken(nextToken);
            index++;
        }, 40); // realistic token-by-token streaming speed
        signal.addEventListener('abort', () => {
            clearInterval(interval);
            stream.emitError(new Error('AI stream generation aborted by user.'));
            stream.cancel();
        });
        return stream;
    }
    simulateResponse(prompt, context) {
        let userQuery = context?.userPrompt || '';
        if (!userQuery && prompt) {
            const match = prompt.match(/User request:\s*"([^"]+)"/i);
            if (match) {
                userQuery = match[1];
            }
            else if (!prompt.includes('\n') && prompt.length < 200) {
                userQuery = prompt;
            }
        }
        const cleanQuery = userQuery.toLowerCase().trim();
        // Check if prompt contains Workspace Search facts from tool execution
        const searchMatch = prompt.match(/Workspace Search \(query: "[^"]*"\):\s*Found (\d+) matches\./i);
        if (searchMatch) {
            const matchCount = parseInt(searchMatch[1], 10);
            // If user asked for file list
            if (cleanQuery.includes('list') || cleanQuery.includes('show') || cleanQuery.includes('find')) {
                const fileLines = prompt.split('\n')
                    .filter(l => l.trim().startsWith('*'))
                    .map(l => l.trim().substring(2).trim());
                if (fileLines.length > 0) {
                    return `Found ${matchCount} matching file${matchCount === 1 ? '' : 's'}:\n` + fileLines.map(f => `- ${f}`).join('\n');
                }
            }
            // If user asked for count / total files
            if (cleanQuery.includes('how many') || cleanQuery.includes('count') || cleanQuery.includes('number')) {
                return `Based on the tool execution search results, there are ${matchCount} matching file${matchCount === 1 ? '' : 's'} in this workspace.`;
            }
            return `Workspace search completed with ${matchCount} match${matchCount === 1 ? '' : 'es'}.`;
        }
        // Check if prompt contains File Content facts from tool execution
        const fileContentMatch = prompt.match(/File Content \(([^)]+)\):/i);
        if (fileContentMatch) {
            const fileName = fileContentMatch[1];
            if (cleanQuery.includes('summarize')) {
                return `Summary of "${fileName}": This file defines project structure, dependencies, and configuration settings.`;
            }
            if (cleanQuery.includes('explain')) {
                return `Explanation of "${fileName}": This component manages core application orchestration and workflow pipeline.`;
            }
            if (cleanQuery.includes('what file') || cleanQuery.includes('discussing')) {
                return `We are currently discussing "${fileName}".`;
            }
            return `Opened and read content from "${fileName}".`;
        }
        // Check if prompt contains Directory Listing facts from tool execution
        const dirListMatch = prompt.match(/Directory Listing \(([^)]+)\):\s*(\d+) items/i);
        if (dirListMatch) {
            return `Directory "${dirListMatch[1]}" contains ${dirListMatch[2]} item${dirListMatch[2] === '1' ? '' : 's'}.`;
        }
        // Fallbacks if no specific tool facts present:
        // 1. File count queries fallback
        if (cleanQuery.includes('how many files') ||
            cleanQuery.includes('file count') ||
            cleanQuery.includes('number of files') ||
            cleanQuery.includes('count files')) {
            const fileMatch = prompt.match(/Total files:\s*(\d+)/i);
            if (fileMatch) {
                return `Based on the workspace scan, there are ${fileMatch[1]} files in this project.`;
            }
            return `Based on the workspace scan, there are 558 files in this project.`;
        }
        // 2. Language / tech stack queries fallback
        if (cleanQuery.includes('language') ||
            cleanQuery.includes('tech stack') ||
            cleanQuery.includes('framework')) {
            const langMatch = prompt.match(/Languages:\s*([^\n]+)/i);
            if (langMatch) {
                return `This project primarily uses ${langMatch[1]}.`;
            }
            return `This project is built using TypeScript and React on Electron.`;
        }
        // 3. Greetings
        if (cleanQuery.includes('hello') ||
            cleanQuery.includes('hi') ||
            cleanQuery.includes('who are you')) {
            return `Hello! I am Forge AI. How can I assist you with your codebase today?`;
        }
        // 4. Default placeholder for unsupported / general queries
        return `This is a simulated response from the Mock Provider for "${prompt}". A real runtime would generate an answer based on the supplied context.`;
    }
}
exports.MockProvider = MockProvider;
//# sourceMappingURL=mock-provider.js.map