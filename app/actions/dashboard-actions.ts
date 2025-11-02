"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";

// Cached function that accepts userId as parameter
const getCachedDashboardData = unstable_cache(
  async (userId: string) => {
    // Optimize: Remove redundant recentResume query since we can get it from allResumes
    const [resumeCount, allResumes, user] = await Promise.all([
      prisma.resumeHistory.count({
        where: {
          userId,
        },
      }),
      prisma.resumeHistory.findMany({
        where: {
          userId,
        },
        orderBy: {
          uploadedAt: "desc",
        },
      }),
      prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          credits: true,
          planType: true,
          hasCompletedTour: true,
        },
      }),
    ]);

    // Get recent resume from the first item in allResumes
    const recentResume = allResumes[0] || null;

    return {
      resumeCount,
      allResumes,
      recentResume,
      user,
    };
  },
  ["dashboard-data"],
  {
    revalidate: 60, // Cache for 60 seconds
    tags: ["dashboard"],
  }
);

// Public function that handles auth and calls cached function
export async function getDashboardData() {
  const session = await auth();
  
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  return getCachedDashboardData(session.user.id);
}
