/**
 * runtime-profile-registry.ts — Runtime Profile Catalog Registry
 */
import { RuntimeProfile } from '../contracts/runtime-types';
export declare class RuntimeProfileRegistry {
    private profiles;
    constructor();
    private registerDefaults;
    registerProfile(profile: RuntimeProfile): void;
    getProfile(modelId: string): RuntimeProfile | null;
    listProfiles(filter?: {
        isLocal?: boolean;
        supportsVision?: boolean;
    }): RuntimeProfile[];
}
