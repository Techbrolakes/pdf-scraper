import { deleteResume } from "@/app/actions/resume-actions";
import { getDashboardData } from "@/app/actions/dashboard-actions";
import { ResumeHistory } from "@/components/resume/history";
import { PDFUpload } from "@/components/pdf-upload";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { CreditAlerts } from "@/components/dashboard/credit-alerts";
import { ProductTour } from "@/components/product-tour";
import { revalidatePath } from "next/cache";
import type { ResumeData } from "@/types/resume";

async function refreshDashboard() {
  "use server";
  revalidatePath("/dashboard");
}

export default async function DashboardPage() {
  // Fetch all dashboard data using server action
  const { resumeCount, allResumes, recentResume, user } = await getDashboardData();

  const credits = user?.credits || 0;
  const planType = user?.planType || "FREE";
  const shouldShowTour = !user?.hasCompletedTour;

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
      {/* Product Tour */}
      <ProductTour shouldShowTour={shouldShowTour} />

      {/* Welcome Tour Anchor (invisible) */}
      <div id="welcome-tour" className="absolute top-0 left-0" />

      {/* Credit Alerts */}
      <CreditAlerts credits={credits} />

      {/* Stats Section */}
      <div id="stats-cards" className="mb-8">
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
      <div id="upload-zone" className="mb-20">
        <PDFUpload onUploadSuccess={refreshDashboard} />
      </div>

      {/* Resume History */}
      <div id="resume-history" className="mt-8">
        <ResumeHistory resumes={typedResumes} onDelete={handleDelete} />
      </div>
    </div>
  );
}
