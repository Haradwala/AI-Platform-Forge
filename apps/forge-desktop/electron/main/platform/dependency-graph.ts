export class DependencyGraphService {
  private readonly imports = new Map<string, string[]>();
  private readonly references = new Map<string, string[]>();

  addImports(filePath: string, fileImports: string[]): void {
    this.imports.set(filePath, fileImports);
  }

  addReferences(filePath: string, fileReferences: string[]): void {
    for (const ref of fileReferences) {
      if (!this.references.has(ref)) {
        this.references.set(ref, []);
      }
      const list = this.references.get(ref)!;
      if (!list.includes(filePath)) {
        list.push(filePath);
      }
    }
  }

  removeFile(filePath: string): void {
    this.imports.delete(filePath);
    for (const [ref, list] of this.references.entries()) {
      const idx = list.indexOf(filePath);
      if (idx !== -1) {
        list.splice(idx, 1);
      }
      if (list.length === 0) {
        this.references.delete(ref);
      }
    }
  }

  getImports(filePath: string): string[] {
    return this.imports.get(filePath) || [];
  }

  getReferences(symbolName: string): string[] {
    return this.references.get(symbolName) || [];
  }

  findDependencyPath(from: string, to: string): string[] | null {
    const queue: Array<[string, string[]]> = [[from, [from]]];
    const visited = new Set<string>([from]);

    while (queue.length > 0) {
      const [curr, path] = queue.shift()!;
      if (curr === to) return path;

      const deps = this.imports.get(curr) || [];
      for (const dep of deps) {
        if (!visited.has(dep)) {
          visited.add(dep);
          queue.push([dep, [...path, dep]]);
        }
      }
    }
    return null;
  }

  findCircularDependencies(): string[][] {
    const visited = new Set<string>();
    const stack = new Set<string>();
    const cycles: string[][] = [];

    const dfs = (node: string, currentPath: string[]) => {
      visited.add(node);
      stack.add(node);

      const deps = this.imports.get(node) || [];
      for (const dep of deps) {
        if (!visited.has(dep)) {
          dfs(dep, [...currentPath, dep]);
        } else if (stack.has(dep)) {
          const idx = currentPath.indexOf(dep);
          if (idx !== -1) {
            cycles.push([...currentPath.slice(idx), dep]);
          }
        }
      }
      stack.delete(node);
    };

    for (const node of this.imports.keys()) {
      if (!visited.has(node)) {
        dfs(node, [node]);
      }
    }

    return cycles;
  }

  clear(): void {
    this.imports.clear();
    this.references.clear();
  }
}
