/**
 * run-store.ts — Phase 2
 *
 * Zustand store tracking all AgentRuns and their Engineering Timeline stages.
 *
 * Phase 4 will wire ai:event IPC events into appendStage / completeStage /
 * updateRunStatus. Until then the store is fully functional but empty on start.
 */

import { create } from 'zustand';
import type { AgentRun, TimelineStage, AgentCard, RunStatus, StageStatus } from '../types/agent';

// ── State interface ────────────────────────────────────────────────────────────

interface RunState {
  /** All runs, newest first */
  readonly runs: AgentRun[];
  /** Currently selected run — drives RunTimeline */
  readonly activeRunId: string | null;
  /** Global Review Mode flag (Planner -> Review -> Execution approval gate) */
  readonly isReviewModeEnabled: boolean;

  // ── Mutations ──────────────────────────────────────────────────────────────
  /** Create a new run (or return existing if requestId exists), make it active, return its id */
  createRun(title: string, runtimeId: string, modelId: string, requestId?: string): string;
  /** Update top-level run fields (e.g. status, title, endTime) */
  updateRun(id: string, patch: Partial<Pick<AgentRun, 'title' | 'status' | 'endTime' | 'reviewStatus'>>): void;
  /** Change the actively displayed run */
  setActiveRun(id: string | null): void;
  /** Toggle or set Review Mode */
  setReviewModeEnabled(enabled: boolean): void;
  /** Set run review status */
  setReviewStatus(runId: string, status: 'pending_review' | 'approved' | 'rejected'): void;
  /** Append a new stage (called on STAGE_STARTED in Phase 4) */
  appendStage(runId: string, stage: TimelineStage): void;
  /** Update an existing stage (called on STAGE_COMPLETED in Phase 4) */
  completeStage(runId: string, stageId: string, durationMs: number, status: StageStatus): void;
  /** Append an output card */
  appendCard(runId: string, card: AgentCard): void;
  /** Update run status (called on PIPELINE_COMPLETED / ERROR in Phase 4) */
  updateRunStatus(runId: string, status: RunStatus): void;
  /** Remove all runs (e.g. clear history) */
  clearRuns(): void;
}

// ── Store ──────────────────────────────────────────────────────────────────────

export const useRunStore = create<RunState>((set, get) => ({
  runs: [],
  activeRunId: null,
  isReviewModeEnabled: true,

  createRun(title, runtimeId, modelId, requestId) {
    const existing = requestId
      ? get().runs.find((r) => r.requestId === requestId || r.id === requestId)
      : null;
    if (existing) {
      set({ activeRunId: existing.id });
      return existing.id;
    }

    const id = requestId || `run_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const run: AgentRun = {
      id,
      requestId: requestId || id,
      title,
      status: 'running',
      runtimeId,
      modelId,
      startTime: Date.now(),
      timeline: [],
      cards: [],
    };
    set((state) => ({
      runs: [run, ...state.runs],
      activeRunId: id,
    }));
    return id;
  },

  updateRun(id, patch) {
    set((state) => ({
      runs: state.runs.map((r) =>
        r.id === id || r.requestId === id ? { ...r, ...patch } : r
      ),
    }));
  },

  setActiveRun(id) {
    set({ activeRunId: id });
  },

  setReviewModeEnabled(enabled) {
    set({ isReviewModeEnabled: enabled });
  },

  setReviewStatus(runId, status) {
    set((state) => ({
      runs: state.runs.map((r) =>
        r.id === runId || r.requestId === runId ? { ...r, reviewStatus: status } : r
      ),
    }));
  },

  appendStage(runId, stage) {
    set((state) => ({
      runs: state.runs.map((r) => {
        if (r.id !== runId && r.requestId !== runId) return r;
        const exists = r.timeline.some(
          (s) =>
            s.id === stage.id ||
            (s.name === stage.name && s.phase === stage.phase)
        );
        if (exists) return r;
        return { ...r, timeline: [...r.timeline, stage] };
      }),
    }));
  },

  completeStage(runId, stageId, durationMs, status) {
    set((state) => ({
      runs: state.runs.map((r) => {
        if (r.id !== runId) return r;
        return {
          ...r,
          timeline: r.timeline.map((s) =>
            s.id === stageId ? { ...s, status, durationMs } : s
          ),
        };
      }),
    }));
  },

  appendCard(runId, card) {
    set((state) => ({
      runs: state.runs.map((r) =>
        r.id === runId ? { ...r, cards: [...r.cards, card] } : r
      ),
    }));
  },

  updateRunStatus(runId, status) {
    const endTime = status === 'completed' || status === 'failed' || status === 'cancelled'
      ? Date.now()
      : undefined;
    set((state) => ({
      runs: state.runs.map((r) =>
        r.id === runId ? { ...r, status, ...(endTime ? { endTime } : {}) } : r
      ),
    }));
  },

  clearRuns() {
    set({ runs: [], activeRunId: null });
  },
}));

// ── Selectors (memoisation-friendly, call inside components) ──────────────────

/** Returns the currently active run, or null */
export const selectActiveRun = (state: RunState): AgentRun | null =>
  state.runs.find((r) => r.id === state.activeRunId) ?? null;
