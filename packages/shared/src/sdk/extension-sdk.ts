import { WorkbenchEvents } from '../events/workbench-events';
import { Permission } from '../permissions/permission';

export interface IExtensionWorkspace {
  getRootPath(): string | null;
  readFile(relativePath: string): Promise<string>;
  writeFile(relativePath: string, content: string): Promise<void>;
  exists(relativePath: string): Promise<boolean>;
  findFiles(pattern: string): Promise<string[]>;
}

export interface IExtensionEditor {
  getActiveFile(): string | null;
  openFile(relativePath: string): Promise<void>;
}

export interface IExtensionLayout {
  getProfile(): string;
  applyProfile(profileId: string): Promise<void>;
  moveDock(position: 'bottom' | 'left' | 'right'): void;
  toggleDock(): void;
}

export interface IExtensionTerminal {
  execute(command: string): Promise<string>;
}

export interface IExtensionGit {
  getStatus(): Promise<string>;
  stage(file: string): Promise<void>;
  commit(message: string): Promise<void>;
}

export interface IExtensionAi {
  chat(prompt: string): Promise<string>;
  complete(prompt: string): Promise<string>;
}

export interface IExtensionStorage {
  get<T>(key: string): T | undefined;
  set<T>(key: string, value: T): Promise<void>;
  clear(): Promise<void>;
}

export interface IExtensionConfiguration {
  get<T>(key: string): T | undefined;
}

export interface IExtensionLogger {
  info(message: string, ...args: any[]): void;
  warn(message: string, ...args: any[]): void;
  error(message: string, ...args: any[]): void;
}

export interface ExtensionContext {
  readonly extensionId: string;
  readonly permissions: ReadonlySet<Permission>;
  readonly workspace: IExtensionWorkspace;
  readonly editor: IExtensionEditor;
  readonly layout: IExtensionLayout;
  readonly terminal: IExtensionTerminal;
  readonly git: IExtensionGit;
  readonly ai: IExtensionAi;
  readonly commands: {
    register(id: string, handler: (...args: any[]) => any): void;
    execute(id: string, ...args: any[]): Promise<any>;
  };
  readonly events: {
    on(event: WorkbenchEvents, callback: (payload: any) => void): () => void;
    emit(event: WorkbenchEvents, payload: any): void;
  };
  readonly storage: IExtensionStorage;
  readonly configuration: IExtensionConfiguration;
  readonly logger: IExtensionLogger;
}
