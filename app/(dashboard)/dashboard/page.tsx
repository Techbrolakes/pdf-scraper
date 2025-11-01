import { auth } from "@/lib/auth";
import { deleteResume } from "@/app/actions/resume-actions";
import { ResumeHistory } from "@/components/resume-history";
import { PDFUpload } from "@/components/pdf-upload";
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
      {/* Low Credits Warning */}
      {credits < 500 && credits > 0 && (
        <div className="mb-6 bg-orange-500/10 border border-orange-500/20 rounded-2xl p-5">
          <div className="flex items-start gap-4">
            <div className="shrink-0 w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
              <svg
                className="h-5 w-5 text-orange-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-orange-300">
                Low Credits Warning
              </h3>
              <p className="mt-1 text-sm text-orange-200/80">
                You have {credits.toLocaleString()} credits remaining. Consider
                upgrading your plan in{" "}
                <a
                  href="/billing"
                  className="font-semibold underline hover:text-orange-100 transition-colors"
                >
                  Billing
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      )}

      {/* No Credits Warning */}
      {credits === 0 && (
        <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-2xl p-5">
          <div className="flex items-start gap-4">
            <div className="shrink-0 w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-red-300">
                No Credits Remaining
              </h3>
              <p className="mt-1 text-sm text-red-200/80">
                You have no credits left. Subscribe to a plan in{" "}
                <a
                  href="/billing"
                  className="font-semibold underline hover:text-red-100 transition-colors"
                >
                  Billing
                </a>{" "}
                to continue processing resumes.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-8">
        {/* Credits Stat */}
        <div className="group relative overflow-hidden rounded-2xl bg-linear-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 p-6 hover:border-purple-500/40 transition-all duration-300">
          <div className="flex items-center gap-4">
            <div
              className={`w-14 h-14 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform ${
                credits === 0
                  ? "bg-red-500/20"
                  : credits < 500
                    ? "bg-orange-500/20"
                    : "bg-purple-500/20"
              }`}
            >
              <svg
                className={`h-7 w-7 ${
                  credits === 0
                    ? "text-red-400"
                    : credits < 500
                      ? "text-orange-400"
                      : "text-purple-400"
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-purple-200 truncate">
                Credits ({planType})
              </p>
              <p
                className={`text-2xl font-bold mt-1 ${
                  credits === 0
                    ? "text-red-400"
                    : credits < 500
                      ? "text-orange-400"
                      : "text-white"
                }`}
              >
                {credits.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Total Resumes Stat */}
        <div className="group relative overflow-hidden rounded-2xl bg-linear-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 p-6 hover:border-blue-500/40 transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg
                className="h-7 w-7 text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-blue-200 truncate">
                Total Resumes
              </p>
              <p className="text-2xl font-bold text-white mt-1">
                {resumeCount}
              </p>
            </div>
          </div>
        </div>

        {/* Most Recent Upload Stat */}
        <div className="group relative overflow-hidden rounded-2xl bg-linear-to-br from-green-500/10 to-green-600/5 border border-green-500/20 p-6 hover:border-green-500/40 transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-green-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg
                className="h-7 w-7 text-green-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-green-200 truncate">
                Most Recent
              </p>
              <p className="text-lg font-bold text-white mt-1 truncate">
                {recentResume
                  ? new Date(recentResume.uploadedAt).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                      }
                    )
                  : "No uploads yet"}
              </p>
            </div>
          </div>
        </div>
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
