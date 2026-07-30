/**
 * ImportRepositoryDialog.tsx — Phase 25-28 Repository Import Modal Dialog
 *
 * Allows importing repositories from GitHub, GitLab, Bitbucket, Local Folders, ZIP, Templates.
 */

import React, { useState } from 'react';
import { useProjectStore } from '../../stores/project-store';
import { RepositoryDescriptor } from '../../../electron/main/ai/contracts/execution-contracts';

interface ImportRepositoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (targetPath: string) => void;
}

export const ImportRepositoryDialog: React.FC<ImportRepositoryDialogProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [source, setSource] = useState<RepositoryDescriptor['source']>('github');
  const [url, setUrl] = useState('');
  const [branch, setBranch] = useState('');
  const [localPath, setLocalPath] = useState('');
  const [submodules, setSubmodules] = useState(false);
  const { importRepository, isImporting, importError } = useProjectStore();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const descriptor: RepositoryDescriptor = {
      source,
      url: source === 'local' ? localPath : url,
      branch: branch ? branch : undefined,
      submodules,
      localPath: source === 'local' ? localPath : undefined,
    };

    await importRepository(descriptor);
    const store = useProjectStore.getState();
    if (!store.importError && store.recentImports.length > 0) {
      const imported = store.recentImports[0];
      if (onSuccess) onSuccess(imported.targetPath);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-xl border border-zinc-700 bg-zinc-900 p-6 text-zinc-100 shadow-2xl">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <h2 className="text-lg font-semibold text-zinc-100">Import Repository into Forge</h2>
          <button
            onClick={onClose}
            className="rounded p-1 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">Import Source</label>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value as any)}
              className="w-full rounded border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="github">GitHub Repository</option>
              <option value="gitlab">GitLab</option>
              <option value="bitbucket">Bitbucket</option>
              <option value="local">Local Directory</option>
              <option value="zip">ZIP Archive</option>
            </select>
          </div>

          {source === 'local' ? (
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">Local Directory Path</label>
              <input
                type="text"
                placeholder="e.g. C:/Projects/my-app"
                value={localPath}
                onChange={(e) => setLocalPath(e.target.value)}
                required
                className="w-full rounded border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          ) : (
            <>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Repository URL</label>
                <input
                  type="text"
                  placeholder="https://github.com/org/repository.git"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                  className="w-full rounded border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Branch (Optional)</label>
                  <input
                    type="text"
                    placeholder="main"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full rounded border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-center pt-5">
                  <label className="flex items-center text-xs text-zinc-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={submodules}
                      onChange={(e) => setSubmodules(e.target.checked)}
                      className="mr-2 rounded border-zinc-700 bg-zinc-800 text-blue-600 focus:ring-0"
                    />
                    Include Submodules
                  </label>
                </div>
              </div>
            </>
          )}

          {importError && (
            <div className="rounded bg-red-950/60 border border-red-800 p-3 text-xs text-red-300">
              {importError}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isImporting}
              className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-50"
            >
              {isImporting ? 'Importing Stack...' : 'Import Workspace'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
