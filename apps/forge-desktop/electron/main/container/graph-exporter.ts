import type { IDependencyGraph, IDependencyNode, IDependencyEdge } from './interfaces';

/**
 * Graph exporter — pure functions, no side effects, no Electron dependencies.
 *
 * Exports the dependency graph in three formats:
 * - json   → serialized IDependencyGraph
 * - mermaid → Mermaid TD diagram
 * - dot    → Graphviz DOT language
 */

// ─── JSON ─────────────────────────────────────────────────────────────────────

export function exportJson(graph: IDependencyGraph): string {
  // Symbols are not JSON-serializable — convert to string representations
  const serializable = {
    nodes: graph.nodes.map((n) => ({
      token: n.token.toString(),
      name: n.name,
      lifetime: n.lifetime,
      module: n.module ?? null,
    })),
    edges: graph.edges.map((e) => ({
      from: e.from.toString(),
      fromName: e.fromName,
      to: e.to.toString(),
      toName: e.toName,
    })),
  };
  return JSON.stringify(serializable, null, 2);
}

// ─── Mermaid ──────────────────────────────────────────────────────────────────

/**
 * Generates a Mermaid TD (top-down) dependency graph.
 * Node IDs are sanitized for Mermaid compatibility.
 */
export function exportMermaid(graph: IDependencyGraph): string {
  const lines: string[] = ['graph TD'];

  // Node declarations with lifetime annotation
  for (const node of graph.nodes) {
    const id = sanitizeMermaidId(node.name);
    const label = `${node.name} [${node.lifetime}]`;
    lines.push(`  ${id}["${label}"]`);
  }

  // Style by lifetime
  const lifetimeStyles: Record<string, string> = {
    singleton: 'fill:#1e3a5f,color:#a8d8ff,stroke:#4a9eff',
    transient: 'fill:#1e3f1e,color:#a8ffb8,stroke:#4aff6e',
    scoped:    'fill:#3f1e2e,color:#ffa8c8,stroke:#ff4a82',
  };

  for (const lifetime of ['singleton', 'transient', 'scoped'] as const) {
    const nodesOfType = graph.nodes.filter((n) => n.lifetime === lifetime);
    if (nodesOfType.length > 0) {
      const ids = nodesOfType.map((n) => sanitizeMermaidId(n.name)).join(',');
      lines.push(`  style ${ids} ${lifetimeStyles[lifetime]}`);
    }
  }

  // Edges
  for (const edge of graph.edges) {
    const from = sanitizeMermaidId(edge.fromName);
    const to   = sanitizeMermaidId(edge.toName);
    lines.push(`  ${from} --> ${to}`);
  }

  return lines.join('\n');
}

// ─── DOT (Graphviz) ──────────────────────────────────────────────────────────

/**
 * Generates a Graphviz DOT language dependency graph.
 * Nodes are colored by lifetime.
 */
export function exportDot(graph: IDependencyGraph): string {
  const lines: string[] = [
    'digraph DesktopContainer {',
    '  rankdir=TB;',
    '  node [shape=box, fontname="Helvetica", fontsize=11];',
    '  edge [fontsize=9];',
    '',
  ];

  const lifetimeColors: Record<string, string> = {
    singleton: '#1e3a5f',
    transient: '#1e3f1e',
    scoped:    '#3f1e2e',
  };

  const lifetimeFontColors: Record<string, string> = {
    singleton: '#a8d8ff',
    transient: '#a8ffb8',
    scoped:    '#ffa8c8',
  };

  // Nodes
  for (const node of graph.nodes) {
    const id    = sanitizeDotId(node.name);
    const label = `${node.name}\\n[${node.lifetime}]${node.module ? `\\n${node.module}` : ''}`;
    const bg    = lifetimeColors[node.lifetime] ?? '#333';
    const fg    = lifetimeFontColors[node.lifetime] ?? '#fff';
    lines.push(`  ${id} [label="${label}", style=filled, fillcolor="${bg}", fontcolor="${fg}"];`);
  }

  lines.push('');

  // Edges
  for (const edge of graph.edges) {
    const from = sanitizeDotId(edge.fromName);
    const to   = sanitizeDotId(edge.toName);
    lines.push(`  ${from} -> ${to};`);
  }

  lines.push('}');
  return lines.join('\n');
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function sanitizeMermaidId(name: string): string {
  return name.replace(/[^a-zA-Z0-9]/g, '_');
}

function sanitizeDotId(name: string): string {
  return name.replace(/[^a-zA-Z0-9_]/g, '_');
}
