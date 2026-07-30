"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiTokenStream = void 0;
class AiTokenStream {
    onTokenCallback = null;
    onCompleteCallback = null;
    onErrorCallback = null;
    isCancelled = false;
    onToken(callback) {
        this.onTokenCallback = callback;
        return this;
    }
    onComplete(callback) {
        this.onCompleteCallback = callback;
        return this;
    }
    onError(callback) {
        this.onErrorCallback = callback;
        return this;
    }
    emitToken(token) {
        if (!this.isCancelled && this.onTokenCallback) {
            this.onTokenCallback(token);
        }
    }
    emitComplete(fullText) {
        if (!this.isCancelled && this.onCompleteCallback) {
            this.onCompleteCallback(fullText);
        }
    }
    emitError(err) {
        if (!this.isCancelled && this.onErrorCallback) {
            this.onErrorCallback(err);
        }
    }
    cancel() {
        this.isCancelled = true;
    }
}
exports.AiTokenStream = AiTokenStream;
//# sourceMappingURL=token-stream.js.map