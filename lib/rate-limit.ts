import { prisma } from './prisma'

interface RateLimitConfig {
  maxRequests: number
  windowMs: number
}

const DEFAULT_CONFIG: RateLimitConfig = {
  maxRequests: 40, // 40 uploads per hour
  windowMs: 60 * 60 * 1000, // 1 hour
}

export class RateLimitError extends Error {
  constructor(
    message: string,
    public retryAfter: number
  ) {
    super(message)
    this.name = 'RateLimitError'
  }
}

/**
 * Check if a user has exceeded their rate limit
 * @param userId - The user ID to check
 * @param config - Optional rate limit configuration
 * @returns Promise<void> - Throws RateLimitError if limit exceeded
 */
export async function checkRateLimit(
  userId: string,
  config: RateLimitConfig = DEFAULT_CONFIG
): Promise<void> {
  const now = new Date()
  const windowStart = new Date(now.getTime() - config.windowMs)

  // Count uploads in the current window
  const uploadCount = await prisma.resumeHistory.count({
    where: {
      userId,
      uploadedAt: {
        gte: windowStart,
      },
    },
  })

  if (uploadCount >= config.maxRequests) {
    // Find the oldest upload in the window to calculate retry time
    const oldestUpload = await prisma.resumeHistory.findFirst({
      where: {
        userId,
        uploadedAt: {
          gte: windowStart,
        },
      },
      orderBy: {
        uploadedAt: 'asc',
      },
      select: {
        uploadedAt: true,
      },
    })

    if (oldestUpload) {
      const retryAfter = Math.ceil(
        (oldestUpload.uploadedAt.getTime() + config.windowMs - now.getTime()) / 1000
      )

      throw new RateLimitError(
        `Rate limit exceeded. You can upload ${config.maxRequests} files per hour. Please try again in ${Math.ceil(retryAfter / 60)} minutes.`,
        retryAfter
      )
    }
  }
}

/**
 * Get remaining uploads for a user
 * @param userId - The user ID to check
 * @param config - Optional rate limit configuration
 * @returns Promise<{ remaining: number; resetAt: Date }>
 */
export async function getRateLimitInfo(
  userId: string,
  config: RateLimitConfig = DEFAULT_CONFIG
): Promise<{ remaining: number; resetAt: Date; total: number }> {
  const now = new Date()
  const windowStart = new Date(now.getTime() - config.windowMs)

  const uploadCount = await prisma.resumeHistory.count({
    where: {
      userId,
      uploadedAt: {
        gte: windowStart,
      },
    },
  })

  const remaining = Math.max(0, config.maxRequests - uploadCount)

  // Find the oldest upload to determine reset time
  const oldestUpload = await prisma.resumeHistory.findFirst({
    where: {
      userId,
      uploadedAt: {
        gte: windowStart,
      },
    },
    orderBy: {
      uploadedAt: 'asc',
    },
    select: {
      uploadedAt: true,
    },
  })

  const resetAt = oldestUpload
    ? new Date(oldestUpload.uploadedAt.getTime() + config.windowMs)
    : new Date(now.getTime() + config.windowMs)

  return {
    remaining,
    resetAt,
    total: config.maxRequests,
  }
}
