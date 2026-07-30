export interface IDependencyRelation {
  readonly file: string;
  readonly dependsOn: string[];
}

export class DependencyResolver {
  resolveDependencies(filesList: string[]): IDependencyRelation[] {
    return filesList.map((file) => {
      const dependsOn: string[] = [];
      const cleanFile = file.toLowerCase();

      if (cleanFile.includes('app') || cleanFile.includes('main')) {
        // App depends on components
        filesList.forEach((f) => {
          const cleanF = f.toLowerCase();
          if (f !== file && (cleanF.includes('component') || cleanF.includes('service') || cleanF.includes('controller'))) {
            dependsOn.push(f);
          }
        });
      } else if (cleanFile.includes('controller')) {
        // Controllers depend on services
        filesList.forEach((f) => {
          const cleanF = f.toLowerCase();
          if (f !== file && cleanF.includes('service')) {
            dependsOn.push(f);
          }
        });
      }

      return { file, dependsOn };
    });
  }
}
