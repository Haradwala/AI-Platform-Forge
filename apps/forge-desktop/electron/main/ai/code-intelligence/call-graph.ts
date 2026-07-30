/**
 * call-graph.ts
 *
 * Call graph tracking:
 *  - Function -> Function
 *  - Method -> Method
 *  - Async call chains
 *  - Recursive call cycles
 */

export interface CallEdge {
  caller: string;
  callee: string;
  isAsync: boolean;
  filePath: string;
  line: number;
}

export class CallGraph {
  private readonly edges = new Set<CallEdge>();
  private readonly callersByCallee = new Map<string, Set<CallEdge>>();
  private readonly calleesByCaller = new Map<string, Set<CallEdge>>();

  clear(): void {
    this.edges.clear();
    this.callersByCallee.clear();
    this.calleesByCaller.clear();
  }

  addCall(edge: CallEdge): void {
    this.edges.add(edge);

    const callers = this.callersByCallee.get(edge.callee) || new Set();
    callers.add(edge);
    this.callersByCallee.set(edge.callee, callers);

    const callees = this.calleesByCaller.get(edge.caller) || new Set();
    callees.add(edge);
    this.calleesByCaller.set(edge.caller, callees);
  }

  getCallers(callee: string): CallEdge[] {
    const direct = Array.from(this.callersByCallee.get(callee) || []);
    if (direct.length > 0) return direct;

    const matches: CallEdge[] = [];
    for (const edge of this.edges) {
      if (edge.callee === callee || edge.callee.endsWith('.' + callee)) {
        matches.push(edge);
      }
    }
    return matches;
  }

  getCallees(caller: string): CallEdge[] {
    return Array.from(this.calleesByCaller.get(caller) || []);
  }

  getAsyncChain(startFunction: string): string[] {
    const visited = new Set<string>();
    const chain: string[] = [];

    const traverse = (current: string) => {
      if (visited.has(current)) return;
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

  isRecursive(functionName: string): boolean {
    const callees = this.getCallees(functionName);
    return callees.some((e) => e.callee === functionName);
  }

  removeFileCalls(filePath: string): void {
    for (const edge of Array.from(this.edges)) {
      if (edge.filePath === filePath) {
        this.edges.delete(edge);

        const callers = this.callersByCallee.get(edge.callee);
        if (callers) callers.delete(edge);

        const callees = this.calleesByCaller.get(edge.caller);
        if (callees) callees.delete(edge);
      }
    }
  }

  getAllEdges(): CallEdge[] {
    return Array.from(this.edges);
  }
}
