import React from 'react';
import { DesktopEventBus } from '../eventbus/desktop-eventbus';

export interface IDockPanelLifecycle {
  onMount?(): Promise<void> | void;
  onFocus?(): Promise<void> | void;
  onBlur?(): Promise<void> | void;
  onHide?(): Promise<void> | void;
  onShow?(): Promise<void> | void;
  onClose?(): Promise<void> | void;
  onDestroy?(): Promise<void> | void;
}

export interface PanelCapabilities {
  readonly searchable?: boolean;
  readonly pinnable?: boolean;
  readonly closable?: boolean;
  readonly detachable?: boolean;
  readonly splitSupported?: boolean;
  readonly keyboardFocusable?: boolean;
  readonly contributesToolbar?: boolean;
}

export interface IPanelContribution {
  readonly id: string;
  readonly title: string;
  readonly icon: string; // Name of Lucide icon (e.g. 'folder', 'terminal', 'settings')
  readonly component: React.ComponentType<any>;
  readonly defaultVisible?: boolean;
  readonly order?: number;
  readonly preferredDock?: {
    readonly position: 'sidebar' | 'bottom' | 'left' | 'right';
    readonly order?: number;
  };
  readonly capabilities?: PanelCapabilities;
  readonly lifecycle?: IDockPanelLifecycle;
}

export interface ICommandContribution {
  readonly id: string;
  readonly title: string;
  readonly category?: string;
  readonly shortcut?: string;
  readonly handler: (...args: any[]) => any;
}

export interface IPluginContext {
  readonly eventBus: DesktopEventBus;
  readonly workspaceRoot: string | null;
  readonly panels: {
    register(panel: IPanelContribution): void;
  };
  readonly commands: {
    register(command: ICommandContribution): void;
  };
}

export interface IPlugin {
  readonly id: string;
  readonly name: string;
  readonly version: string;
  activate(context: IPluginContext): Promise<void> | void;
  deactivate?(): Promise<void> | void;
}
