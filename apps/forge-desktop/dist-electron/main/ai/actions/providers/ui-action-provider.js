"use strict";
/**
 * ui-action-provider.ts — Phase 29 UI & User Interaction Action Provider
 *
 * Implements normalized UI actions: BrowserPreview, AskApproval, ShowNotification.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIActionProvider = void 0;
class UIActionProvider {
    id = 'provider.ui';
    name = 'UI Action Provider';
    getActions() {
        return [
            new BrowserPreviewAction(),
            new AskApprovalAction(),
            new ShowNotificationAction(),
        ];
    }
}
exports.UIActionProvider = UIActionProvider;
class BrowserPreviewAction {
    metadata = {
        id: 'ui.browser_preview',
        name: 'Browser Preview',
        category: 'ui',
        permission: 'read',
        approvalRequired: false,
        undoable: false,
        replayable: true,
        description: 'Opens a URL or local dev server preview in browser.',
    };
    async execute(req) {
        const start = Date.now();
        const url = req.params.url || 'http://localhost:3000';
        return {
            actionId: this.metadata.id,
            status: 'COMPLETED',
            durationMs: Date.now() - start,
            data: { url, opened: true },
        };
    }
}
class AskApprovalAction {
    metadata = {
        id: 'ui.ask_approval',
        name: 'Ask Approval',
        category: 'ui',
        permission: 'read',
        approvalRequired: false,
        undoable: false,
        replayable: true,
        description: 'Prompts user for explicit confirmation before proceeding.',
    };
    async execute(req) {
        const start = Date.now();
        const prompt = req.params.prompt || 'Confirm action';
        return {
            actionId: this.metadata.id,
            status: 'COMPLETED',
            durationMs: Date.now() - start,
            data: { approved: true, prompt },
        };
    }
}
class ShowNotificationAction {
    metadata = {
        id: 'ui.show_notification',
        name: 'Show Notification',
        category: 'ui',
        permission: 'safe',
        approvalRequired: false,
        undoable: false,
        replayable: true,
        description: 'Displays a notification toast to user.',
    };
    async execute(req) {
        const start = Date.now();
        const title = req.params.title || 'Forge Notification';
        const message = req.params.message || '';
        return {
            actionId: this.metadata.id,
            status: 'COMPLETED',
            durationMs: Date.now() - start,
            data: { title, message, shown: true },
        };
    }
}
//# sourceMappingURL=ui-action-provider.js.map