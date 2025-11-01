import { prisma } from "../lib/prisma";

async function grantFreeCredits() {
  try {
    // Update all users with less than 300 credits to have 300 free credits (3 free uploads)
    const result = await prisma.user.updateMany({
      where: {
        credits: {
          lt: 300,
        },
      },
      data: {
        credits: 300,
      },
    });

    console.log(`✅ Updated ${result.count} users with 300 free credits (3 free uploads)`);
  } catch (error) {
    console.error("❌ Error granting free credits:", error);
  } finally {
    await prisma.$disconnect();
  }
}

grantFreeCredits();
