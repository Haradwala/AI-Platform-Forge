import { IDesktopContainer } from '../container/interfaces';
import { IWorkspaceService, IDesktopLogger } from '../container/service-interfaces';
import { ForgeExtensionManifest } from '@forge/shared';
import { RuntimeKernel } from './runtime-kernel';
export declare class PlatformInspectorService {
    private readonly container;
    private readonly workspaceService;
    private readonly logger;
    constructor(container: IDesktopContainer, workspaceService: IWorkspaceService, logger: IDesktopLogger);
    generateDiagnostics(manifests?: ForgeExtensionManifest[]): void;
    generateRuntimeDiagnostics(kernel: RuntimeKernel): void;
}
