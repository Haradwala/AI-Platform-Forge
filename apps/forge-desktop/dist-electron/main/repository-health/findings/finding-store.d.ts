import { Finding, FindingSeverity, FindingCategory } from '../contracts/health-types';
export declare class FindingStore {
    private findings;
    setFindings(newFindings: Finding[]): void;
    getFindings(): Finding[];
    filter(severity?: FindingSeverity, category?: FindingCategory): Finding[];
    getFixableFindings(): Finding[];
}
