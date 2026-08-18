/**
 * PanelHost.tsx — Generic Container Component for Stateful Dock Panels
 *
 * Responsibilities:
 * - Owns DOM container instances for dock panels
 * - Toggles CSS visibility (`display: block` vs `display: none`)
 * - Coordinates `suspend()` and `resume()` via PanelLifecycleRegistry
 * - Emits eventbus telemetry for panel state transitions
 */

import React, { useEffect, useRef, useState } from 'react';
import { DockRegistry, DockPanelDefinition } from './DockRegistry';
import { PanelLifecycleRegistry } from './PanelLifecycleRegistry';

interface PanelHostProps {
  activeTabId: string;
  isExpanded: boolean;
  eventBus?: { emit: (event: string, payload: any) => void };
}

export const PanelHost: React.FC<PanelHostProps> = ({ activeTabId, isExpanded, eventBus }) => {
  // Track which panel IDs have been mounted into the DOM at least once
  const [mountedPanelIds, setMountedPanelIds] = useState<Set<string>>(() => new Set([activeTabId]));
  const prevActiveRef = useRef<string>(activeTabId);
  const prevExpandedRef = useRef<boolean>(isExpanded);

  // Lazy-mount panel definitions when selected
  useEffect(() => {
    if (activeTabId && !mountedPanelIds.has(activeTabId)) {
      setMountedPanelIds((prev) => new Set([...prev, activeTabId]));
    }
  }, [activeTabId, mountedPanelIds]);

  // Coordinate suspend / resume lifecycle transitions
  useEffect(() => {
    const prevActive = prevActiveRef.current;
    const prevExpanded = prevExpandedRef.current;

    const allPanels = DockRegistry.getAll();
    allPanels.forEach((panel) => {
      const panelId = panel.id;
      const isCurrentActive = isExpanded && panelId === activeTabId;
      const wasActive = prevExpanded && panelId === prevActive;

      if (isCurrentActive && !wasActive) {
        // Transition: SUSPENDED -> ACTIVE
        PanelLifecycleRegistry.resume(panelId).then(() => {
          if (eventBus) {
            eventBus.emit('panel:resumed', { panelId, timestamp: new Date().toISOString() });
          }
        });
      } else if (!isCurrentActive && wasActive) {
        // Transition: ACTIVE -> SUSPENDED
        PanelLifecycleRegistry.suspend(panelId).then(() => {
          if (eventBus) {
            eventBus.emit('panel:suspended', { panelId, timestamp: new Date().toISOString() });
          }
        });
      }
    });

    prevActiveRef.current = activeTabId;
    prevExpandedRef.current = isExpanded;
  }, [activeTabId, isExpanded, eventBus]);

  const allPanels = DockRegistry.getAll();

  return React.createElement(
    'div',
    { className: 'w-full h-full relative overflow-hidden bg-[#09090d]' },
    allPanels.map((panelDef: DockPanelDefinition) => {
      const { id, component: Component } = panelDef;
      if (!mountedPanelIds.has(id)) return null;

      const isVisible = isExpanded && id === activeTabId;

      return React.createElement(
        'div',
        {
          key: id,
          id: `panel-host-${id}`,
          style: {
            display: isVisible ? 'block' : 'none',
            width: '100%',
            height: '100%',
          },
          className: 'w-full h-full relative',
        },
        React.createElement(Component)
      );
    })
  );
};

export default PanelHost;
