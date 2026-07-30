import { RepositoryHealthOrchestrator } from '../orchestrator/repository-health-orchestrator';
import { HealthReport, RepositorySnapshot, Finding, HealthScanOptions, FindingSeverity, FindingCategory } from '../contracts/health-types';
import type { IDesktopEventBus } from '../../container/service-interfaces';

export class RepositoryHealthApplicationService {
  private orchestrator: RepositoryHealthOrchestrator;

  constructor(eventBus?: IDesktopEventBus) {
    this.orchestrator = new RepositoryHealthOrchestrator(eventBus);
  }

  async scanRepository(rootPath: string, options?: HealthScanOptions): Promise<HealthReport> {
    return this.orchestrator.runFullScan(rootPath, options);
  }

  async getHealthReport(): Promise<HealthReport | null> {
    return this.orchestrator.getLatestReport();
  }

  async getSnapshot(): Promise<RepositorySnapshot | null> {
    return this.orchestrator.getLatestSnapshot();
  }

  async getFindings(severity?: FindingSeverity, category?: FindingCategory): Promise<Finding[]> {
    const all = this.orchestrator.getFindings();
    return all.filter((f) => {
      if (severity && f.severity !== severity) return false;
      if (category && f.category !== category) return false;
      return true;
    });
  }
}
