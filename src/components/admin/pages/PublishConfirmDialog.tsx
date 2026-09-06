import { AlertCircle, Eye, EyeOff } from 'lucide-react';
import type { Section } from '@/lib/types';

interface PublishConfirmDialogProps {
  open: boolean;
  action: 'publish' | 'unpublish';
  pageTitle: string;
  sections: Section[];
  onConfirm: () => void;
  onCancel: () => void;
}

export default function PublishConfirmDialog({
  open,
  action,
  pageTitle,
  sections,
  onConfirm,
  onCancel
}: PublishConfirmDialogProps) {
  if (!open) return null;

  const publishedSections = sections.filter((s) => s.published);
  const isPublish = action === 'publish';
  const warnings: string[] = [];

  if (isPublish) {
    const empty = publishedSections.filter((s) => !s.title && !s.content?.items?.length);
    if (empty.length > 0) {
      warnings.push(`${empty.length} published section${empty.length === 1 ? ' has' : 's have'} no title or content.`);
    }
    if (sections.length === 0) {
      warnings.push('Page has no sections.');
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-charcoal rounded-xl border border-stone/20 p-6 w-full max-w-md mx-4 shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${isPublish ? 'bg-green-500/10' : 'bg-stone/10'}`}>
            {isPublish ? (
              <Eye className="w-5 h-5 text-green-400" />
            ) : (
              <EyeOff className="w-5 h-5 text-stone" />
            )}
          </div>
          <h2 className="text-lg font-medium text-warm-white font-heading">
            {isPublish ? 'Publish' : 'Unpublish'} Page
          </h2>
        </div>
        <p className="text-stone text-sm leading-relaxed mb-4">
          {isPublish
            ? <>Are you sure you want to publish <span className="text-warm-white font-medium">"{pageTitle}"</span>? This will make it visible to all visitors.</>
            : <>Are you sure you want to unpublish <span className="text-warm-white font-medium">"{pageTitle}"</span>? This will hide it from all visitors.</>
          }
        </p>

        {warnings.length > 0 && (
          <div className="mb-4 p-3 bg-gold/5 border border-gold/20 rounded-lg">
            {warnings.map((w, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-gold">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{w}</span>
              </div>
            ))}
          </div>
        )}

        {isPublish && (
          <div className="mb-4 p-3 bg-charcoal/50 border border-stone/10 rounded-lg text-xs text-stone space-y-1">
            <p>{publishedSections.length} section{publishedSections.length === 1 ? '' : 's'} will be visible</p>
            <p>{sections.length - publishedSections.length} draft section{sections.length - publishedSections.length === 1 ? '' : 's'} will remain hidden</p>
          </div>
        )}

        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm text-stone hover:text-warm-white bg-charcoal border border-stone/20 rounded-lg hover:border-stone/40 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm text-warm-white rounded-lg transition-colors ${
              isPublish
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-stone/20 hover:bg-stone/30 border border-stone/20'
            }`}
          >
            {isPublish ? 'Publish' : 'Unpublish'}
          </button>
        </div>
      </div>
    </div>
  );
}
