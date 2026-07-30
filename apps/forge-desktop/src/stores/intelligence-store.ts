/**
 * intelligence-store.ts — Phase 17 Engineering Intelligence Layer
 *
 * Zustand store managing the Engineering Dashboard analysis state.
 */

import { create } from 'zustand';
import {
  intelligenceEngine,
  type FullRepositoryAnalysis,
  type ImpactAnalysisResult,
} from '../services/engineering-intelligence-engine';

interface IntelligenceState {
  analysis: FullRepositoryAnalysis | null;
  selectedImpactTarget: string;
  impactAnalysis: ImpactAnalysisResult | null;
  isLoading: boolean;

  refreshAnalysis: () => Promise<void>;
  setImpactTarget: (target: string) => void;
}

export const useIntelligenceStore = create<IntelligenceState>((set, get) => ({
  analysis: null,
  selectedImpactTarget: 'src/types/agent.ts',
  impactAnalysis: intelligenceEngine.impactAnalysis('src/types/agent.ts'),
  isLoading: false,

  refreshAnalysis: async () => {
    set({ isLoading: true });
    try {
      const data = await intelligenceEngine.analyzeRepository();
      const impact = intelligenceEngine.impactAnalysis(get().selectedImpactTarget);
      set({ analysis: data, impactAnalysis: impact, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  setImpactTarget: (target: string) => {
    const impact = intelligenceEngine.impactAnalysis(target);
    set({ selectedImpactTarget: target, impactAnalysis: impact });
  },
}));
