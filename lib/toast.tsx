import { toast as sonnerToast } from 'sonner'
import {
  CheckCircleIcon,
  XCircleIcon,
  AlertIcon,
  InfoIcon,
} from '@/components/icons'

interface ToastOptions {
  duration?: number
  description?: string
}

/**
 * Enhanced toast notification utilities with consistent styling
 */
export const toast = {
  success: (message: string, options?: ToastOptions) => {
    return sonnerToast.success(message, {
      duration: options?.duration || 4000,
      description: options?.description,
      icon: (
        <CheckCircleIcon
          className="h-5 w-5 text-green-600"
          aria-hidden="true"
        />
      ),
    })
  },

  error: (message: string, options?: ToastOptions) => {
    return sonnerToast.error(message, {
      duration: options?.duration || 5000,
      description: options?.description,
      icon: (
        <XCircleIcon
          className="h-5 w-5 text-red-600"
          aria-hidden="true"
        />
      ),
    })
  },

  warning: (message: string, options?: ToastOptions) => {
    return sonnerToast.warning(message, {
      duration: options?.duration || 4500,
      description: options?.description,
      icon: (
        <AlertIcon
          className="h-5 w-5 text-yellow-600"
          aria-hidden="true"
        />
      ),
    })
  },

  info: (message: string, options?: ToastOptions) => {
    return sonnerToast.info(message, {
      duration: options?.duration || 4000,
      description: options?.description,
      icon: (
        <InfoIcon
          className="h-5 w-5 text-blue-600"
          aria-hidden="true"
        />
      ),
    })
  },

  loading: (message: string, options?: ToastOptions) => {
    return sonnerToast.loading(message, {
      duration: options?.duration || Infinity,
      description: options?.description,
    })
  },

  promise: <T,>(
    promise: Promise<T>,
    {
      loading,
      success,
      error,
    }: {
      loading: string
      success: string | ((data: T) => string)
      error: string | ((error: Error) => string)
    }
  ) => {
    return sonnerToast.promise(promise, {
      loading,
      success,
      error,
    })
  },

  dismiss: (toastId?: string | number) => {
    return sonnerToast.dismiss(toastId)
  },
}
