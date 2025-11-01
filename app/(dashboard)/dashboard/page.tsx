import { auth } from "@/lib/auth";
import { deleteResume } from "@/app/actions/resume-actions";
import { ResumeHistory } from "@/components/resume-history";
import { PDFUpload } from "@/components/pdf-upload";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { CreditAlerts } from "@/components/dashboard/credit-alerts";
import { revalidatePath } from "next/cache";
import type { ResumeData } from "@/types/resume";
import { prisma } from "@/lib/prisma";

async function refreshDashboard() {
  "use server";
  revalidatePath("/dashboard");
}

export default async function DashboardPage() {
  const session = await auth();

  const [resumeCount, allResumes, recentResume, user] = await Promise.all([
    prisma.resumeHistory.count({
      where: {
        userId: session?.user?.id,
      },
    }),
    prisma.resumeHistory.findMany({
      where: {
        userId: session?.user?.id,
      },
      orderBy: {
        uploadedAt: "desc",
      },
    }),
    prisma.resumeHistory.findFirst({
      where: {
        userId: session?.user?.id,
      },
      orderBy: {
        uploadedAt: "desc",
      },
    }),
    prisma.user.findUnique({
      where: {
        id: session?.user?.id,
      },
      select: {
        credits: true,
        planType: true,
      },
    }),
  ]);

  const credits = user?.credits || 0;
  const planType = user?.planType || "FREE";

  // Transform resumes data to match expected type
  const typedResumes = allResumes.map((resume) => ({
    ...resume,
    resumeData: resume.resumeData as unknown as {
      pdfType: string;
      pages: number;
      processingMethod: string;
      status: string;
      resumeData: ResumeData;
    },
  }));

  const handleDelete = async (id: string) => {
    "use server";
    await deleteResume(id);
    revalidatePath("/dashboard");
  };

  return (
    <div className="px-4 py-6 sm:px-0">
      {/* Credit Alerts */}
      <CreditAlerts credits={credits} />

      {/* Stats Section */}
      <div className="mb-8">
        <StatsCards
          credits={credits}
          planType={planType}
          resumeCount={resumeCount}
          recentUploadDate={
            recentResume
              ? new Date(recentResume.uploadedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              : null
          }
        />
      </div>

      {/* Upload Section */}
      <div className="mb-20">
        <PDFUpload onUploadSuccess={refreshDashboard} />
      </div>

      {/* Resume History */}
      <div className="mt-8">
        <ResumeHistory resumes={typedResumes} onDelete={handleDelete} />
      </div>
    </div>
  );
}
