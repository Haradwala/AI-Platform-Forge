import type { IDependencyGraph } from './interfaces';
/**
 * Graph exporter — pure functions, no side effects, no Electron dependencies.
 *
 * Exports the dependency graph in three formats:
 * - json   → serialized IDependencyGraph
 * - mermaid → Mermaid TD diagram
 * - dot    → Graphviz DOT language
 */
export declare function exportJson(graph: IDependencyGraph): string;
/**
 * Generates a Mermaid TD (top-down) dependency graph.
 * Node IDs are sanitized for Mermaid compatibility.
 */
export declare function exportMermaid(graph: IDependencyGraph): string;
/**
 * Generates a Graphviz DOT language dependency graph.
 * Nodes are colored by lifetime.
 */
export declare function exportDot(graph: IDependencyGraph): string;
