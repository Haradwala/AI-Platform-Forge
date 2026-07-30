import { describe, it, expect } from 'vitest';
import pkg from '../package.json';

/**
 * Epic 1 — Bootstrap verification tests.
 * Validates that the package configuration is correct before any code runs.
 */
describe('forge-desktop package bootstrap', () => {
  it('should have the correct package name', () => {
    expect(pkg.name).toBe('@forge/desktop');
  });

  it('should have a version field', () => {
    expect(pkg.version).toMatch(/^\d+\.\d+\.\d+$/);
  });

  it('should declare electron as a dev dependency', () => {
    expect(pkg.devDependencies).toHaveProperty('electron');
  });

  it('should declare react as a dependency', () => {
    expect(pkg.dependencies).toHaveProperty('react');
  });

  it('should declare monaco-editor as a dependency', () => {
    expect(pkg.dependencies).toHaveProperty('monaco-editor');
  });

  it('should declare xterm as a dependency', () => {
    expect(pkg.dependencies).toHaveProperty('xterm');
  });

  it('should declare zustand as a dependency', () => {
    expect(pkg.dependencies).toHaveProperty('zustand');
  });

  it('should declare tailwindcss as a dev dependency', () => {
    expect(pkg.devDependencies).toHaveProperty('tailwindcss');
  });

  it('should have a dev script', () => {
    expect(pkg.scripts).toHaveProperty('dev');
  });

  it('should have a build script', () => {
    expect(pkg.scripts).toHaveProperty('build');
  });

  it('should have a test script', () => {
    expect(pkg.scripts).toHaveProperty('test');
  });

  it('should point main to the correct Electron entry', () => {
    expect(pkg.main).toBe('dist-electron/main/index.js');
  });
});
