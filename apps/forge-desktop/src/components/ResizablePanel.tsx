import React, { useRef, useEffect } from 'react';

interface ResizablePanelProps {
  readonly width?: number;
  readonly height?: number;
  readonly axis: 'x' | 'y';
  readonly resizeSide: 'left' | 'right' | 'top' | 'bottom';
  readonly onResize: (size: number) => void;
  readonly children?: React.ReactNode;
}

export const ResizablePanel: React.FC<ResizablePanelProps> = ({
  width,
  height,
  axis,
  resizeSide,
  onResize,
  children,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = width ?? (panelRef.current ? panelRef.current.offsetWidth : 0);
    const startHeight = height ?? (panelRef.current ? panelRef.current.offsetHeight : 0);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (axis === 'x') {
        const deltaX = moveEvent.clientX - startX;
        const newWidth = resizeSide === 'right' ? startWidth + deltaX : startWidth - deltaX;
        onResize(newWidth);
      } else {
        const deltaY = moveEvent.clientY - startY;
        const newHeight = resizeSide === 'bottom' ? startHeight + deltaY : startHeight - deltaY;
        onResize(newHeight);
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const isVertical = axis === 'x';
  const handleStyle: React.CSSProperties = isVertical
    ? {
        width: '4px',
        cursor: 'col-resize',
        position: 'absolute',
        top: 0,
        bottom: 0,
        [resizeSide]: 0,
        zIndex: 10,
      }
    : {
        height: '4px',
        cursor: 'row-resize',
        position: 'absolute',
        left: 0,
        right: 0,
        [resizeSide]: 0,
        zIndex: 10,
      };

  const style: React.CSSProperties = {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    width: width !== undefined ? `${width}px` : undefined,
    height: height !== undefined ? `${height}px` : undefined,
  };

  return React.createElement(
    'div',
    { ref: panelRef, style },
    children,
    React.createElement('div', {
      onMouseDown: handleMouseDown,
      style: handleStyle,
      className: 'hover:bg-forge-accent/50 transition-colors duration-150',
    })
  );
};
export default ResizablePanel;
