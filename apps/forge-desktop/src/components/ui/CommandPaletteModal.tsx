/**
 * CommandPaletteModal.tsx — Phase 16 Production Polish
 *
 * Interactive Command Palette modal triggered via Ctrl+K / Cmd+K.
 * Supports quick search, switching runs, toggling review mode, and navigation.
 */

import React, { useState, useEffect } from 'react';
import * as Lucide from 'lucide-react';
import { useRunStore } from '../../stores/run-store';
import { useAgentStore } from '../../stores/agent-store';

interface CommandItem {
  id: string;
  label: string;
  category: string;
  icon: React.ElementType;
  action: () => void;
}

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({ isOpen, onClose }) => {
  const [search, setSearch] = useState('');
  const { runs, setActiveRun, isReviewModeEnabled, setReviewModeEnabled } = useRunStore();
  const { autonomyMode, setAutonomyMode } = useAgentStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        isOpen ? onClose() : null;
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const defaultCommands: CommandItem[] = [
    {
      id: 'toggle-review-mode',
      label: `Toggle Review Mode (${isReviewModeEnabled ? 'Enabled' : 'Disabled'})`,
      category: 'Settings',
      icon: Lucide.ShieldCheck,
      action: () => {
        setReviewModeEnabled(!isReviewModeEnabled);
        setAutonomyMode(isReviewModeEnabled ? 'agent-decides' : 'request-review');
        onClose();
      },
    },
    {
      id: 'open-runtime-manager',
      label: 'Open Runtime Workspace Manager',
      category: 'Runtime',
      icon: Lucide.Server,
      action: () => {
        onClose();
      },
    },
    {
      id: 'open-intelligence-dashboard',
      label: 'Open Engineering Intelligence Dashboard',
      category: 'Intelligence',
      icon: Lucide.Brain,
      action: () => {
        onClose();
      },
    },
    {
      id: 'new-run',
      label: 'Start New Agent Engineering Run',
      category: 'Action',
      icon: Lucide.Play,
      action: () => {
        onClose();
      },
    },
    {
      id: 'clear-runs',
      label: 'Clear Engineering Timeline History',
      category: 'Danger',
      icon: Lucide.Trash2,
      action: () => {
        useRunStore.getState().clearRuns();
        onClose();
      },
    },
  ];

  const runCommands: CommandItem[] = runs.map((run) => ({
    id: `run-${run.id}`,
    label: `Switch to Run: ${run.title}`,
    category: 'Recent Runs',
    icon: Lucide.GitBranch,
    action: () => {
      setActiveRun(run.id);
      onClose();
    },
  }));

  const allCommands = [...defaultCommands, ...runCommands];
  const filtered = allCommands.filter((cmd) =>
    cmd.label.toLowerCase().includes(search.toLowerCase()) || cmd.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-24 animate-fade-in">
      <div className="w-[540px] bg-forge-bg-elevated border border-forge-border rounded-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Search Header */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-forge-border bg-forge-bg">
          <Lucide.Search size={16} className="text-forge-accent" />
          <input
            type="text"
            autoFocus
            placeholder="Type a command or search recent runs... (Esc to close)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-xs text-forge-text focus:outline-none font-mono"
          />
          <kbd className="px-1.5 py-0.5 text-[10px] bg-forge-bg-elevated border border-forge-border text-forge-text-subtle rounded font-mono">
            ESC
          </kbd>
        </div>

        {/* Command List */}
        <div className="max-h-72 overflow-y-auto p-2 flex flex-col gap-1">
          {filtered.length === 0 ? (
            <div className="p-4 text-center text-xs text-forge-text-subtle">No matching commands found</div>
          ) : (
            filtered.map((cmd) => (
              <button
                key={cmd.id}
                onClick={cmd.action}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-forge-bg-hover text-left transition-colors cursor-pointer group"
              >
                <cmd.icon size={14} className="text-forge-text-muted group-hover:text-forge-accent transition-colors" />
                <span className="flex-1 text-xs text-forge-text font-medium">{cmd.label}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-forge-bg border border-forge-border text-forge-text-subtle font-mono uppercase">
                  {cmd.category}
                </span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CommandPaletteModal;
