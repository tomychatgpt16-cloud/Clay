import React, { useState } from "react";
import { FileSpreadsheet, Download, X, Eye, CheckCircle2 } from "lucide-react";
import { api } from "../api";

interface DailyClosingPromptBannerProps {
  message?: string;
  onOpenModal: () => void;
  onDismiss: () => void;
  date?: string;
}

export const DailyClosingPromptBanner: React.FC<DailyClosingPromptBannerProps> = ({
  message = "New entry recorded for today!",
  onOpenModal,
  onDismiss,
  date
}) => {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const targetDate = date || new Date().toISOString().split("T")[0];

  const handleQuickDownload = async () => {
    setDownloading(true);
    try {
      await api.downloadDailyClosingExcel(targetDate);
      setDownloaded(true);
      setTimeout(() => {
        setDownloaded(false);
      }, 4000);
    } catch (err) {
      console.error("Quick export error:", err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-md w-full animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-2xl border border-teal-500/40 flex flex-col gap-3 backdrop-blur-md">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-500/20 border border-teal-400/30 text-teal-300 flex items-center justify-center shrink-0">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white">{message}</span>
                <span className="px-1.5 py-0.2 rounded bg-teal-500/30 text-teal-300 text-[9px] font-mono uppercase">
                  {targetDate}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-tight mt-0.5">
                Keep your records safe: Save today's Excel closing statement.
              </p>
            </div>
          </div>
          <button
            onClick={onDismiss}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2 pt-1 border-t border-slate-800">
          <button
            onClick={handleQuickDownload}
            disabled={downloading}
            className="flex-1 py-1.5 px-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition cursor-pointer disabled:opacity-50"
          >
            {downloading ? (
              <>
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Exporting Excel...</span>
              </>
            ) : downloaded ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-200" />
                <span>Excel Downloaded!</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Download Today's Excel (.xlsx)</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              onOpenModal();
              onDismiss();
            }}
            className="py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-medium flex items-center gap-1 transition cursor-pointer"
          >
            <Eye className="w-3 h-3" />
            <span>Summary</span>
          </button>
        </div>
      </div>
    </div>
  );
};
