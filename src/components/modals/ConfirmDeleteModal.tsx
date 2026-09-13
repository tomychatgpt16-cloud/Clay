import React, { useState } from "react";
import { AlertTriangle, Trash2, X, Loader2 } from "lucide-react";

export interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  title?: string;
  itemName?: string;
  description?: string;
  confirmButtonText?: string;
  isDangerous?: boolean;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete Record",
  itemName,
  description,
  confirmButtonText = "Delete Permanently",
  isDangerous = true
}) => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    try {
      setLoading(true);
      setErrorMessage(null);
      await onConfirm();
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred while deleting.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="confirm-delete-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={() => !loading && onClose()}
    >
      <div
        id="confirm-delete-modal-card"
        className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
              <Trash2 className="w-6 h-6" />
            </div>
            <button
              id="confirm-modal-close-btn"
              onClick={onClose}
              disabled={loading}
              className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors disabled:opacity-50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-4">
            <h3 id="confirm-modal-title" className="text-lg font-semibold text-slate-900">
              {title}
            </h3>
            <p id="confirm-modal-desc" className="mt-2 text-sm text-slate-600 leading-relaxed">
              {description ? (
                description
              ) : itemName ? (
                <>
                  Are you sure you want to permanently delete{" "}
                  <span className="font-semibold text-slate-900">"{itemName}"</span>?
                  This operation cannot be reversed.
                </>
              ) : (
                "Are you sure you want to delete this record? This operation cannot be reversed."
              )}
            </p>
          </div>

          {errorMessage && (
            <div
              id="confirm-modal-error-banner"
              className="mt-4 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2.5"
            >
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
              <div className="flex-1 font-medium">{errorMessage}</div>
            </div>
          )}

          <div className="mt-6 flex items-center justify-end gap-3 pt-2">
            <button
              id="confirm-modal-cancel-btn"
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              id="confirm-modal-delete-btn"
              type="button"
              onClick={handleConfirm}
              disabled={loading}
              className={`px-4 py-2 text-sm font-medium text-white rounded-xl transition-colors flex items-center gap-2 shadow-sm ${
                isDangerous
                  ? "bg-rose-600 hover:bg-rose-700 active:bg-rose-800"
                  : "bg-amber-600 hover:bg-amber-700 active:bg-amber-800"
              } disabled:opacity-50`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  <span>{confirmButtonText}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
