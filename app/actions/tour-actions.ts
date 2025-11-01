"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function markTourAsCompleted() {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return { success: false, error: "Unauthorized" };
    }

    await prisma.user.update({
      where: { email: session.user.email },
      data: {
        hasCompletedTour: true,
        tourCompletedAt: new Date(),
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error marking tour as completed:", error);
    return { success: false, error: "Failed to update tour status" };
  }
}

export async function resetTourStatus() {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return { success: false, error: "Unauthorized" };
    }

    await prisma.user.update({
      where: { email: session.user.email },
      data: {
        hasCompletedTour: false,
        tourCompletedAt: null,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error resetting tour status:", error);
    return { success: false, error: "Failed to reset tour status" };
  }
}

export async function getTourStatus() {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return { hasCompletedTour: true }; // Don't show tour if not logged in
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { hasCompletedTour: true },
    });

    return { hasCompletedTour: user?.hasCompletedTour ?? true };
  } catch (error) {
    console.error("Error getting tour status:", error);
    return { hasCompletedTour: true }; // Default to completed on error
  }
}
