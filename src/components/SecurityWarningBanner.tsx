import React from "react";
import { ShieldAlert, ArrowRight, X } from "lucide-react";

interface SecurityWarningBannerProps {
  onOpenChangePassword: () => void;
  onDismiss?: () => void;
}

export const SecurityWarningBanner: React.FC<SecurityWarningBannerProps> = ({
  onOpenChangePassword,
  onDismiss,
}) => {
  return (
    <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2.5 sm:px-6 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-700 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <p className="text-xs text-amber-900 font-medium">
            <strong className="font-semibold text-amber-950">Security Notice: </strong>
            Your default password is currently being used. Please change it to a stronger password in Settings.
          </p>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          <button
            onClick={onOpenChangePassword}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold shadow-xs transition cursor-pointer"
          >
            <span>Change Password Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="p-1 text-amber-700/70 hover:text-amber-900 hover:bg-amber-500/10 rounded-md transition cursor-pointer"
              title="Dismiss for this session"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
