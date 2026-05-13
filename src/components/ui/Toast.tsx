import { useEffect, useState } from "react";
import { CheckCircle, XCircle, X } from "lucide-react";

export type ToastType = {
  id: string;
  message: string;
  type: "success" | "error";
};

type ToastProps = {
  toast: ToastType;
  onRemove: (id: string) => void;
};

function ToastItem({ toast, onRemove }: ToastProps) {
  useEffect(() => {
    if (toast.type === "success") {
      const t = setTimeout(() => onRemove(toast.id), 3500);
      return () => clearTimeout(t);
    }
  }, [toast, onRemove]);

  return (
    <div
      className={`
        flex items-start gap-3 px-4 py-3 rounded-card shadow-lg
        min-w-[280px] max-w-sm animate-fade-in
        ${toast.type === "success" ? "bg-success text-white" : "bg-error text-white"}
      `}
    >
      {toast.type === "success"
        ? <CheckCircle size={18} className="mt-0.5 shrink-0" />
        : <XCircle size={18} className="mt-0.5 shrink-0" />
      }
      <p className="text-sm font-medium flex-1">{toast.message}</p>
      <button
        onClick={() => onRemove(toast.id)}
        className="opacity-75 hover:opacity-100 transition-opacity shrink-0"
      >
        <X size={16} />
      </button>
    </div>
  );
}

type ToastContainerProps = {
  toasts: ToastType[];
  onRemove: (id: string) => void;
};

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onRemove={onRemove} />
      ))}
    </div>
  );
}

// Global toast hook
let addToastFn: ((message: string, type: "success" | "error") => void) | null = null;

export function useToastManager() {
  const [toasts, setToasts] = useState<ToastType[]>([]);

  addToastFn = (message, type) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return { toasts, removeToast };
}

export const toast = {
  success: (message: string) => addToastFn?.(message, "success"),
  error:   (message: string) => addToastFn?.(message, "error"),
};