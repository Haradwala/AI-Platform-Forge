import type { IAiTokenStream, IAiSessionService } from '../../container/service-interfaces';
import type { IAiRuntime, RuntimeType, RuntimeHealth } from '../runtime/runtime-types';
import type { IServiceResolver } from '../../container/interfaces';
import { T } from '../../container/tokens';
import { AiTokenStream } from './token-stream';

import type { IConfigurationService } from '../../config/configuration-service';
import { resolveConfigService } from '../runtime/cloud/cloud-helpers';

export class OllamaProvider implements IAiRuntime {
  readonly id = 'ollama';
  readonly name = 'Ollama (Local LLM)';
  readonly runtimeType: RuntimeType = 'local';

  constructor(
    private readonly resolver?: IServiceResolver,
    private readonly configService?: IConfigurationService
  ) {}

  private get baseUrl(): string {
    const config = resolveConfigService(this.resolver, this.configService);
    return config.getProvider('ollama')?.baseUrl || 'http://localhost:11434';
  }

  async listAvailableModels(): Promise<string[]> {
    try {
      const res = await fetch(`${this.baseUrl}/api/tags`);
      if (!res.ok) return ['llama3', 'codellama', 'mistral'];
      const data = await res.json() as { models?: Array<{ name: string }> };
      return data.models?.map((m) => m.name) || ['llama3', 'codellama'];
    } catch {
      return ['llama3', 'codellama', 'mistral']; // fallback list if offline
    }
  }

  async generateStream(prompt: string, context: any, signal: AbortSignal): Promise<IAiTokenStream> {
    const stream = new AiTokenStream();

    // Resolve active model ID dynamically
    let modelId = 'llama3';
    if (this.resolver) {
      try {
        const sessionService = this.resolver.resolve<IAiSessionService>(T.IAiSessionService);
        const session = sessionService.getActiveSession();
        if (session && session.activeModelId) {
          modelId = session.activeModelId;
        }
      } catch (err) {
        // Fallback to default modelId if resolution fails
      }
    }

    // Spawn non-blocking async fetch loop
    const baseUrl = this.baseUrl;
    (async () => {
      try {
        // Fetch list of installed models from local Ollama tags API
        let installedModels: string[] = [];
        try {
          const tagsRes = await fetch(`${baseUrl}/api/tags`);
          if (tagsRes.ok) {
            const tagsData = await tagsRes.json() as { models?: Array<{ name: string }> };
            installedModels = tagsData.models?.map((m) => m.name) || [];
          }
        } catch (err) {
          throw new Error(`Failed to communicate with local Ollama: ${err instanceof Error ? err.message : String(err)}`);
        }

        if (installedModels.length === 0) {
          throw new Error('Model not installed');
        }

        // Validate selected model exists or fall back
        let finalModel = '';
        const normalizedSelected = modelId.toLowerCase();

        // 1. Try exact case-insensitive match
        const exactMatch = installedModels.find(m => m.toLowerCase() === normalizedSelected);
        if (exactMatch) {
          finalModel = exactMatch;
        } else {
          // 2. Try matching without tag prefix (e.g. 'llama3:latest' split matches 'llama3')
          const baseSelected = normalizedSelected.split(':')[0];
          const matchWithoutTag = installedModels.find(m => m.toLowerCase().split(':')[0] === baseSelected);
          if (matchWithoutTag) {
            finalModel = matchWithoutTag;
          } else {
            // 3. Try partial substring match
            const partialMatch = installedModels.find(m => {
              const mLower = m.toLowerCase();
              return mLower.includes(normalizedSelected) || normalizedSelected.includes(mLower);
            });
            if (partialMatch) {
              finalModel = partialMatch;
            }
          }
        }

        // If selected model is not installed, automatically fall back to the first available installed model
        if (!finalModel) {
          finalModel = installedModels[0];
        }

        const res = await fetch(`${baseUrl}/api/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: finalModel,
            prompt: `Context: ${JSON.stringify(context)}\nPrompt: ${prompt}`,
            stream: true
          }),
          signal
        });

        if (!res.ok) {
          if (res.status === 404) {
            throw new Error(`Model not installed: ${finalModel}`);
          }
          let errMsg = `Ollama responded with status: ${res.status}`;
          try {
            const errJson = await res.json() as { error?: string };
            if (errJson.error) errMsg = errJson.error;
          } catch {}
          throw new Error(errMsg);
        }

        if (!res.body) {
          throw new Error('Ollama streaming response contains an empty body.');
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let fullText = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');
          for (const line of lines) {
            if (!line.trim()) continue;
            try {
              const parsed = JSON.parse(line) as { response?: string };
              if (parsed.response) {
                fullText += parsed.response;
                stream.emitToken(parsed.response);
              }
            } catch {
              // Ignore raw parsing errors for incomplete chunk lines
            }
          }
        }
        stream.emitComplete(fullText);
      } catch (err: any) {
        stream.emitError(err);
      }
    })();

    return stream;
  }

  async healthCheck(): Promise<RuntimeHealth> {
    const start = Date.now();
    try {
      const res = await fetch(`${this.baseUrl}/api/tags`, {
        signal: AbortSignal.timeout(3000),
      });
      const latencyMs = Date.now() - start;
      if (res.ok) {
        return { healthy: true, latencyMs };
      }
      return { healthy: false, latencyMs, error: `Ollama responded with status ${res.status}` };
    } catch (err) {
      return {
        healthy: false,
        latencyMs: Date.now() - start,
        error: err instanceof Error ? err.message : 'Ollama unreachable',
      };
    }
  }
}
