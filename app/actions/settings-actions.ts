'use server'

import { auth, signOut } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import bcrypt from 'bcryptjs'
import {
  updateProfileSchema,
  changePasswordSchema,
  deleteAccountSchema,
  type UpdateProfileInput,
  type ChangePasswordInput,
  type DeleteAccountInput,
} from '@/lib/validations/settings'

export async function updateProfile(data: UpdateProfileInput) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    // Validate input
    const validated = updateProfileSchema.parse(data)

    // Update user
    await prisma.user.update({
      where: { id: session.user.id },
      data: { name: validated.name },
    })

    revalidatePath('/settings')
    revalidatePath('/dashboard')

    return { success: true, message: 'Profile updated successfully' }
  } catch (error) {
    console.error('Update profile error:', error)
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: 'Failed to update profile' }
  }
}

export async function changePassword(data: ChangePasswordInput) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    // Validate input
    const validated = changePasswordSchema.parse(data)

    // Get user with password
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { password: true },
    })

    if (!user || !user.password) {
      return { success: false, error: 'User not found or password not set' }
    }

    // Verify current password
    const isValid = await bcrypt.compare(validated.currentPassword, user.password)
    if (!isValid) {
      return { success: false, error: 'Current password is incorrect' }
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(validated.newPassword, 10)

    // Update password
    await prisma.user.update({
      where: { id: session.user.id },
      data: { password: hashedPassword },
    })

    return { success: true, message: 'Password changed successfully' }
  } catch (error) {
    console.error('Change password error:', error)
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: 'Failed to change password' }
  }
}

export async function deleteAccount(data: DeleteAccountInput) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    // Validate input
    const validated = deleteAccountSchema.parse(data)

    // Get user with password
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { password: true },
    })

    if (!user || !user.password) {
      return { success: false, error: 'User not found or password not set' }
    }

    // Verify password
    const isValid = await bcrypt.compare(validated.password, user.password)
    if (!isValid) {
      return { success: false, error: 'Password is incorrect' }
    }

    // Delete all user's resume history (cascade)
    await prisma.resumeHistory.deleteMany({
      where: { userId: session.user.id },
    })

    // Delete user account
    await prisma.user.delete({
      where: { id: session.user.id },
    })

    // Sign out
    await signOut({ redirect: false })

    return { success: true, message: 'Account deleted successfully' }
  } catch (error) {
    console.error('Delete account error:', error)
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: 'Failed to delete account' }
  }
}

export async function getUserStats() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' }
    }

    const [user, resumeCount] = await Promise.all([
      prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
          createdAt: true,
          email: true,
          name: true,
        },
      }),
      prisma.resumeHistory.count({
        where: { userId: session.user.id },
      }),
    ])

    if (!user) {
      return { success: false, error: 'User not found' }
    }

    return {
      success: true,
      data: {
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
        totalResumes: resumeCount,
      },
    }
  } catch (error) {
    console.error('Get user stats error:', error)
    return { success: false, error: 'Failed to fetch user statistics' }
  }
}
