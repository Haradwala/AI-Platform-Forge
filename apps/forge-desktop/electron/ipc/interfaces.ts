import { IpcMainInvokeEvent, WebContents } from 'electron';

// ─── Core interfaces ──────────────────────────────────────────────────────────

export interface IIpcContext {
  readonly channel: string;
  readonly windowId: number;
  readonly sender: WebContents;
  readonly args: unknown[];
  readonly startedAt: number;
  response?: unknown;
  error?: Error;
}

export interface IIpcMiddleware {
  readonly name: string;
  handle(ctx: IIpcContext, next: () => Promise<void>): Promise<void>;
}

export type IpcHandlerFn = (ctx: IIpcContext) => Promise<unknown>;

export interface IIpcRouter {
  /** Register a handler for a specific channel */
  handle(channel: string, handler: IpcHandlerFn): void;
  /** Register a handler for a channel pattern (prefix match, e.g. 'workspace:*') */
  handlePattern(pattern: string, handler: IpcHandlerFn): void;
  /** Add middleware to the pipeline (executed in registration order) */
  use(middleware: IIpcMiddleware): void;
  /** Attach all registered handlers to ipcMain */
  attach(): void;
  /** Detach all handlers from ipcMain (for testing / shutdown) */
  detach(): void;
}

export interface IIpcResponse<T = unknown> {
  readonly ok: boolean;
  readonly data?: T;
  readonly error?: string;
}
