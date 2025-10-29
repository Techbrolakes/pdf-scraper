import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getRateLimitInfo } from '@/lib/rate-limit'

export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const rateLimitInfo = await getRateLimitInfo(session.user.id)

    return NextResponse.json({
      success: true,
      data: rateLimitInfo,
    })
  } catch (error) {
    console.error('Rate limit info error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch rate limit info' },
      { status: 500 }
    )
  }
}
