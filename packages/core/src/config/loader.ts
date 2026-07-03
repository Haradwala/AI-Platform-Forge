import * as dotenv from 'dotenv';
import { ConfigSchema, AppConfig, IConfigService } from './interface';

export class ConfigService implements IConfigService {
  private readonly config: AppConfig;

  constructor(overrides?: Partial<Record<string, any>>) {
    dotenv.config();

    const envData = {
      ...process.env,
      ...overrides
    };

    const result = ConfigSchema.safeParse(envData);
    if (!result.success) {
      throw new Error(`Config validation error: ${JSON.stringify(result.error.format())}`);
    }
    this.config = Object.freeze(result.data);
  }

  get<K extends keyof AppConfig>(key: K): AppConfig[K] {
    return this.config[key];
  }

  getAll(): AppConfig {
    return this.config;
  }
}
