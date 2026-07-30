import React, { useRef, useEffect } from 'react';
import { useLayoutStore } from '../stores/layout-store';
import { panelRegistry } from '../plugins/panel-registry';
import { DockDivider } from '../components/DockDivider';
import { DockTabBar } from './DockTabBar';
import { DockPanel } from '../components/DockPanel';
import { DesktopEventBusContext } from '../hooks/useDesktopEvent';
import { IDockPanelLifecycle } from '../plugins/interfaces';
import { FocusService } from '../services/focus-service';

export const DockHost: React.FC = () => {
  const { layout } = useLayoutStore();
  const dockRef = useRef<HTMLDivElement>(null);
  const panelHooksRef = useRef<IDockPanelLifecycle | null>(null);
  const bus = React.useContext(DesktopEventBusContext);

  const dockPanels = panelRegistry.getAll().filter(
    (p) => p.preferredDock?.position && p.preferredDock.position !== 'sidebar'
  );

  const activePanelId = layout.dock.activePanelId || (dockPanels[0]?.id ?? null);
  const activePanel = activePanelId ? panelRegistry.getById(activePanelId) : null;

  const getLifecycle = (): IDockPanelLifecycle => {
    return {
      ...(activePanel?.lifecycle || {}),
      ...(panelHooksRef.current || {}),
    };
  };

  // Monitor position transitions
  const prevPositionRef = useRef<string | null>(layout.dock.position);
  useEffect(() => {
    if (bus && prevPositionRef.current && prevPositionRef.current !== layout.dock.position) {
      bus.emit('dock:moved', { position: layout.dock.position });
    }
    prevPositionRef.current = layout.dock.position;
  }, [bus, layout.dock.position]);

  // Monitor size transitions
  const currentSize = layout.dock.position === 'bottom' ? layout.dock.height : layout.dock.width;
  const prevSizeRef = useRef<number | null>(currentSize);
  useEffect(() => {
    if (bus && prevSizeRef.current !== null && prevSizeRef.current !== currentSize) {
      bus.emit('dock:resized', { size: currentSize, position: layout.dock.position });
    }
    prevSizeRef.current = currentSize;
  }, [bus, currentSize, layout.dock.position]);

  // Monitor dock open/close events
  useEffect(() => {
    if (bus && activePanelId && layout.dock.dockState !== 'collapsed') {
      bus.emit('dock:opened', { position: layout.dock.position, activePanelId });
    }
    return () => {
      if (bus && layout.dock.dockState === 'collapsed') {
        bus.emit('dock:closed', undefined);
      }
    };
  }, [bus, activePanelId, layout.dock.dockState, layout.dock.position]);

  // Monitor panel activation and lifecycles
  useEffect(() => {
    if (!activePanelId || layout.dock.dockState === 'collapsed') return;

    const lifecycle = getLifecycle();
    if (lifecycle.onMount) {
      Promise.resolve(lifecycle.onMount()).catch(console.error);
    }
    if (lifecycle.onShow) {
      Promise.resolve(lifecycle.onShow()).catch(console.error);
    }

    if (bus) {
      bus.emit('dock:panel-activated', { panelId: activePanelId });
    }

    return () => {
      if (lifecycle.onHide) {
        Promise.resolve(lifecycle.onHide()).catch(console.error);
      }
      if (lifecycle.onDestroy) {
        Promise.resolve(lifecycle.onDestroy()).catch(console.error);
      }
    };
  }, [activePanelId, layout.dock.dockState]);

  if (layout.dock.dockState === 'collapsed' || dockPanels.length === 0) {
    return null;
  }

  // Sizing definitions based on position and maximized state
  const isMaximized = layout.dock.dockState === 'maximized';
  const isBottom = layout.dock.position === 'bottom';

  const getStyle = (): React.CSSProperties => {
    const style: React.CSSProperties = {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#0d0d11',
      borderColor: 'var(--forge-border)',
      zIndex: 10,
    };

    if (isBottom) {
      style.width = '100%';
      style.height = isMaximized ? 'calc(100vh - 60px)' : `${layout.dock.height}px`;
      style.borderTopWidth = '1px';
    } else {
      style.height = '100%';
      style.width = `${layout.dock.width}px`;
      if (layout.dock.position === 'right') {
        style.borderLeftWidth = '1px';
      } else {
        style.borderRightWidth = '1px';
      }
    }

    return style;
  };

  const handleFocus = () => {
    FocusService.setFocus('dock');
    const lifecycle = getLifecycle();
    if (lifecycle.onFocus) {
      Promise.resolve(lifecycle.onFocus()).catch(console.error);
    }
  };

  const handleBlur = () => {
    const lifecycle = getLifecycle();
    if (lifecycle.onBlur) {
      Promise.resolve(lifecycle.onBlur()).catch(console.error);
    }
  };

  return React.createElement(
    'div',
    {
      ref: dockRef,
      style: getStyle(),
      onFocus: handleFocus,
      onBlur: handleBlur,
      className: `transition-all select-none ${
        layout.dock.dockState !== 'dragging' ? 'duration-150 ease-out' : ''
      }`,
    },
    // Resize Handle (not active when maximized)
    !isMaximized &&
      React.createElement(DockDivider, {
        position: layout.dock.position,
        dockRef,
      }),
    // Tab Bar
    React.createElement(DockTabBar),
    // Content presentation
    React.createElement(
      'div',
      { className: 'flex-1 min-h-0 w-full relative overflow-hidden' },
      activePanel
        ? React.createElement(
            DockPanel,
            { title: activePanel.title },
            React.createElement(activePanel.component, {
              registerLifecycle: (hooks: IDockPanelLifecycle) => {
                panelHooksRef.current = hooks;
              },
            })
          )
        : React.createElement(
            'div',
            { className: 'p-4 text-forge-text-muted text-xs' },
            'No Active Panel'
          )
    )
  );
};
export default DockHost;
