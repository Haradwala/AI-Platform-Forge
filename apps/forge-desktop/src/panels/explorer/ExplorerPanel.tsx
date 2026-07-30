import React, { useState, useCallback } from 'react';
import * as Lucide from 'lucide-react';
import { useWorkspaceStore } from '../../stores/workspace-store';
import { useEditorStore } from '../../stores/editor-store';
import { WorkspaceClient } from '../../services/workspace-client';
import type { IFileTreeItem } from '../../../electron/main/container/service-interfaces';

// ─── File-type icon mapping ───────────────────────────────────────────────────

function getFileIcon(name: string): React.ReactElement {
  const ext = name.split('.').pop()?.toLowerCase() ?? '';
  const iconProps = { size: 13, className: 'shrink-0' };
  switch (ext) {
    case 'ts':
    case 'tsx':
      return React.createElement(Lucide.FileCode, { ...iconProps, className: 'shrink-0 text-blue-400' });
    case 'js':
    case 'jsx':
      return React.createElement(Lucide.FileCode, { ...iconProps, className: 'shrink-0 text-yellow-400' });
    case 'json':
      return React.createElement(Lucide.Braces, { ...iconProps, className: 'shrink-0 text-yellow-300' });
    case 'css':
      return React.createElement(Lucide.FileText, { ...iconProps, className: 'shrink-0 text-blue-300' });
    case 'html':
      return React.createElement(Lucide.FileCode, { ...iconProps, className: 'shrink-0 text-orange-400' });
    case 'md':
    case 'mdx':
      return React.createElement(Lucide.FileText, { ...iconProps, className: 'shrink-0 text-gray-300' });
    case 'py':
      return React.createElement(Lucide.FileCode, { ...iconProps, className: 'shrink-0 text-green-400' });
    case 'sh':
    case 'bash':
    case 'zsh':
    case 'ps1':
      return React.createElement(Lucide.Terminal, { ...iconProps, className: 'shrink-0 text-green-300' });
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
    case 'svg':
    case 'webp':
      return React.createElement(Lucide.Image, { ...iconProps, className: 'shrink-0 text-purple-400' });
    case 'yaml':
    case 'yml':
      return React.createElement(Lucide.Settings, { ...iconProps, className: 'shrink-0 text-red-400' });
    case 'toml':
    case 'ini':
      return React.createElement(Lucide.Settings, { ...iconProps, className: 'shrink-0 text-gray-400' });
    case 'lock':
      return React.createElement(Lucide.Lock, { ...iconProps, className: 'shrink-0 text-gray-500' });
    case 'gitignore':
    case 'git':
      return React.createElement(Lucide.GitBranch, { ...iconProps, className: 'shrink-0 text-orange-500' });
    default:
      return React.createElement(Lucide.File, { ...iconProps, className: 'shrink-0 text-forge-text-muted' });
  }
}

// ─── Tree Node ─────────────────────────────────────────────────────────────────

interface TreeNodeProps {
  item: IFileTreeItem;
  depth: number;
  expandedPaths: Set<string>;
  selectedPath: string | null;
  onToggle: (path: string) => void;
  onSelectFile: (item: IFileTreeItem) => void;
}

