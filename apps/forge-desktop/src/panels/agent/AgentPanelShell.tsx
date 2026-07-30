/**
 * AgentPanelShell.tsx — Phase 16 Production Polish
 *
 * Right-side Agent Panel — wired with InboxStrip, RunTimeline,
 * RuntimeSelector, ModelSelector, AutonomyToggle, CommandPaletteModal, and RecentRunsDrawer.
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import * as Lucide from 'lucide-react';
import { useLayoutStore } from '../../stores/layout-store';
import { InboxStrip } from './InboxStrip';
import { RunTimeline } from './RunTimeline';
import { RuntimeSelector } from './components/RuntimeSelector';
import { ModelSelector } from './components/ModelSelector';
import { AutonomyToggle } from './components/AutonomyToggle';
import { CommandPaletteModal } from '../../components/ui/CommandPaletteModal';
import { RecentRunsDrawer } from './RecentRunsDrawer';

const MIN_WIDTH = 280;
const MAX_WIDTH = 760;

export const AgentPanelShell: React.FC = () => {
  const { layout, setAgentPanelWidth, toggleAgentPanel } = useLayoutStore();
  const { visible, width } = layout.agentPanel;
  const dragStartX = useRef<number | null>(null);
  const dragStartWidth = useRef<number>(width);

  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isRecentRunsOpen, setIsRecentRunsOpen] = useState(false);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      dragStartX.current = e.clientX;
      dragStartWidth.current = layout.agentPanel.width;

      const onMouseMove = (ev: MouseEvent) => {
        if (dragStartX.current === null) return;
        const delta = dragStartX.current - ev.clientX;
        const next = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, dragStartWidth.current + delta));
        setAgentPanelWidth(next);
      };

      const onMouseUp = () => {
        dragStartX.current = null;
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
      };

      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
      e.preventDefault();
    },
    [layout.agentPanel.width, setAgentPanelWidth]
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((v) => !v);
      }
      if (e.key === 'Escape' && layout.agentPanel.visible && !isCommandPaletteOpen && !isRecentRunsOpen) {
        toggleAgentPanel();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [layout.agentPanel.visible, isCommandPaletteOpen, isRecentRunsOpen, toggleAgentPanel]);

  if (!visible) return null;

  return (
    <div
      id="forge-agent-panel"
      role="complementary"
      aria-label="Agent Panel"
      style={{ width: `${width}px`, minWidth: MIN_WIDTH, maxWidth: MAX_WIDTH }}
      className="animate-slide-in-right relative h-full flex flex-col border-l border-forge-border bg-forge-bg-elevated select-none overflow-hidden"
    >
      {/* Left resize handle */}
      <div
        onMouseDown={handleMouseDown}
        title="Drag to resize Agent Panel"
        className="absolute left-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-forge-accent/40 transition-colors z-10"
      />

      {/* Header Toolbar */}
      <div className="h-10 pl-4 pr-2 flex items-center gap-1.5 border-b border-forge-border flex-shrink-0 bg-forge-bg">
        <Lucide.Sparkles size={13} className="text-forge-accent flex-shrink-0" />
        <div className="flex items-center gap-1.5 flex-1 overflow-hidden min-w-0">
          <RuntimeSelector />
          <span className="text-forge-border text-xs select-none">/</span>
          <ModelSelector />
        </div>

        {/* Command Palette Trigger Button */}
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          title="Command Palette (Ctrl+K)"
          className="p-1 rounded text-forge-text-muted hover:text-forge-text hover:bg-forge-bg-hover transition-colors cursor-pointer"
        >
          <Lucide.Command size={13} />
        </button>

        {/* Recent Runs Trigger Button */}
        <button
          onClick={() => setIsRecentRunsOpen(true)}
          title="Recent Agent Runs History"
          className="p-1 rounded text-forge-text-muted hover:text-forge-text hover:bg-forge-bg-hover transition-colors cursor-pointer"
        >
          <Lucide.History size={13} />
        </button>

        <AutonomyToggle />

        <button
          id="forge-agent-panel-close"
          onClick={toggleAgentPanel}
          title="Close Agent Panel"
          className="w-6 h-6 flex items-center justify-center rounded text-forge-text-muted hover:text-forge-text hover:bg-forge-bg-hover transition-all flex-shrink-0 cursor-pointer"
        >
          <Lucide.X size={13} />
        </button>
      </div>

      {/* Inbox Strip */}
      <InboxStrip />

      {/* Engineering Timeline */}
      <RunTimeline />

      {/* Command Palette Modal */}
      <CommandPaletteModal isOpen={isCommandPaletteOpen} onClose={() => setIsCommandPaletteOpen(false)} />

      {/* Recent Runs History Drawer */}
      <RecentRunsDrawer isOpen={isRecentRunsOpen} onClose={() => setIsRecentRunsOpen(false)} />
    </div>
  );
};

export default AgentPanelShell;
