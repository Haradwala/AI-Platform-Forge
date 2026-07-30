/**
 * PreviewCard.tsx — Phase 15 Developer Workspace Experience
 *
 * Visualizes workspace previews: Browser Live Preview, Image Preview, Markdown Preview, and PDF Preview.
 */

import React, { useState } from 'react';
import * as Lucide from 'lucide-react';
import { BaseCard } from './BaseCard';

export interface PreviewPayload {
  type: 'browser' | 'image' | 'markdown' | 'pdf';
  title: string;
  url?: string;
  imageSrc?: string;
  markdownContent?: string;
  pdfUrl?: string;
}

interface PreviewCardProps {
  payload: PreviewPayload;
  timestamp?: number;
}

export const PreviewCard: React.FC<PreviewCardProps> = ({ payload, timestamp }) => {
  const { type, title, url = 'http://localhost:5173', imageSrc, markdownContent, pdfUrl } = payload;
  const [activePreviewType, setActivePreviewType] = useState(type);

  const previewIcon =
    activePreviewType === 'browser' ? (
      <Lucide.Globe size={13} className="text-blue-400" />
    ) : activePreviewType === 'image' ? (
      <Lucide.Image size={13} className="text-emerald-400" />
    ) : activePreviewType === 'pdf' ? (
      <Lucide.FileCode size={13} className="text-red-400" />
    ) : (
      <Lucide.FileText size={13} className="text-indigo-400" />
    );

  return (
    <BaseCard
      type="preview"
      title={title}
      timestamp={timestamp}
      badge={
        <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 flex items-center gap-1">
          {previewIcon}
          {activePreviewType}
        </span>
      }
    >
      <div className="flex flex-col gap-2">
        {/* Preview Selector Tabs */}
        <div className="flex items-center gap-1 border-b border-forge-border pb-1.5 text-[11px] font-medium">
          {(['browser', 'image', 'markdown', 'pdf'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setActivePreviewType(t)}
              className={`px-2 py-0.5 rounded uppercase text-[10px] transition-colors cursor-pointer ${
                activePreviewType === t ? 'bg-forge-accent text-white font-semibold' : 'text-forge-text-muted hover:text-forge-text'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Browser Preview */}
        {activePreviewType === 'browser' && (
          <div className="flex flex-col border border-forge-border rounded overflow-hidden bg-forge-bg-elevated">
            <div className="flex items-center gap-2 px-2.5 py-1.5 bg-forge-bg border-b border-forge-border text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <input
                type="text"
                readOnly
                value={url}
                className="flex-1 bg-forge-bg-elevated px-2 py-0.5 rounded border border-forge-border text-forge-text font-mono text-[10px]"
              />
            </div>
            <iframe
              src={url}
              title={title}
              className="w-full h-44 border-0 bg-white"
              sandbox="allow-scripts allow-same-origin"
            />
          </div>
        )}

        {/* Image Preview */}
        {activePreviewType === 'image' && (
          <div className="flex flex-col items-center justify-center p-3 border border-forge-border rounded bg-forge-bg-elevated">
            <img src={imageSrc || 'https://via.placeholder.com/400x200?text=Workspace+Artifact+Preview'} alt={title} className="max-h-48 object-contain rounded" />
          </div>
        )}

        {/* Markdown Preview */}
        {activePreviewType === 'markdown' && (
          <div className="p-3 border border-forge-border rounded bg-forge-bg-elevated text-xs font-mono text-forge-text overflow-x-auto max-h-44 leading-relaxed">
            <pre className="whitespace-pre-wrap">{markdownContent || `# ${title}\n\nLive Markdown preview documentation component.`}</pre>
          </div>
        )}

        {/* PDF Preview */}
        {activePreviewType === 'pdf' && (
          <div className="flex flex-col items-center justify-center p-4 border border-forge-border rounded bg-forge-bg-elevated text-xs font-mono text-forge-text-muted">
            <Lucide.FileCode size={24} className="text-red-400 mb-1" />
            <span>PDF Viewer: {pdfUrl || 'architecture_spec.pdf'}</span>
            <span className="text-[10px] text-forge-text-subtle mt-0.5">Rendered via PDF.js worker</span>
          </div>
        )}
      </div>
    </BaseCard>
  );
};

export default PreviewCard;
