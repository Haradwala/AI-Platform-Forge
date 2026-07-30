import { Permission, TrustLevel } from '../permissions/permission';

export interface ForgeExtensionManifest {
  manifestVersion: number;
  sdkVersion: string;
  minimumSdkVersion?: string;
  maximumSdkVersion?: string;
  engine: string;
  id: string;
  publisher: string;
  displayName: string;
  version: string;
  description: string;
  license: string;
  homepage?: string;
  repository?: string;
  categories: string[];
  keywords: string[];
  activationEvents: string[];
  permissions: Permission[];
  trustLevel: TrustLevel;
  contributes?: {
    commands?: Array<{
      id: string;
      title: string;
      category?: string;
    }>;
    panels?: Array<{
      id: string;
      title: string;
      icon?: string;
    }>;
    themes?: Array<{
      id: string;
      label: string;
      uiTheme: string;
      path: string;
    }>;
    views?: Array<{
      id: string;
      name: string;
      location?: string;
    }>;
    menus?: Record<string, any>;
  };
}
