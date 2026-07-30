/**
 * cli-manager.ts
 *
 * Facade managing the lifecycle of all external CLI sessions.
 * Supports creating, retrieving, listing, restarting, and destroying CLI process sessions.
 */
import { CLISession } from './cli-session';
import type { CLISessionInfo, CLISessionOptions } from './cli-types';
export interface ICLIManager {
    createSession(options: CLISessionOptions): Promise<CLISession>;
    getSession(id: string): CLISession | null;
    listSessions(): CLISessionInfo[];
    destroySession(id: string): Promise<void>;
    restartSession(id: string): Promise<void>;
    destroyAll(): Promise<void>;
}
export declare class CLIManager implements ICLIManager {
    private readonly sessions;
    private sessionCounter;
    createSession(options: CLISessionOptions): Promise<CLISession>;
    getSession(id: string): CLISession | null;
    listSessions(): CLISessionInfo[];
    destroySession(id: string): Promise<void>;
    restartSession(id: string): Promise<void>;
    destroyAll(): Promise<void>;
}
