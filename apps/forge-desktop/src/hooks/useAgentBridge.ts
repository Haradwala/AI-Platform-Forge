/**
 * useAgentBridge.ts — Phase 4
 *
 * Subscribes to the `ai:event` IPC stream and drives run-store mutations.
 *
 * Event flow:
 *   PIPELINE_STARTED  → createRun()          (also resets token buffer)
 *   STAGE_STARTED     → appendStage()
 *   STAGE_COMPLETED   → completeStage()
 *   PIPELINE_COMPLETED→ updateRunStatus()
 *   TOKEN             → no-op (chat panel handles streaming text)
 *   ERROR             → updateRunStatus('failed')
 *
 * This hook must be mounted once at the application root so it is always
 * active regardless of which panel is visible.
 *
 * Phase note: This hook does NOT call createRun() from sendMessage() because
 * the canonical trigger is PIPELINE_STARTED — the backend confirms the run
 * actually began. Callers of sendMessage() pass title/runtimeId/modelId
 * which are surfaced in PIPELINE_STARTED.payload (fallback: derived from
 * ai-store state).
 */

import { useEffect, useRef } from 'react';
import { useRunStore } from '../stores/run-store';
import { useAiStore } from '../stores/ai-store';
import type { TimelineStage, RunStatus } from '../types/agent';

// ── Stage ID generator ─────────────────────────────────────────────────────────

let _stageSeq = 0;
function nextStageId(): string {
  return `stage_${Date.now()}_${++_stageSeq}`;
}

// ── Hook ───────────────────────────────────────────────────────────────────────

/**
 * useAgentBridge — must be called once from the root App component.
 *
 * Registers `window.forge.on('ai:event', ...)` and cleans up on unmount.
 */
export function useAgentBridge(): void {
  // Stable ref to run-store actions (avoids stale closures)
  const runStoreRef = useRef(useRunStore.getState());
  const aiStoreRef  = useRef(useAiStore.getState());

  useEffect(() => {
    const subscriptions = new Set<() => void>();
    subscriptions.add(useRunStore.subscribe((s) => { runStoreRef.current = s; }));
    subscriptions.add(useAiStore.subscribe((s)  => { aiStoreRef.current  = s; }));

    // Track the active pipeline run-id during a session
    let activeRunId: string | null = null;
    // Map stageId → stage object so we can complete it later
    const stageMap = new Map<string, string>(); // stageName → stageId

    if (typeof window !== 'undefined' && window.forge) {
      const unsubEvent = window.forge.on('ai:event', (raw: any) => {
        const evt = raw as { type: string; payload: any };
        const store = runStoreRef.current;
        const ai    = aiStoreRef.current;

        switch (evt.type) {

          case 'PIPELINE_STARTED': {
            const { id: pipelineId, prompt } = evt.payload ?? {};
            const title = prompt
              ? String(prompt).slice(0, 50) + (prompt.length > 50 ? '…' : '')
              : `Run ${new Date().toLocaleTimeString()}`;
            const runtimeId = ai.activeProviderId || 'unknown';
            const modelId   = ai.activeModelId    || 'unknown';
            activeRunId = store.createRun(title, runtimeId, modelId);
            stageMap.clear();
            break;
          }

          case 'STAGE_STARTED': {
            if (!activeRunId) break;
            const { phase = 'UNKNOWN', stageName = 'Stage', runtimeId, modelId, tokenCount, logs } = evt.payload ?? {};
            const id = nextStageId();
            const stage: TimelineStage = {
              id,
              phase: String(phase).toUpperCase(),
              name: stageName,
              status: 'running',
              startTime: Date.now(),
              runtimeId,
              modelId,
              tokenCount,
              logs: Array.isArray(logs) ? logs : undefined,
            };
            stageMap.set(stageName, id);
            store.appendStage(activeRunId, stage);
            break;
          }

          case 'STAGE_COMPLETED': {
            if (!activeRunId) break;
            const { stageName, status, durationMs = 0, toolOutput, diagnostics } = evt.payload ?? {};
            const stageId = stageMap.get(stageName);
            if (!stageId) break;
            const stageStatus = status === 'failed' ? 'failed' : 'completed';
            store.completeStage(activeRunId, stageId, durationMs, stageStatus);
            break;
          }

          case 'PIPELINE_COMPLETED': {
            if (!activeRunId) break;
            const { status } = evt.payload ?? {};
            const runStatus: RunStatus = status === 'failed'    ? 'failed'
                                       : status === 'cancelled' ? 'cancelled'
                                       : 'completed';
            store.updateRunStatus(activeRunId, runStatus);
            activeRunId = null;
            break;
          }

          case 'ERROR': {
            if (!activeRunId) break;
            store.updateRunStatus(activeRunId, 'failed');
            activeRunId = null;
            break;
          }

          default:
            break;
        }
      });
      subscriptions.add(unsubEvent);
    }

    return () => {
      for (const unsub of subscriptions) {
        try { unsub(); } catch { /* ignore */ }
      }
      subscriptions.clear();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
