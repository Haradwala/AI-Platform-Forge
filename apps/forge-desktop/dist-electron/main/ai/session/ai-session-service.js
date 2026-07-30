"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiSessionService = void 0;
class AiSessionService {
    providerRegistry;
    logger;
    id = 'AiSessionService';
    version = '2.0.0';
    dependencies = [];
    health = 'healthy';
    status = 'stopped';
    sessions = new Map();
    activeSessionId = null;
    startTime = Date.now();
    constructor(providerRegistry, logger) {
        this.providerRegistry = providerRegistry;
        this.logger = logger;
    }
    uptime() {
        return Date.now() - this.startTime;
    }
    metrics() {
        return {
            activeSessionsCount: this.sessions.size,
            activeSessionId: this.activeSessionId,
        };
    }
    onStart() {
        this.status = 'running';
    }
    onRunning() { }
    onSuspend() { }
    onShutdown() {
        this.sessions.clear();
        this.activeSessionId = null;
    }
    createSession() {
        const id = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        const session = {
            id,
            activeProviderId: 'mock',
            activeModelId: 'mock-general-v1',
            isStreaming: false,
            abortController: null,
            workspacePath: null,
            state: 'Idle',
        };
        this.sessions.set(id, session);
        this.activeSessionId = id;
        this.logger.info(`[AiSessionService] Created session: ${id}`);
        return session;
    }
    getSession(id) {
        return this.sessions.get(id) || null;
    }
    getActiveSession() {
        if (!this.activeSessionId) {
            return this.createSession();
        }
        return this.sessions.get(this.activeSessionId) || null;
    }
    setActiveSession(session) {
        if (session) {
            const existing = this.sessions.get(session.id);
            const updated = {
                ...session,
                workspacePath: existing?.workspacePath || null,
                state: existing?.state || 'Idle',
            };
            this.sessions.set(session.id, updated);
            this.activeSessionId = session.id;
        }
        else {
            this.activeSessionId = null;
        }
    }
    setProvider(id) {
        const s = this.getActiveSession();
        if (s) {
            s.activeProviderId = id;
            const prov = this.providerRegistry.getById(id);
            if (prov) {
                prov.listAvailableModels().then(models => {
                    if (models.length > 0) {
                        s.activeModelId = models[0];
                    }
                }).catch(err => {
                    this.logger.warn(`[AiSessionService] Failed to fetch active models for provider switch ${id}: ${err}`);
                });
            }
        }
    }
    setModel(id) {
        const s = this.getActiveSession();
        if (s) {
            s.activeModelId = id;
        }
    }
    updateSessionState(id, state) {
        const s = this.sessions.get(id);
        if (s) {
            s.state = state;
        }
    }
}
exports.AiSessionService = AiSessionService;
//# sourceMappingURL=ai-session-service.js.map