const TreeNode: React.FC<TreeNodeProps> = ({
  item,
  depth,
  expandedPaths,
  selectedPath,
  onToggle,
  onSelectFile,
}) => {
  const isExpanded = expandedPaths.has(item.path);
  const isSelected = selectedPath === item.path;
  const indent = depth * 12;

  const handleClick = () => {
    if (item.isDirectory) {
      onToggle(item.path);
    } else {
      onSelectFile(item);
    }
  };

  const rowClass = [
    'flex items-center gap-1.5 py-[2px] pr-2 rounded cursor-pointer select-none transition-colors duration-100 w-full text-left',
    isSelected
      ? 'bg-forge-accent/20 text-forge-text'
      : 'hover:bg-forge-bg-hover text-forge-text',
  ].join(' ');

  return React.createElement(
    React.Fragment,
    null,
    React.createElement(
      'div',
      {
        role: 'treeitem',
        'aria-expanded': item.isDirectory ? isExpanded : undefined,
        'aria-selected': isSelected,
        tabIndex: 0,
        className: rowClass,
        style: { paddingLeft: `${4 + indent}px` },
        onClick: handleClick,
        onKeyDown: (e: React.KeyboardEvent) => {
          if (e.key === 'Enter' || e.key === ' ') handleClick();
        },
      },
      // Chevron or spacer for files
      item.isDirectory
        ? React.createElement(
            'span',
            { className: 'text-forge-text-muted transition-transform duration-150', style: { transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' } },
            React.createElement(Lucide.ChevronRight, { size: 13 })
          )
        : React.createElement('span', { className: 'w-[13px] shrink-0' }),
      // Icon
      item.isDirectory
        ? React.createElement(
            isExpanded ? Lucide.FolderOpen : Lucide.Folder,
            { size: 13, className: 'shrink-0 text-forge-accent/80' }
          )
        : getFileIcon(item.name),
      // Label
      React.createElement(
        'span',
        { className: 'text-xs truncate leading-5' },
        item.name
      )
    ),
    // Children (if directory and expanded)
    item.isDirectory && isExpanded && item.children && item.children.length > 0
      ? React.createElement(
          'div',
          { role: 'group' },
          [...item.children]
            .sort((a, b) => {
              // Directories first, then alphabetical
              if (a.isDirectory !== b.isDirectory) return a.isDirectory ? -1 : 1;
              return a.name.localeCompare(b.name);
            })
            .map((child) =>
              React.createElement(TreeNode, {
                key: child.path,
                item: child,
                depth: depth + 1,
                expandedPaths,
                selectedPath,
                onToggle,
                onSelectFile,
              })
            )
        )
      : null
  );
};

// ─── ExplorerPanel ─────────────────────────────────────────────────────────────

export const ExplorerPanel: React.FC = () => {
  const { fileTree, rootPath, refreshTree } = useWorkspaceStore();
  const { openFile } = useEditorStore();

  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(() => {
    // Auto-expand the root on first load
    const s = new Set<string>();
    if (fileTree) s.add(fileTree.path);
    return s;
  });
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleToggle = useCallback((path: string) => {
    setExpandedPaths((prev) => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  }, []);

  const handleSelectFile = useCallback(
    async (item: IFileTreeItem) => {
      setSelectedPath(item.path);
      if (!item.isDirectory) {
        try {
          const content = await WorkspaceClient.readFile(item.path);
          openFile(item.path, item.name, content);
        } catch (err) {
          console.error('[ExplorerPanel] Failed to open file:', err);
        }
      }
    },
    [openFile]
  );

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshTree();
    } finally {
      setIsRefreshing(false);
    }
  };

  if (!fileTree || !rootPath) {
    return React.createElement(
      'div',
      { className: 'p-4 text-xs text-forge-text-muted text-center' },
      'No workspace open.'
    );
  }

  const rootName = rootPath.split(/[\\/]/).pop() ?? rootPath;

  return React.createElement(
    'div',
    { className: 'flex flex-col h-full w-full overflow-hidden', id: 'forge-explorer-panel' },

    // ── Toolbar ──────────────────────────────────────────────────────────────
    React.createElement(
      'div',
      { className: 'flex items-center justify-between px-2 py-1 border-b border-forge-border bg-forge-bg-elevated shrink-0' },
      React.createElement(
        'span',
        { className: 'text-[10px] font-bold uppercase tracking-wider text-forge-text-muted truncate' },
        rootName
      ),
      React.createElement(
        'button',
        {
          title: 'Refresh',
          onClick: handleRefresh,
          className: 'p-0.5 rounded hover:bg-forge-bg-hover text-forge-text-muted hover:text-forge-text transition-colors',
        },
        React.createElement(Lucide.RefreshCw, {
          size: 12,
          className: isRefreshing ? 'animate-spin' : '',
        })
      )
    ),

    // ── Tree ─────────────────────────────────────────────────────────────────
    React.createElement(
      'div',
      {
        role: 'tree',
        className: 'flex-1 overflow-y-auto overflow-x-hidden py-1',
        'aria-label': 'File Explorer',
      },
      // Render root's children directly (don't show the root folder itself)
      fileTree.children && fileTree.children.length > 0
        ? [...fileTree.children]
            .sort((a, b) => {
              if (a.isDirectory !== b.isDirectory) return a.isDirectory ? -1 : 1;
              return a.name.localeCompare(b.name);
            })
            .map((child) =>
              React.createElement(TreeNode, {
                key: child.path,
                item: child,
                depth: 0,
                expandedPaths,
                selectedPath,
                onToggle: handleToggle,
                onSelectFile: handleSelectFile,
              })
            )
        : React.createElement(
            'div',
            { className: 'p-4 text-xs text-forge-text-muted text-center' },
            'Empty workspace'
          )
    )
  );
};

export default ExplorerPanel;
