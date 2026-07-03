import { ILogger } from '@forge/core';

export interface IRetryPolicy {
  maxRetries: number;
  backoffMs: number;
  execute<T>(operation: () => Promise<T>): Promise<T>;
}

export class RetryPolicy implements IRetryPolicy {
  constructor(
    public readonly maxRetries: number = 3,
    public readonly backoffMs: number = 100,
    private logger?: ILogger
  ) {}

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    let lastError: Error | undefined;

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        return await operation();
      } catch (err) {
        lastError = err as Error;
        const isLastAttempt = attempt === this.maxRetries;

        if (this.logger) {
          this.logger.warn(`RetryPolicy: Operation failed on attempt ${attempt}/${this.maxRetries}`, {
            error: lastError.message,
            nextAttemptInMs: isLastAttempt ? 0 : this.backoffMs * Math.pow(2, attempt - 1)
          });
        }

        if (isLastAttempt) {
          break;
        }

        const delay = this.backoffMs * Math.pow(2, attempt - 1);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    throw lastError || new Error('RetryPolicy: Unknown error occurred.');
  }
}
