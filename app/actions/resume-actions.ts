'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function deleteResume(id: string) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      throw new Error('Unauthorized')
    }

    // Verify the resume belongs to the user
    const resume = await prisma.resumeHistory.findUnique({
      where: { id },
      select: { userId: true },
    })

    if (!resume) {
      throw new Error('Resume not found')
    }

    if (resume.userId !== session.user.id) {
      throw new Error('Unauthorized')
    }

    // Delete the resume
    await prisma.resumeHistory.delete({
      where: { id },
    })

    // Revalidate the dashboard page
    revalidatePath('/dashboard')

    return { success: true }
  } catch (error) {
    console.error('Delete resume error:', error)
    throw error
  }
}
