import type { IAiTokenStream } from '../../container/service-interfaces';
export declare class AiTokenStream implements IAiTokenStream {
    private onTokenCallback;
    private onCompleteCallback;
    private onErrorCallback;
    private isCancelled;
    onToken(callback: (token: string) => void): this;
    onComplete(callback: (fullText: string) => void): this;
    onError(callback: (err: Error) => void): this;
    emitToken(token: string): void;
    emitComplete(fullText: string): void;
    emitError(err: Error): void;
    cancel(): void;
}
