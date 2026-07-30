/**
 * planning-graph.ts
 *
 * Directed Acyclic Graph (DAG) task planner supporting dependency resolution,
 * cycle detection, topological sorting, parallel ready-node discovery, and status tracking.
 */
export interface GraphNode<T = any> {
    id: string;
    payload: T;
    dependencies: string[];
    status: 'pending' | 'running' | 'completed' | 'failed';
    error?: string;
}
export declare class PlanningGraph<T = any> {
    private readonly nodes;
    clear(): void;
    addNode(id: string, payload: T, dependencies?: string[]): void;
    getNode(id: string): GraphNode<T> | null;
    getAllNodes(): GraphNode<T>[];
    markStatus(id: string, status: GraphNode<T>['status'], error?: string): void;
    validate(): {
        valid: boolean;
        reason?: string;
    };
    topologicalSort(): string[];
    getReadyNodes(completedNodeIds?: string[]): GraphNode<T>[];
    isCompleted(): boolean;
    hasFailures(): boolean;
}
