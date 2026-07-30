import React from 'react';

export interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  lines?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  width,
  height,
  lines = 1,
}) => {
  if (lines > 1) {
    return (
      <div className="space-y-2 w-full">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={`animate-pulse bg-forge-bg-hover/80 rounded ${className}`}
            style={{
              width: i === lines - 1 ? '70%' : width ?? '100%',
              height: height ?? '12px',
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`animate-pulse bg-forge-bg-hover/80 rounded ${className}`}
      style={{
        width: width ?? '100%',
        height: height ?? '16px',
      }}
    />
  );
};

export default Skeleton;
