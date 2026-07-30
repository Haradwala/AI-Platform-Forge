"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindingStore = void 0;
class FindingStore {
    findings = [];
    setFindings(newFindings) {
        this.findings = [...newFindings];
    }
    getFindings() {
        return [...this.findings];
    }
    filter(severity, category) {
        return this.findings.filter((f) => {
            if (severity && f.severity !== severity)
                return false;
            if (category && f.category !== category)
                return false;
            return true;
        });
    }
    getFixableFindings() {
        return this.findings.filter((f) => f.autoFixAvailable);
    }
}
exports.FindingStore = FindingStore;
//# sourceMappingURL=finding-store.js.map