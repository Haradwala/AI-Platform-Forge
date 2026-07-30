"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.PipelineRecorder = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class PipelineRecorder {
    workspaceService;
    logger;
    constructor(workspaceService, logger) {
        this.workspaceService = workspaceService;
        this.logger = logger;
    }
    async record(context) {
        const root = this.workspaceService.getRootPath();
        if (!root) {
            this.logger.warn('[PipelineRecorder] No workspace root available. Skipping record write.');
            return null;
        }
        try {
            const now = new Date();
            const year = now.getFullYear().toString();
            const month = (now.getMonth() + 1).toString().padStart(2, '0');
            const runsDir = path.join(root, '.forge', 'pipeline', 'runs', year, month);
            await fs.promises.mkdir(runsDir, { recursive: true });
            const filename = `run-${context.id}.json`;
            const fullPath = path.join(runsDir, filename);
            await fs.promises.writeFile(fullPath, JSON.stringify(context, null, 2), 'utf-8');
            this.logger.info(`[PipelineRecorder] Saved pipeline execution record to: ${fullPath}`);
            return fullPath;
        }
        catch (err) {
            this.logger.error('[PipelineRecorder] Failed to write pipeline log record:', err);
            return null;
        }
    }
}
exports.PipelineRecorder = PipelineRecorder;
//# sourceMappingURL=pipeline-recorder.js.map