import type { IVerificationMetrics } from './verification-types';

export class VerificationMetrics {
  private compileTotal = 0;
  private lintTotal = 0;
  private testTotal = 0;
  private scanTotal = 0;

  addMetrics(m: IVerificationMetrics): void {
    this.compileTotal += m.compileTimeMs;
    this.lintTotal += m.lintTimeMs;
    this.testTotal += m.testTimeMs;
    this.scanTotal += m.scanTimeMs;
  }

  getSummary() {
    return {
      compileTotalMs: this.compileTotal,
      lintTotalMs: this.lintTotal,
      testTotalMs: this.testTotal,
      scanTotalMs: this.scanTotal,
      grandTotalMs: this.compileTotal + this.lintTotal + this.testTotal + this.scanTotal,
    };
  }

  clear(): void {
    this.compileTotal = 0;
    this.lintTotal = 0;
    this.testTotal = 0;
    this.scanTotal = 0;
  }
}
