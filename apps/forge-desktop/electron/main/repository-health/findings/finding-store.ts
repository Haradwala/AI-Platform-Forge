import { Finding, FindingSeverity, FindingCategory } from '../contracts/health-types';

export class FindingStore {
  private findings: Finding[] = [];

  setFindings(newFindings: Finding[]): void {
    this.findings = [...newFindings];
  }

  getFindings(): Finding[] {
    return [...this.findings];
  }

  filter(severity?: FindingSeverity, category?: FindingCategory): Finding[] {
    return this.findings.filter((f) => {
      if (severity && f.severity !== severity) return false;
      if (category && f.category !== category) return false;
      return true;
    });
  }

  getFixableFindings(): Finding[] {
    return this.findings.filter((f) => f.autoFixAvailable);
  }
}
