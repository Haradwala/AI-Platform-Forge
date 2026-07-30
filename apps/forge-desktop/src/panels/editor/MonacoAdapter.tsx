import React, { useRef, useEffect } from 'react';
import MonacoEditor, { Monaco } from '@monaco-editor/react';
import { useEditorStore, EditorTab } from '../../stores/editor-store';
import { useThemeStore } from '../../stores/theme-store';

interface MonacoAdapterProps {
  readonly tab: EditorTab;
}

export const MonacoAdapter: React.FC<MonacoAdapterProps> = ({ tab }) => {
  const { updateContent, saveActiveFile } = useEditorStore();
  const { activeThemeId } = useThemeStore();
  const editorRef = useRef<any>(null);

  const handleEditorDidMount = (editor: any, monaco: Monaco) => {
    editorRef.current = editor;

    // Register Save command (Ctrl+S)
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, async () => {
      if (typeof window !== 'undefined' && window.forge) {
        await saveActiveFile(async (filePath, content) => {
          await window.forge.invoke('workspace:write-file', filePath, content);
        });
      }
    });
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      updateContent(tab.path, value);
    }
  };

  // Detect file language based on file extension
  const getLanguage = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'ts':
      case 'tsx':
        return 'typescript';
      case 'js':
      case 'jsx':
        return 'javascript';
      case 'json':
        return 'json';
      case 'html':
        return 'html';
      case 'css':
        return 'css';
      case 'md':
        return 'markdown';
      case 'py':
        return 'python';
      case 'sh':
      case 'bash':
        return 'shell';
      default:
        return 'plaintext';
    }
  };

  const monacoTheme = activeThemeId.includes('light') ? 'light' : 'vs-dark';

  return React.createElement(MonacoEditor, {
    height: '100%',
    language: getLanguage(tab.name),
    theme: monacoTheme,
    value: tab.content,
    onChange: handleEditorChange,
    onMount: handleEditorDidMount,
    options: {
      fontSize: 13,
      minimap: { enabled: false },
      automaticLayout: true,
      wordWrap: 'on',
      tabSize: 2,
    },
  });
};

export default MonacoAdapter;
