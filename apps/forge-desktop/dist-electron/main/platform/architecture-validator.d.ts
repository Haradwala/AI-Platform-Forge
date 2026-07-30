import { IDesktopContainer } from '../container/interfaces';
import { ForgeExtensionManifest } from '@forge/shared';
export interface ArchitectureReport {
    success: boolean;
    timestamp: string;
    errors: string[];
    warnings: string[];
}
export declare class ArchitectureValidator {
    static validate(container: IDesktopContainer, manifests?: ForgeExtensionManifest[]): ArchitectureReport;
}
