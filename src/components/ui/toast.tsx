'use client';

/**
 * Toast Notification System
 *
 * A production-ready toast notification system with:
 * - Multiple variants (success, error, warning, info)
 * - Auto-dismiss with configurable timeout
 * - Stack multiple toasts
 * - Smooth slide-in/out animations
 * - Bottom-right positioning
 * - Neumorphic design system integration
 */

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from 'react';
import { X, CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';

// ============================================================================
// Types
// ============================================================================

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration: number;
  createdAt: number;
}

export interface ToastContextValue {
  toasts: Toast[];
  showToast: (message: string, type: ToastType, duration?: number) => string;
  dismissToast: (id: string) => void;
}

// ============================================================================
// Context
// ============================================================================

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

// ============================================================================
// Hook
// ============================================================================

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

// ============================================================================
// Provider
// ============================================================================

interface ToastProviderProps {
  children: ReactNode;
  maxToasts?: number;
}

export function ToastProvider({ children, maxToasts = 5 }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const generateId = useCallback(() => {
    return `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType, duration: number = 5000): string => {
      const id = generateId();
      const newToast: Toast = {
        id,
        message,
        type,
        duration,
        createdAt: Date.now(),
      };

      setToasts((prevToasts) => {
        const updatedToasts = [...prevToasts, newToast];
        // Limit the number of visible toasts
        if (updatedToasts.length > maxToasts) {
          return updatedToasts.slice(-maxToasts);
        }
        return updatedToasts;
      });

      return id;
    },
    [generateId, maxToasts]
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  const contextValue: ToastContextValue = {
    toasts,
    showToast,
    dismissToast,
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
}

// ============================================================================
// Toast Container
// ============================================================================

interface ToastContainerProps {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}

function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    <div
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-3 pointer-events-none"
      role="region"
      aria-label="Notifications"
    >
      {toasts.map((toast, index) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onDismiss={onDismiss}
          index={index}
        />
      ))}
    </div>
  );
}

// ============================================================================
// Toast Item
// ============================================================================

interface ToastItemProps {
  toast: Toast;
  onDismiss: (id: string) => void;
  index: number;
}

function ToastItem({ toast, onDismiss, index }: ToastItemProps) {
  const [isExiting, setIsExiting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Handle enter animation
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  // Handle auto-dismiss
  useEffect(() => {
    if (toast.duration <= 0) return;

    const timer = setTimeout(() => {
      handleDismiss();
    }, toast.duration);

    return () => clearTimeout(timer);
  }, [toast.duration, toast.id]);

  const handleDismiss = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      onDismiss(toast.id);
    }, 300); // Match animation duration
  }, [onDismiss, toast.id]);

  const Icon = getToastIcon(toast.type);
  const styles = getToastStyles(toast.type);

  return (
    <div
      className={`
        pointer-events-auto
        flex items-start gap-3
        min-w-[320px] max-w-[420px]
        p-4 rounded-xl
        transition-all duration-300 ease-out
        ${styles.container}
        ${isVisible && !isExiting
          ? 'translate-x-0 opacity-100'
          : 'translate-x-full opacity-0'
        }
      `}
      style={{
        boxShadow: 'var(--shadow-neumorphic)',
        transitionDelay: `${index * 50}ms`,
      }}
      role="alert"
      aria-live={toast.type === 'error' ? 'assertive' : 'polite'}
    >
      {/* Icon */}
      <div className={`flex-shrink-0 ${styles.icon}`}>
        <Icon className="w-5 h-5" />
      </div>

      {/* Message */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium leading-5 ${styles.text}`}>
          {toast.message}
        </p>
      </div>

      {/* Dismiss Button */}
      <button
        onClick={handleDismiss}
        className={`
          flex-shrink-0
          p-1 rounded-lg
          transition-all duration-200
          hover:bg-black/10 dark:hover:bg-white/10
          focus:outline-none focus:ring-2 focus:ring-offset-1
          ${styles.dismissButton}
        `}
        aria-label="Dismiss notification"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Progress Bar (for auto-dismiss) */}
      {toast.duration > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 rounded-b-xl overflow-hidden">
          <div
            className={`h-full ${styles.progressBar} transition-transform duration-100 ease-linear origin-left`}
            style={{
              animation: `toast-progress ${toast.duration}ms linear forwards`,
            }}
          />
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Helper Functions
// ============================================================================

function getToastIcon(type: ToastType) {
  switch (type) {
    case 'success':
      return CheckCircle;
    case 'error':
      return XCircle;
    case 'warning':
      return AlertTriangle;
    case 'info':
      return Info;
  }
}

interface ToastStyles {
  container: string;
  icon: string;
  text: string;
  dismissButton: string;
  progressBar: string;
}

function getToastStyles(type: ToastType): ToastStyles {
  const baseContainer = 'bg-[var(--background-elevated)] border relative';

  switch (type) {
    case 'success':
      return {
        container: `${baseContainer} border-[var(--success)]/30`,
        icon: 'text-[var(--success)]',
        text: 'text-[var(--foreground)]',
        dismissButton: 'text-[var(--foreground-muted)] focus:ring-[var(--success)]',
        progressBar: 'bg-[var(--success)]',
      };
    case 'error':
      return {
        container: `${baseContainer} border-[var(--error)]/30`,
        icon: 'text-[var(--error)]',
        text: 'text-[var(--foreground)]',
        dismissButton: 'text-[var(--foreground-muted)] focus:ring-[var(--error)]',
        progressBar: 'bg-[var(--error)]',
      };
    case 'warning':
      return {
        container: `${baseContainer} border-[var(--warning)]/30`,
        icon: 'text-[var(--warning)]',
        text: 'text-[var(--foreground)]',
        dismissButton: 'text-[var(--foreground-muted)] focus:ring-[var(--warning)]',
        progressBar: 'bg-[var(--warning)]',
      };
    case 'info':
      return {
        container: `${baseContainer} border-[var(--info)]/30`,
        icon: 'text-[var(--info)]',
        text: 'text-[var(--foreground)]',
        dismissButton: 'text-[var(--foreground-muted)] focus:ring-[var(--info)]',
        progressBar: 'bg-[var(--info)]',
      };
  }
}

// ============================================================================
// Toast Component (for direct usage if needed)
// ============================================================================

export interface ToastProps {
  message: string;
  type: ToastType;
  onDismiss?: () => void;
  showDismiss?: boolean;
}

export function Toast({
  message,
  type,
  onDismiss,
  showDismiss = true,
}: ToastProps) {
  const Icon = getToastIcon(type);
  const styles = getToastStyles(type);

  return (
    <div
      className={`
        flex items-start gap-3
        p-4 rounded-xl
        ${styles.container}
      `}
      style={{ boxShadow: 'var(--shadow-neumorphic)' }}
      role="alert"
    >
      <div className={`flex-shrink-0 ${styles.icon}`}>
        <Icon className="w-5 h-5" />
      </div>
      <p className={`flex-1 text-sm font-medium ${styles.text}`}>{message}</p>
      {showDismiss && onDismiss && (
        <button
          onClick={onDismiss}
          className={`flex-shrink-0 p-1 rounded-lg transition-colors ${styles.dismissButton}`}
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

// ============================================================================
// Exports
// ============================================================================

export default Toast;
