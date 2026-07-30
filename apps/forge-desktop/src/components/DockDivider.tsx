import React, { useRef, useEffect } from 'react';
import { useLayoutStore } from '../stores/layout-store';

interface DockDividerProps {
  position: 'bottom' | 'left' | 'right';
  dockRef: React.RefObject<HTMLDivElement>;
}

export const DockDivider: React.FC<DockDividerProps> = ({ position, dockRef }) => {
  const { setDockHeight, setDockWidth, setDockState, layout } = useLayoutStore();
  const dividerRef = useRef<HTMLDivElement>(null);
  const dragInfo = useRef<{ startX: number; startY: number; startSize: number } | null>(null);

  useEffect(() => {
    const divider = dividerRef.current;
    if (!divider) return;

    const handlePointerDown = (e: PointerEvent) => {
      e.preventDefault();
      divider.setPointerCapture(e.pointerId);

      const dockElement = dockRef.current;
      if (!dockElement) return;

      const rect = dockElement.getBoundingClientRect();
      const startSize = position === 'bottom' ? rect.height : rect.width;

      dragInfo.current = {
        startX: e.clientX,
        startY: e.clientY,
        startSize,
      };

      setDockState('dragging');
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!dragInfo.current) return;
      e.preventDefault();

      const info = dragInfo.current;
      const dockElement = dockRef.current;
      if (!dockElement) return;

      requestAnimationFrame(() => {
        if (position === 'bottom') {
          const deltaY = e.clientY - info.startY;
          // In bottom dock, dragging UP increases height (clientY decreases)
          const newHeight = Math.max(180, Math.min(window.innerHeight * 0.8, info.startSize - deltaY));
          dockElement.style.height = `${newHeight}px`;
        } else if (position === 'right') {
          const deltaX = e.clientX - info.startX;
          // In right dock, dragging LEFT increases width (clientX decreases)
          const newWidth = Math.max(180, Math.min(window.innerWidth * 0.8, info.startSize - deltaX));
          dockElement.style.width = `${newWidth}px`;
        } else if (position === 'left') {
          const deltaX = e.clientX - info.startX;
          // In left dock, dragging RIGHT increases width (clientX increases)
          const newWidth = Math.max(180, Math.min(window.innerWidth * 0.8, info.startSize + deltaX));
          dockElement.style.width = `${newWidth}px`;
        }
      });
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (!dragInfo.current) return;
      divider.releasePointerCapture(e.pointerId);

      const dockElement = dockRef.current;
      if (dockElement) {
        const rect = dockElement.getBoundingClientRect();
        if (position === 'bottom') {
          setDockHeight(rect.height);
        } else {
          setDockWidth(rect.width);
        }
      }

      dragInfo.current = null;
      setDockState('open');
    };

    divider.addEventListener('pointerdown', handlePointerDown);
    divider.addEventListener('pointermove', handlePointerMove);
    divider.addEventListener('pointerup', handlePointerUp);

    return () => {
      divider.removeEventListener('pointerdown', handlePointerDown);
      divider.removeEventListener('pointermove', handlePointerMove);
      divider.removeEventListener('pointerup', handlePointerUp);
    };
  }, [position, dockRef, setDockHeight, setDockWidth, setDockState]);

  const getStyleClass = () => {
    if (position === 'bottom') {
      return 'h-[6px] w-full cursor-ns-resize left-0 right-0 top-0 border-t border-forge-border hover:bg-forge-accent/20 active:bg-forge-accent/40';
    } else if (position === 'left') {
      return 'w-[6px] h-full cursor-ew-resize top-0 bottom-0 right-0 border-r border-forge-border hover:bg-forge-accent/20 active:bg-forge-accent/40';
    } else {
      return 'w-[6px] h-full cursor-ew-resize top-0 bottom-0 left-0 border-l border-forge-border hover:bg-forge-accent/20 active:bg-forge-accent/40';
    }
  };

  return React.createElement('div', {
    ref: dividerRef,
    className: `absolute z-50 transition-colors duration-150 ${getStyleClass()}`,
  });
};
