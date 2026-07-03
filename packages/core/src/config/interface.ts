import { z } from 'zod';

export const ConfigSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(4000),
  WORKSPACE_ROOT: z.string(),
  OLLAMA_API_URL: z.string().url().default('http://localhost:11434'),
  DATABASE_PATH: z.string().default('./forge.db'),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
});

export type AppConfig = Readonly<z.infer<typeof ConfigSchema>>;

export interface IConfigService {
  get<K extends keyof AppConfig>(key: K): AppConfig[K];
  getAll(): AppConfig;
}
