import type { IAiTokenStream } from '../../container/service-interfaces';

export class AiTokenStream implements IAiTokenStream {
  private onTokenCallback: ((token: string) => void) | null = null;
  private onCompleteCallback: ((fullText: string) => void) | null = null;
  private onErrorCallback: ((err: Error) => void) | null = null;
  private isCancelled = false;

  onToken(callback: (token: string) => void): this {
    this.onTokenCallback = callback;
    return this;
  }

  onComplete(callback: (fullText: string) => void): this {
    this.onCompleteCallback = callback;
    return this;
  }

  onError(callback: (err: Error) => void): this {
    this.onErrorCallback = callback;
    return this;
  }

  emitToken(token: string): void {
    if (!this.isCancelled && this.onTokenCallback) {
      this.onTokenCallback(token);
    }
  }

  emitComplete(fullText: string): void {
    if (!this.isCancelled && this.onCompleteCallback) {
      this.onCompleteCallback(fullText);
    }
  }

  emitError(err: Error): void {
    if (!this.isCancelled && this.onErrorCallback) {
      this.onErrorCallback(err);
    }
  }

  cancel(): void {
    this.isCancelled = true;
  }
}
