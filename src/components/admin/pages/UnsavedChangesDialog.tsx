import { AlertTriangle } from 'lucide-react';

interface UnsavedChangesDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function UnsavedChangesDialog({ open, onConfirm, onCancel }: UnsavedChangesDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-charcoal rounded-xl border border-stone/20 p-6 w-full max-w-md mx-4 shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-shrink-0 w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-gold" />
          </div>
          <h2 className="text-lg font-medium text-warm-white font-heading">Unsaved Changes</h2>
        </div>
        <p className="text-stone text-sm leading-relaxed mb-6">
          You have unsaved changes that will be lost if you leave this page. Do you want to save your changes before leaving?
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm text-stone hover:text-warm-white bg-charcoal border border-stone/20 rounded-lg hover:border-stone/40 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm text-warm-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
          >
            Discard Changes
          </button>
        </div>
      </div>
    </div>
  );
}
