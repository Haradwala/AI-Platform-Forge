export class RecoveryMetrics {
  private totalAttempts = 0;
  private successfulAttempts = 0;
  private totalDurationMs = 0;

  addAttempt(success: boolean, durationMs: number): void {
    this.totalAttempts++;
    if (success) {
      this.successfulAttempts++;
    }
    this.totalDurationMs += durationMs;
  }

  getStats() {
    return {
      totalAttempts: this.totalAttempts,
      successRate: this.totalAttempts > 0 ? (this.successfulAttempts / this.totalAttempts) * 100 : 100,
      averageDurationMs: this.totalAttempts > 0 ? this.totalDurationMs / this.totalAttempts : 0,
      totalDurationMs: this.totalDurationMs,
    };
  }

  clear(): void {
    this.totalAttempts = 0;
    this.successfulAttempts = 0;
    this.totalDurationMs = 0;
  }
}
