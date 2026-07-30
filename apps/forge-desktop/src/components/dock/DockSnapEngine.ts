/**
 * DockSnapEngine.ts — Pixel-Based Snap Engine for Forge WorkbenchDock
 *
 * Computes exact target snap heights in pixels based on viewport height,
 * mouse drag position, and drag velocity vector.
 */

export type SnapPointName = 'hidden' | 'peek' | 'quarter' | 'half' | 'threeQuarter' | 'full';

export interface SnapTarget {
  name: SnapPointName;
  heightPx: number;
  ratio: number;
}

export class DockSnapEngine {
  public static readonly PEEK_HEIGHT_PX = 80;
  public static readonly HANDLE_ONLY_HEIGHT_PX = 14;

  /**
   * Calculates discrete snap targets in pixels for the current viewport height.
   */
  static getSnapTargets(viewportHeightPx: number): SnapTarget[] {
    const vh = Math.max(viewportHeightPx, 300);
    return [
      { name: 'hidden', heightPx: this.HANDLE_ONLY_HEIGHT_PX, ratio: this.HANDLE_ONLY_HEIGHT_PX / vh },
      { name: 'peek', heightPx: this.PEEK_HEIGHT_PX, ratio: this.PEEK_HEIGHT_PX / vh },
      { name: 'quarter', heightPx: Math.round(vh * 0.25), ratio: 0.25 },
      { name: 'half', heightPx: Math.round(vh * 0.50), ratio: 0.50 },
      { name: 'threeQuarter', heightPx: Math.round(vh * 0.70), ratio: 0.70 },
      { name: 'full', heightPx: vh - 40, ratio: 0.95 },
    ];
  }

  /**
   * Finds nearest snap target based on current drag height in pixels and drag velocity.
   */
  static findNearestSnap(
    currentHeightPx: number,
    velocityPx: number, // positive = dragging upward / expanding, negative = dragging downward / collapsing
    viewportHeightPx: number
  ): SnapTarget {
    const targets = this.getSnapTargets(viewportHeightPx);

    // High velocity flick handling (> 400px/s)
    if (Math.abs(velocityPx) > 400) {
      if (velocityPx > 0) {
        // Flick upward -> find next higher target
        const higher = targets.filter((t) => t.heightPx > currentHeightPx);
        return higher.length > 0 ? higher[0] : targets[targets.length - 1];
      } else {
        // Flick downward -> find next lower target
        const lower = targets.filter((t) => t.heightPx < currentHeightPx);
        return lower.length > 0 ? lower[lower.length - 1] : targets[0];
      }
    }

    // Distance-based nearest snap
    let minDistance = Infinity;
    let bestTarget = targets[1]; // Default to peek

    for (const target of targets) {
      const distance = Math.abs(currentHeightPx - target.heightPx);
      if (distance < minDistance) {
        minDistance = distance;
        bestTarget = target;
      }
    }

    return bestTarget;
  }
}
