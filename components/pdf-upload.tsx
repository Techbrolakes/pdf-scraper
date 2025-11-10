"use client";

import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { toast } from "@/lib/toast";
import confetti from "canvas-confetti";
import { SpinnerIcon, UploadIcon, InfoIcon } from "@/components/icons";
import { convertPDFToImagesClient, ClientPDFConversionResult } from "@/lib/pdf/pdf-to-image-client";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const LARGE_FILE_THRESHOLD = 4 * 1024 * 1024; // 4MB

interface UploadState {
  isUploading: boolean;
  isProcessing: boolean;
  progress: number;
  message: string;
}

export function PDFUpload({
  onUploadSuccess,
}: {
  onUploadSuccess?: () => void;
}) {
  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    isProcessing: false,
    progress: 0,
    message: "",
  });
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    // Check file type
    if (file.type !== "application/pdf") {
      return "Invalid file type. Please upload a PDF file.";
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit.`;
    }

    if (file.size === 0) {
      return "File is empty. Please upload a valid PDF.";
    }

    return null;
  };

  const uploadFile = async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    const isLargeFile = file.size > LARGE_FILE_THRESHOLD;

    try {
      // First, process PDF client-side to extract text or convert to images
      setUploadState({
        isUploading: false,
        isProcessing: true,
        progress: 0,
        message: "Processing PDF locally...",
      });

      // Convert PDF to images or extract text on client-side
      const conversionResult = await convertPDFToImagesClient(file);
      
      if (!conversionResult.success) {
        throw new Error(conversionResult.error || "Failed to process PDF");
      }

      setUploadState({
        isUploading: true,
        isProcessing: false,
        progress: 10,
        message: "Uploading processed data...",
      });

      if (isLargeFile) {
        // Use API route for large files
        await uploadLargeFile(file, conversionResult);
      } else {
        // Use Server Action for small files
        await uploadSmallFile(file, conversionResult);
      }

      setUploadState({
        isUploading: false,
        isProcessing: false,
        progress: 100,
        message: "Upload complete!",
      });

      // Trigger confetti animation
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#3b82f6', '#60a5fa', '#93c5fd', '#dbeafe'],
      });

      toast.success("🎉 PDF uploaded and processed successfully!");

      // Reset state after success
      setTimeout(() => {
        setUploadState({
          isUploading: false,
          isProcessing: false,
          progress: 0,
          message: "",
        });
        if (onUploadSuccess) {
          onUploadSuccess();
        }
      }, 1500);
    } catch (error) {
      setUploadState({
        isUploading: false,
        isProcessing: false,
        progress: 0,
        message: "",
      });

      const errorMessage =
        error instanceof Error
          ? error.message
          : "Upload failed. Please try again.";
      toast.error(errorMessage);
    }
  };

  const uploadSmallFile = async (file: File, pdfData: ClientPDFConversionResult) => {
    const formData = new FormData();
    // Only send file metadata, not the actual file
    formData.append("fileName", file.name);
    formData.append("fileSize", String(file.size));
    
    // Add processed data
    if (pdfData.images) {
      formData.append("processedImages", JSON.stringify(pdfData.images));
      formData.append("pdfType", pdfData.pdfType || "image");
    } else if (pdfData.text) {
      formData.append("extractedText", pdfData.text);
      formData.append("pdfType", "text");
    }
    formData.append("pageCount", String(pdfData.pageCount || 1));

    let progressInterval: NodeJS.Timeout | null = null;
    let analyzeInterval: NodeJS.Timeout | null = null;
    let extractInterval: NodeJS.Timeout | null = null;

    try {
      // Phase 1: Uploading (10-40%)
      setUploadState((prev) => ({
        ...prev,
        message: "Uploading processed data...",
        progress: 10,
      }));

      progressInterval = setInterval(() => {
        setUploadState((prev) => {
          if (prev.progress < 40) {
            return { ...prev, progress: prev.progress + 2 };
          }
          return prev;
        });
      }, 100);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (progressInterval) clearInterval(progressInterval);

      // Phase 2: Analyzing data (40-70%)
      setUploadState((prev) => ({
        ...prev,
        message: "Analyzing with AI...",
        progress: 40,
      }));

      analyzeInterval = setInterval(() => {
        setUploadState((prev) => {
          if (prev.progress < 70) {
            return { ...prev, progress: prev.progress + 2 };
          }
          return prev;
        });
      }, 100);

      // Wait a bit to show analyzing phase
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (!response.ok) {
        if (analyzeInterval) clearInterval(analyzeInterval);
        const error = await response.json();
        throw new Error(error.error || "Upload failed");
      }

      const result = await response.json();

      if (analyzeInterval) clearInterval(analyzeInterval);

      // Phase 3: Extracting resume data (70-100%)
      setUploadState((prev) => ({
        ...prev,
        message: "Extracting resume data...",
        progress: 70,
      }));

      extractInterval = setInterval(() => {
        setUploadState((prev) => {
          if (prev.progress < 95) {
            return { ...prev, progress: prev.progress + 2 };
          }
          return prev;
        });
      }, 80);

      // Wait a bit to show extracting phase
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (!result.success) {
        if (extractInterval) clearInterval(extractInterval);
        throw new Error(result.error || "Processing failed");
      }

      if (extractInterval) clearInterval(extractInterval);
      setUploadState((prev) => ({ ...prev, progress: 100 }));
    } catch (error) {
      if (progressInterval) clearInterval(progressInterval);
      if (analyzeInterval) clearInterval(analyzeInterval);
      if (extractInterval) clearInterval(extractInterval);
      throw error;
    }
  };

  const uploadLargeFile = async (file: File, pdfData: ClientPDFConversionResult) => {
    const formData = new FormData();
    // Only send file metadata, not the actual file
    formData.append("fileName", file.name);
    formData.append("fileSize", String(file.size));
    
    // Add processed data
    if (pdfData.images) {
      formData.append("processedImages", JSON.stringify(pdfData.images));
      formData.append("pdfType", pdfData.pdfType || "image");
    } else if (pdfData.text) {
      formData.append("extractedText", pdfData.text);
      formData.append("pdfType", "text");
    }
    formData.append("pageCount", String(pdfData.pageCount || 1));

    setUploadState((prev) => ({
      ...prev,
      message: "Uploading PDF...",
      progress: 0,
    }));

    const xhr = new XMLHttpRequest();

    return new Promise<void>((resolve, reject) => {
      // Phase 1: Uploading (0-40%)
      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          const percentComplete = Math.round((e.loaded / e.total) * 40);
          setUploadState((prev) => ({
            ...prev,
            message: "Uploading PDF...",
            progress: percentComplete,
          }));
        }
      });

      xhr.addEventListener("load", async () => {
        if (xhr.status === 200) {
          // Phase 2: Analyzing data (40-70%)
          setUploadState((prev) => ({
            ...prev,
            progress: 40,
            isProcessing: true,
            message: "Analyzing data...",
          }));

          // Simulate analyzing progress
          const analyzeInterval = setInterval(() => {
            setUploadState((prev) => {
              if (prev.progress < 70) {
                return { ...prev, progress: prev.progress + 2 };
              }
              return prev;
            });
          }, 100);

          // Wait to show analyzing phase
          await new Promise((resolve) => setTimeout(resolve, 1500));

          try {
            const result = JSON.parse(xhr.responseText);

            clearInterval(analyzeInterval);

            // Phase 3: Extracting data (70-100%)
            setUploadState((prev) => ({
              ...prev,
              message: "Extracting data...",
              progress: 70,
            }));

            const extractInterval = setInterval(() => {
              setUploadState((prev) => {
                if (prev.progress < 95) {
                  return { ...prev, progress: prev.progress + 2 };
                }
                return prev;
              });
            }, 80);

            // Wait to show extracting phase
            await new Promise((resolve) => setTimeout(resolve, 1500));

            if (result.success) {
              clearInterval(extractInterval);
              setUploadState((prev) => ({ ...prev, progress: 100 }));
              resolve();
            } else {
              clearInterval(extractInterval);
              reject(new Error(result.error || "Processing failed"));
            }
          } catch {
            clearInterval(analyzeInterval);
            reject(new Error("Failed to parse response"));
          }
        } else {
          try {
            const error = JSON.parse(xhr.responseText);
            reject(new Error(error.error || "Upload failed"));
          } catch {
            reject(new Error("Upload failed"));
          }
        }
      });

      xhr.addEventListener("error", () => {
        reject(new Error("Network error occurred"));
      });

      xhr.addEventListener("abort", () => {
        reject(new Error("Upload cancelled"));
      });

      xhr.open("POST", "/api/upload");
      xhr.send(formData);
    });
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      uploadFile(file);
    }
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      uploadFile(files[0]);
      // Reset input value to allow re-uploading the same file
      e.target.value = "";
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const isLoading = uploadState.isUploading || uploadState.isProcessing;

  return (
    <div className="w-full">
      <div
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300
          ${
            isDragging
              ? "border-blue-500 bg-blue-500/10 scale-[1.02]"
              : "border-white/20 bg-white/5 hover:border-blue-500/50 hover:bg-white/10"
          }
          ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        `}
        onClick={!isLoading ? handleButtonClick : undefined}
        role="button"
        tabIndex={isLoading ? -1 : 0}
        onKeyDown={(e) => {
          if (!isLoading && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            handleButtonClick();
          }
        }}
        aria-label="Upload PDF file"
        aria-busy={isLoading}
        aria-disabled={isLoading}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleFileInput}
          disabled={isLoading}
          className="hidden"
          aria-label="PDF file input"
        />

        {isLoading ? (
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <SpinnerIcon className="animate-spin h-10 w-10 text-blue-400" />
                </div>
              </div>
            </div>
            <div>
              <p className="text-lg font-semibold text-white">
                {uploadState.message}
              </p>
              <div className="mt-4 w-full max-w-md mx-auto bg-white/10 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-linear-to-r from-blue-500 to-blue-400 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${uploadState.progress}%` }}
                />
              </div>
              <p className="mt-2 text-sm font-medium text-blue-300">
                {uploadState.progress}%
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-center">
              <div
                className={`w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                  isDragging ? "bg-blue-500/30 scale-110" : "bg-blue-500/10"
                }`}
              >
                <UploadIcon
                  className={`h-10 w-10 transition-colors ${
                    isDragging ? "text-blue-300" : "text-blue-400"
                  }`}
                />
              </div>
            </div>
            <div>
              <p className="text-xl font-bold text-white">
                {isDragging ? "📄 Drop your PDF here" : "📤 Upload PDF Resume"}
              </p>
              <p className="mt-2 text-sm text-gray-400">
                Drag and drop your resume or click to browse
              </p>
              <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full">
                <InfoIcon className="w-4 h-4 text-blue-400" />
                <p className="text-xs text-blue-300 font-medium">
                  PDF files only • Max 10MB
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
