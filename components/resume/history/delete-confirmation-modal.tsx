"use client";

import { useState } from "react";
import { AlertIcon, CloseIcon, SpinnerIcon } from "@/components/icons";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  fileName: string;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
}

export function DeleteConfirmationModal({
  isOpen,
  fileName,
  onConfirm,
  onCancel,
}: DeleteConfirmationModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={isDeleting ? undefined : onCancel}
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-main-background/5 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative bg-main-background/5 border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
            <AlertIcon className="w-6 h-6 text-red-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white mb-2">
              Delete Resume
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              Are you sure you want to delete{" "}
              <span className="text-white font-medium">{fileName}</span>? This
              action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={onCancel}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 border border-red-500 rounded-xl hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <SpinnerIcon className="animate-spin h-4 w-4" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
