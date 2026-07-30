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
export declare class CallGraph {
    private readonly edges;
    private readonly callersByCallee;
    private readonly calleesByCaller;
    clear(): void;
    addCall(edge: CallEdge): void;
    getCallers(callee: string): CallEdge[];
    getCallees(caller: string): CallEdge[];
    getAsyncChain(startFunction: string): string[];
    isRecursive(functionName: string): boolean;
    removeFileCalls(filePath: string): void;
    getAllEdges(): CallEdge[];
}
