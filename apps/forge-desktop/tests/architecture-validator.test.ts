import { describe, it, expect, vi } from 'vitest';
import { ArchitectureValidator } from '../electron/main/platform/architecture-validator';
import { IDesktopContainer } from '../electron/main/container/interfaces';
import { ForgeExtensionManifest, Permission } from '@forge/shared';

describe('ArchitectureValidator', () => {
  const createMockContainer = (valid = true): IDesktopContainer => {
    return {
      register: () => {},
      registerConstant: () => {},
      resolve: (token: any) => ({ info: () => {}, warn: () => {}, error: () => {}, on: () => () => {}, emit: () => {}, getRootPath: () => '/mock' }),
      tryResolve: (token: any) => ({ info: () => {}, warn: () => {}, error: () => {}, on: () => () => {}, emit: () => {}, getRootPath: () => '/mock' }),
      validate: () => ({
        valid,
        errors: valid ? [] : [{ name: 'TestService', message: 'Resolution crash' }],
        warnings: [],
      }),
      initializeAll: async () => {},
      shutdownAll: async () => {},
      freeze: () => {},
      exportGraph: () => ({ nodes: [], links: [] }),
    } as unknown as IDesktopContainer;
  };

  it('passes on valid container and valid manifests', () => {
    const container = createMockContainer(true);
    const manifests: ForgeExtensionManifest[] = [
      {
        manifestVersion: 1,
        sdkVersion: '1.0.0',
        engine: '^1.0.0',
        id: 'ext1',
        publisher: 'forge',
        displayName: 'Ext 1',
        version: '1.0.0',
        description: 'Test',
        license: 'MIT',
        categories: [],
        keywords: [],
        activationEvents: [],
        permissions: [Permission.FilesystemRead],
        trustLevel: 'Trusted',
      },
    ];

    const report = ArchitectureValidator.validate(container, manifests);
    expect(report.success).toBe(true);
    expect(report.errors).toHaveLength(0);
  });

  it('fails if container validate() is invalid', () => {
    const container = createMockContainer(false);
    const report = ArchitectureValidator.validate(container, []);
    expect(report.success).toBe(false);
    expect(report.errors[0]).toContain('DI Container error');
  });

  it('fails on duplicate extension manifests ids', () => {
    const container = createMockContainer(true);
    const manifests: ForgeExtensionManifest[] = [
      {
        manifestVersion: 1,
        sdkVersion: '1.0.0',
        engine: '^1.0.0',
        id: 'duplicate-id',
        publisher: 'forge',
        displayName: 'Ext 1',
        version: '1.0.0',
        description: 'Test',
        license: 'MIT',
        categories: [],
        keywords: [],
        activationEvents: [],
        permissions: [],
        trustLevel: 'Trusted',
      },
      {
        manifestVersion: 1,
        sdkVersion: '1.0.0',
        engine: '^1.0.0',
        id: 'duplicate-id',
        publisher: 'forge',
        displayName: 'Ext 2',
        version: '1.0.0',
        description: 'Test',
        license: 'MIT',
        categories: [],
        keywords: [],
        activationEvents: [],
        permissions: [],
        trustLevel: 'Trusted',
      },
    ];

    const report = ArchitectureValidator.validate(container, manifests);
    expect(report.success).toBe(false);
    expect(report.errors[0]).toContain('Duplicate Extension ID');
  });

  it('fails if invalid permissions are requested', () => {
    const container = createMockContainer(true);
    const manifests: ForgeExtensionManifest[] = [
      {
        manifestVersion: 1,
        sdkVersion: '1.0.0',
        engine: '^1.0.0',
        id: 'ext1',
        publisher: 'forge',
        displayName: 'Ext 1',
        version: '1.0.0',
        description: 'Test',
        license: 'MIT',
        categories: [],
        keywords: [],
        activationEvents: [],
        permissions: ['invalid.permission' as any],
        trustLevel: 'Trusted',
      },
    ];

    const report = ArchitectureValidator.validate(container, manifests);
    expect(report.success).toBe(false);
    expect(report.errors[0]).toContain('requests invalid permission');
  });
});
