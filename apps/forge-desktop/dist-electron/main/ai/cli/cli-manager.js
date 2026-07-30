"use strict";
/**
 * cli-manager.ts
 *
 * Facade managing the lifecycle of all external CLI sessions.
 * Supports creating, retrieving, listing, restarting, and destroying CLI process sessions.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CLIManager = void 0;
const cli_session_1 = require("./cli-session");
class CLIManager {
    sessions = new Map();
    sessionCounter = 1;
    async createSession(options) {
        const id = `cli_session_${Date.now()}_${this.sessionCounter++}`;
        const session = new cli_session_1.CLISession(id, options.command || '', options.args || [], options);
        session.start();
        this.sessions.set(id, session);
        return session;
    }
    getSession(id) {
        return this.sessions.get(id) || null;
    }
    listSessions() {
        return Array.from(this.sessions.values()).map((s) => s.getInfo());
    }
    async destroySession(id) {
        const session = this.sessions.get(id);
        if (!session)
            return;
        session.destroy();
        this.sessions.delete(id);
    }
    async restartSession(id) {
        const session = this.sessions.get(id);
        if (!session) {
            throw new Error(`Cannot restart CLI session "${id}": session not found.`);
        }
        session.restart();
    }
    async destroyAll() {
        for (const session of this.sessions.values()) {
            session.destroy();
        }
        this.sessions.clear();
    }
}
exports.CLIManager = CLIManager;
//# sourceMappingURL=cli-manager.js.map