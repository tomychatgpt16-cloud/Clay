import React from "react";
import { X, Download, FileText, ExternalLink } from "lucide-react";

interface ReceiptViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string | null;
  name: string | null;
}

export const ReceiptViewerModal: React.FC<ReceiptViewerModalProps> = ({
  isOpen,
  onClose,
  url,
  name
}) => {
  if (!isOpen || !url) return null;

  const isPdf = name?.toLowerCase().endsWith(".pdf") || url.toLowerCase().includes(".pdf");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            <div>
              <h3 className="text-sm font-semibold text-slate-900 truncate max-w-sm">
                {name || "Transaction Receipt"}
              </h3>
              <p className="text-[11px] text-slate-500">Verified document attachment</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={url}
              download={name || "receipt"}
              className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition"
              title="Download"
            >
              <Download className="w-4 h-4" />
            </a>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 flex-1 overflow-auto flex items-center justify-center bg-slate-100/50 min-h-[300px]">
          {isPdf ? (
            <div className="text-center p-8">
              <FileText className="w-16 h-16 text-slate-400 mx-auto mb-3" />
              <p className="text-sm text-slate-700 font-medium mb-4">PDF Document Attachment</p>
              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-xl hover:bg-slate-800 transition"
              >
                <span>Open PDF in New Window</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          ) : (
            <img
              src={url}
              alt={name || "Receipt"}
              className="max-h-[65vh] max-w-full object-contain rounded-lg shadow-md border border-slate-200"
            />
          )}
        </div>
      </div>
    </div>
  );
};
