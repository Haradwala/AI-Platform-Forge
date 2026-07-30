/**
 * DockAnimations.ts — Spring Physics Interpolation for WorkbenchDock
 */

export interface SpringConfig {
  stiffness: number;
  damping: number;
  mass: number;
}

export const DEFAULT_SPRING_CONFIG: SpringConfig = {
  stiffness: 0.18,
  damping: 0.82,
  mass: 1.0,
};

/**
 * Performs spring interpolation step between current and target height in pixels.
 */
export function springStep(
  currentPx: number,
  targetPx: number,
  currentVelocity: number,
  config: SpringConfig = DEFAULT_SPRING_CONFIG
): { nextPx: number; nextVelocity: number; settled: boolean } {
  const displacement = targetPx - currentPx;
  const force = displacement * config.stiffness;
  const dampingForce = currentVelocity * (1 - config.damping);

  const nextVelocity = (currentVelocity + force - dampingForce) * config.mass;
  const nextPx = currentPx + nextVelocity;

  const settled = Math.abs(displacement) < 0.5 && Math.abs(nextVelocity) < 0.1;

  return {
    nextPx: settled ? targetPx : nextPx,
    nextVelocity: settled ? 0 : nextVelocity,
    settled,
  };
}
