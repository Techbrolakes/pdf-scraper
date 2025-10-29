/**
 * Performance monitoring utilities
 */

export function measurePerformance(name: string, fn: () => void) {
  if (typeof window === 'undefined') return fn()
  
  const start = performance.now()
  const result = fn()
  const end = performance.now()
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Performance] ${name}: ${(end - start).toFixed(2)}ms`)
  }
  
  return result
}

export async function measureAsyncPerformance<T>(
  name: string,
  fn: () => Promise<T>
): Promise<T> {
  if (typeof window === 'undefined') return fn()
  
  const start = performance.now()
  const result = await fn()
  const end = performance.now()
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Performance] ${name}: ${(end - start).toFixed(2)}ms`)
  }
  
  return result
}

/**
 * Report Web Vitals to console in development
 */
export function reportWebVitals(metric: {
  id: string
  name: string
  value: number
  label: 'web-vital' | 'custom'
}) {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Web Vital] ${metric.name}:`, metric.value)
  }
  
  // In production, you could send to analytics service
  // Example: sendToAnalytics(metric)
}

/**
 * Debounce function for performance optimization
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }
    
    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
  }
}

/**
 * Throttle function for performance optimization
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

/**
 * Memoize expensive computations
 */
export function memoize<T extends (...args: unknown[]) => unknown>(
  fn: T
): T {
  const cache = new Map()
  
  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args)
    
    if (cache.has(key)) {
      return cache.get(key)
    }
    
    const result = fn(...args)
    cache.set(key, result)
    return result
  }) as T
}
