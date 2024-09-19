import React from "react";

interface BasicDialogProps {
  isOpen: boolean;
  title: string;
  content: React.ReactNode | string;
  onClose: () => void;
  onConfirm?: () => void;
  confirmButtonText?: string;
  cancelButtonText?: string;
}

const BasicDialog: React.FC<BasicDialogProps> = ({
  isOpen,
  title,
  content,
  onClose,
  onConfirm,
  confirmButtonText = "Confirm",
  cancelButtonText = "Cancel",
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative bg-white p-4 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="mt-2">{content}</div>
        <div className="mt-4 flex justify-end gap-2">
          {onConfirm && (
            <button
              onClick={() => {
                onConfirm();
              }}
              className="bg-blue-500 hover:bg-blue-600 transition-all text-white px-4 py-2 rounded"
            >
              {confirmButtonText}
            </button>
          )}
          <button
            onClick={onClose}
            className="bg-red-500 hover:bg-red-600 transition-all text-white px-4 py-2 rounded"
          >
            {cancelButtonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BasicDialog;
