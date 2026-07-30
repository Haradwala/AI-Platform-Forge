import React, { useState, useEffect, useRef } from 'react';
import * as Lucide from 'lucide-react';
import { useCommandPaletteStore } from '../stores/command-palette-store';
import { commandRegistry } from '../plugins/command-registry';
import { CommandService } from '../commands/command-service';

export const CommandPalette: React.FC = () => {
  const { isVisible, setVisible } = useCommandPaletteStore();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Reset states when palette is shown/hidden
  useEffect(() => {
    if (isVisible) {
      setQuery('');
      setSelectedIndex(0);
      // Let the browser paint first before focusing
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isVisible]);

  // Handle clicking outside to close
  const overlayRef = useRef<HTMLDivElement>(null);
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) {
      setVisible(false);
    }
  };

  // Fetch all registered commands and filter
  const commands = commandRegistry.getAll();
  const filtered = commands.filter((cmd) => {
    const searchString = `${cmd.category || ''} ${cmd.title}`.toLowerCase();
    return searchString.includes(query.toLowerCase());
  });

  // Clamp selection index to filtered list length
  useEffect(() => {
    if (filtered.length === 0) {
      setSelectedIndex(0);
    } else if (selectedIndex >= filtered.length) {
      setSelectedIndex(filtered.length - 1);
    }
  }, [filtered, selectedIndex]);

  // Keep selected item in viewport view when navigating with keyboard
  useEffect(() => {
    if (listRef.current) {
      const activeEl = listRef.current.children[selectedIndex] as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  // Handle keyboard events
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (!isVisible) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) => (filtered.length > 0 ? (prev + 1) % filtered.length : 0));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) =>
            filtered.length > 0 ? (prev - 1 + filtered.length) % filtered.length : 0
          );
          break;
        case 'Enter':
          e.preventDefault();
          if (filtered[selectedIndex]) {
            const selectedCmd = filtered[selectedIndex];
            setVisible(false);
            // Execute command strictly via CommandService
            CommandService.execute(selectedCmd.id);
          }
          break;
        case 'Escape':
          e.preventDefault();
          setVisible(false);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isVisible, filtered, selectedIndex, setVisible]);

  if (!isVisible) return null;

  return React.createElement(
    'div',
    {
      ref: overlayRef,
      onClick: handleOverlayClick,
      className: 'fixed inset-0 bg-black/60 backdrop-blur-xs flex justify-center z-50 select-none animate-fade-in'
    },
    React.createElement(
      'div',
      {
        className: 'fixed top-[15%] w-full max-w-xl bg-forge-bg-elevated/95 border border-forge-border rounded-xl shadow-2xl overflow-hidden flex flex-col backdrop-blur-md animate-slide-down'
      },
      // Search Input Container
      React.createElement(
        'div',
        { className: 'flex items-center gap-3 px-4 py-3 border-b border-forge-border' },
        React.createElement(Lucide.Search, { size: 16, className: 'text-forge-text-muted' }),
        React.createElement('input', {
          ref: inputRef,
          type: 'text',
          value: query,
          onChange: (e) => setQuery(e.target.value),
          placeholder: 'Type a command to execute...',
          className: 'flex-1 bg-transparent border-0 outline-0 ring-0 text-sm text-forge-text placeholder:text-forge-text-muted w-full'
        })
      ),
      // Commands List
      React.createElement(
        'div',
        {
          ref: listRef,
          className: 'max-h-72 overflow-y-auto py-2'
        },
        filtered.length === 0
          ? React.createElement(
              'div',
              { className: 'px-4 py-8 text-center text-xs text-forge-text-muted font-medium' },
              'No commands match your query'
            )
          : filtered.map((cmd, idx) => {
              const isSelected = idx === selectedIndex;
              return React.createElement(
                'button',
                {
                  key: cmd.id,
                  onClick: () => {
                    setVisible(false);
                    CommandService.execute(cmd.id);
                  },
                  onMouseEnter: () => setSelectedIndex(idx),
                  className: `w-full px-4 py-2.5 flex items-center justify-between text-left text-xs transition-colors border-l-[3px] ${
                    isSelected
                      ? 'bg-forge-bg-active text-forge-accent border-forge-accent'
                      : 'bg-transparent text-forge-text-muted hover:text-forge-text border-transparent'
                  }`
                },
                React.createElement(
                  'div',
                  { className: 'flex flex-col gap-0.5' },
                  React.createElement(
                    'span',
                    { className: `font-semibold ${isSelected ? 'text-forge-accent' : 'text-forge-text'}` },
                    cmd.title
                  ),
                  cmd.category &&
                    React.createElement(
                      'span',
                      { className: 'text-[10px] text-forge-text-muted font-medium' },
                      cmd.category
                    )
                ),
                React.createElement(
                  'span',
                  { className: 'text-[10px] text-forge-text-muted font-mono tracking-wider' },
                  cmd.id
                )
              );
            })
      )
    )
  );
};

export default CommandPalette;
