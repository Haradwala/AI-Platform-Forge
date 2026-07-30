"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DependencyResolver = void 0;
class DependencyResolver {
    resolveDependencies(filesList) {
        return filesList.map((file) => {
            const dependsOn = [];
            const cleanFile = file.toLowerCase();
            if (cleanFile.includes('app') || cleanFile.includes('main')) {
                // App depends on components
                filesList.forEach((f) => {
                    const cleanF = f.toLowerCase();
                    if (f !== file && (cleanF.includes('component') || cleanF.includes('service') || cleanF.includes('controller'))) {
                        dependsOn.push(f);
                    }
                });
            }
            else if (cleanFile.includes('controller')) {
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
exports.DependencyResolver = DependencyResolver;
//# sourceMappingURL=dependency-resolver.js.map