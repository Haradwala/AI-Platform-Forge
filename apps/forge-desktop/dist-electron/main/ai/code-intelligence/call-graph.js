"use strict";
/**
 * call-graph.ts
 *
 * Call graph tracking:
 *  - Function -> Function
 *  - Method -> Method
 *  - Async call chains
 *  - Recursive call cycles
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CallGraph = void 0;
class CallGraph {
    edges = new Set();
    callersByCallee = new Map();
    calleesByCaller = new Map();
    clear() {
        this.edges.clear();
        this.callersByCallee.clear();
        this.calleesByCaller.clear();
    }
    addCall(edge) {
        this.edges.add(edge);
        const callers = this.callersByCallee.get(edge.callee) || new Set();
        callers.add(edge);
        this.callersByCallee.set(edge.callee, callers);
        const callees = this.calleesByCaller.get(edge.caller) || new Set();
        callees.add(edge);
        this.calleesByCaller.set(edge.caller, callees);
    }
    getCallers(callee) {
        const direct = Array.from(this.callersByCallee.get(callee) || []);
        if (direct.length > 0)
            return direct;
        const matches = [];
        for (const edge of this.edges) {
            if (edge.callee === callee || edge.callee.endsWith('.' + callee)) {
                matches.push(edge);
            }
        }
        return matches;
    }
    getCallees(caller) {
        return Array.from(this.calleesByCaller.get(caller) || []);
    }
    getAsyncChain(startFunction) {
        const visited = new Set();
        const chain = [];
        const traverse = (current) => {
            if (visited.has(current))
                return;
            visited.add(current);
            chain.push(current);
            const callees = this.getCallees(current);
            for (const edge of callees) {
                if (edge.isAsync) {
                    traverse(edge.callee);
                }
            }
        };
        traverse(startFunction);
        return chain;
    }
    isRecursive(functionName) {
        const callees = this.getCallees(functionName);
        return callees.some((e) => e.callee === functionName);
    }
    removeFileCalls(filePath) {
        for (const edge of Array.from(this.edges)) {
            if (edge.filePath === filePath) {
                this.edges.delete(edge);
                const callers = this.callersByCallee.get(edge.callee);
                if (callers)
                    callers.delete(edge);
                const callees = this.calleesByCaller.get(edge.caller);
                if (callees)
                    callees.delete(edge);
            }
        }
    }
    getAllEdges() {
        return Array.from(this.edges);
    }
}
exports.CallGraph = CallGraph;
//# sourceMappingURL=call-graph.js.map