/**
 * DockHandle.tsx — Apple/Linear-inspired Drag Pill Handle (━━━)
 */

import React, { useRef } from 'react';
import { useDockStore } from './DockStore';

export const DockHandle: React.FC = () => {
  const { isDragging, startDragging, stopDragging, setHeightPx, toggleMaximize } = useDockStore();
  const dragRef = useRef<{ startY: number; startHeight: number; lastY: number; lastTime: number; velocity: number }>({
    startY: 0,
    startHeight: 0,
    lastY: 0,
    lastTime: 0,
    velocity: 0,
  });

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const currentHeight = useDockStore.getState().actualHeightPx;
    dragRef.current = {
      startY: e.clientY,
      startHeight: currentHeight,
      lastY: e.clientY,
      lastTime: performance.now(),
      velocity: 0,
    };

    startDragging();

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaY = dragRef.current.startY - moveEvent.clientY; // Dragging up increases height
      const newHeight = Math.max(0, dragRef.current.startHeight + deltaY);

      const now = performance.now();
      const dt = (now - dragRef.current.lastTime) / 1000;
      if (dt > 0.005) {
        dragRef.current.velocity = (dragRef.current.lastY - moveEvent.clientY) / dt;
        dragRef.current.lastY = moveEvent.clientY;
        dragRef.current.lastTime = now;
      }

      setHeightPx(newHeight);
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      stopDragging(dragRef.current.velocity, window.innerHeight);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleDoubleClick = () => {
    toggleMaximize(window.innerHeight);
  };

  return React.createElement(
    'div',
    {
      className:
        'w-full h-4 flex items-center justify-center cursor-ns-resize group select-none hover:bg-white/5 transition-colors',
      onMouseDown: handleMouseDown,
      onDoubleClick: handleDoubleClick,
      title: 'Drag upward to expand Bottom Workspace | Double click to maximize',
    },
    // Sleek Apple/Linear pill handle (━━━)
    React.createElement('div', {
      className: `w-12 h-1 rounded-full transition-all duration-200 ${
        isDragging
          ? 'bg-forge-accent shadow-[0_0_10px_rgba(99,102,241,0.8)] scale-x-125'
          : 'bg-white/30 group-hover:bg-white/70 group-hover:scale-x-110'
      }`,
    })
  );
};
