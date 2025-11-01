import type { ResumeData } from "@/types/resume";

/**
 * Download resume data as JSON
 */
export function downloadAsJSON(resumeData: ResumeData, fileName: string) {
  const dataStr = JSON.stringify(resumeData, null, 2);
  const dataBlob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${fileName.replace(".pdf", "")}_data.json`;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Download resume data as CSV
 */
export function downloadAsCSV(resumeData: ResumeData, fileName: string) {
  const csvRows: string[] = [];

  // Profile Section
  csvRows.push("PROFILE");
  csvRows.push("Field,Value");
  csvRows.push(`Name,"${resumeData.profile.name || ""} ${resumeData.profile.surname || ""}"`);
  csvRows.push(`Email,${resumeData.profile.email || ""}`);
  csvRows.push(`Headline,"${resumeData.profile.headline || ""}"`);
  csvRows.push(`Location,"${resumeData.profile.city || ""}, ${resumeData.profile.country || ""}"`);
  csvRows.push(`LinkedIn,${resumeData.profile.linkedIn || ""}`);
  csvRows.push(`Website,${resumeData.profile.website || ""}`);
  csvRows.push(`Remote Work,${resumeData.profile.remote ? "Yes" : "No"}`);
  csvRows.push(`Open to Relocation,${resumeData.profile.relocation ? "Yes" : "No"}`);
  csvRows.push(`Professional Summary,"${(resumeData.profile.professionalSummary || "").replace(/"/g, '""')}"`);
  csvRows.push("");

  // Skills Section
  if (resumeData.skills.length > 0) {
    csvRows.push("SKILLS");
    csvRows.push("Skill");
    resumeData.skills.forEach(skill => {
      csvRows.push(`"${skill.replace(/"/g, '""')}"`);
    });
    csvRows.push("");
  }

  // Work Experience Section
  if (resumeData.workExperiences.length > 0) {
    csvRows.push("WORK EXPERIENCE");
    csvRows.push("Job Title,Company,Employment Type,Location Type,Start Date,End Date,Current,Description");
    resumeData.workExperiences.forEach(exp => {
      const startDate = `${exp.startMonth}/${exp.startYear}`;
      const endDate = exp.current ? "Present" : `${exp.endMonth}/${exp.endYear}`;
      csvRows.push(
        `"${exp.jobTitle}","${exp.company}","${exp.employmentType}","${exp.locationType}","${startDate}","${endDate}","${exp.current ? "Yes" : "No"}","${(exp.description || "").replace(/"/g, '""')}"`
      );
    });
    csvRows.push("");
  }

  // Education Section
  if (resumeData.educations.length > 0) {
    csvRows.push("EDUCATION");
    csvRows.push("School,Degree,Major,Start Year,End Year,Current,Description");
    resumeData.educations.forEach(edu => {
      csvRows.push(
        `"${edu.school}","${edu.degree}","${edu.major || ""}","${edu.startYear}","${edu.current ? "Present" : edu.endYear || ""}","${edu.current ? "Yes" : "No"}","${(edu.description || "").replace(/"/g, '""')}"`
      );
    });
    csvRows.push("");
  }

  // Licenses Section
  if (resumeData.licenses.length > 0) {
    csvRows.push("LICENSES & CERTIFICATIONS");
    csvRows.push("Name,Issuer,Issue Year,Description");
    resumeData.licenses.forEach(license => {
      csvRows.push(
        `"${license.name}","${license.issuer}","${license.issueYear}","${(license.description || "").replace(/"/g, '""')}"`
      );
    });
    csvRows.push("");
  }

  // Languages Section
  if (resumeData.languages.length > 0) {
    csvRows.push("LANGUAGES");
    csvRows.push("Language,Level");
    resumeData.languages.forEach(lang => {
      csvRows.push(`"${lang.language}","${lang.level}"`);
    });
    csvRows.push("");
  }

  // Achievements Section
  if (resumeData.achievements.length > 0) {
    csvRows.push("ACHIEVEMENTS");
    csvRows.push("Title,Organization,Date,Description");
    resumeData.achievements.forEach(achievement => {
      csvRows.push(
        `"${achievement.title}","${achievement.organization}","${achievement.achieveDate}","${(achievement.description || "").replace(/"/g, '""')}"`
      );
    });
    csvRows.push("");
  }

  // Publications Section
  if (resumeData.publications.length > 0) {
    csvRows.push("PUBLICATIONS");
    csvRows.push("Title,Publisher,Publication Date,URL,Description");
    resumeData.publications.forEach(pub => {
      csvRows.push(
        `"${pub.title}","${pub.publisher}","${pub.publicationDate}","${pub.publicationUrl || ""}","${(pub.description || "").replace(/"/g, '""')}"`
      );
    });
    csvRows.push("");
  }

  // Honors Section
  if (resumeData.honors.length > 0) {
    csvRows.push("HONORS & AWARDS");
    csvRows.push("Title,Issuer,Issue Date,Description");
    resumeData.honors.forEach(honor => {
      csvRows.push(
        `"${honor.title}","${honor.issuer}","${honor.issueMonth}/${honor.issueYear}","${(honor.description || "").replace(/"/g, '""')}"`
      );
    });
    csvRows.push("");
  }

  const csvContent = csvRows.join("\n");
  const dataBlob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${fileName.replace(".pdf", "")}_data.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Download resume data as plain text
 */
export function downloadAsTXT(resumeData: ResumeData, fileName: string) {
  const lines: string[] = [];

  // Header
  lines.push("=".repeat(80));
  lines.push("RESUME DATA");
  lines.push("=".repeat(80));
  lines.push("");

  // Profile Section
  lines.push("PROFILE");
  lines.push("-".repeat(80));
  lines.push(`Name: ${resumeData.profile.name || ""} ${resumeData.profile.surname || ""}`);
  lines.push(`Email: ${resumeData.profile.email || ""}`);
  lines.push(`Headline: ${resumeData.profile.headline || ""}`);
  lines.push(`Location: ${resumeData.profile.city || ""}, ${resumeData.profile.country || ""}`);
  lines.push(`LinkedIn: ${resumeData.profile.linkedIn || ""}`);
  lines.push(`Website: ${resumeData.profile.website || ""}`);
  lines.push(`Remote Work: ${resumeData.profile.remote ? "Yes" : "No"}`);
  lines.push(`Open to Relocation: ${resumeData.profile.relocation ? "Yes" : "No"}`);
  if (resumeData.profile.professionalSummary) {
    lines.push("");
    lines.push("Professional Summary:");
    lines.push(resumeData.profile.professionalSummary);
  }
  lines.push("");

  // Skills Section
  if (resumeData.skills.length > 0) {
    lines.push("SKILLS");
    lines.push("-".repeat(80));
    lines.push(resumeData.skills.join(", "));
    lines.push("");
  }

  // Work Experience Section
  if (resumeData.workExperiences.length > 0) {
    lines.push("WORK EXPERIENCE");
    lines.push("-".repeat(80));
    resumeData.workExperiences.forEach((exp, index) => {
      if (index > 0) lines.push("");
      lines.push(`${exp.jobTitle} at ${exp.company}`);
      lines.push(`${exp.startMonth}/${exp.startYear} - ${exp.current ? "Present" : `${exp.endMonth}/${exp.endYear}`}`);
      lines.push(`${exp.employmentType} | ${exp.locationType}`);
      if (exp.description) {
        lines.push("");
        lines.push(exp.description);
      }
    });
    lines.push("");
  }

  // Education Section
  if (resumeData.educations.length > 0) {
    lines.push("EDUCATION");
    lines.push("-".repeat(80));
    resumeData.educations.forEach((edu, index) => {
      if (index > 0) lines.push("");
      lines.push(`${edu.school}`);
      lines.push(`${edu.degree}${edu.major ? ` in ${edu.major}` : ""}`);
      lines.push(`${edu.startYear} - ${edu.current ? "Present" : edu.endYear || ""}`);
      if (edu.description) {
        lines.push("");
        lines.push(edu.description);
      }
    });
    lines.push("");
  }

  // Licenses Section
  if (resumeData.licenses.length > 0) {
    lines.push("LICENSES & CERTIFICATIONS");
    lines.push("-".repeat(80));
    resumeData.licenses.forEach((license, index) => {
      if (index > 0) lines.push("");
      lines.push(`${license.name}`);
      lines.push(`${license.issuer} | ${license.issueYear}`);
      if (license.description) {
        lines.push(license.description);
      }
    });
    lines.push("");
  }

  // Languages Section
  if (resumeData.languages.length > 0) {
    lines.push("LANGUAGES");
    lines.push("-".repeat(80));
    resumeData.languages.forEach(lang => {
      lines.push(`${lang.language}: ${lang.level}`);
    });
    lines.push("");
  }

  // Achievements Section
  if (resumeData.achievements.length > 0) {
    lines.push("ACHIEVEMENTS");
    lines.push("-".repeat(80));
    resumeData.achievements.forEach((achievement, index) => {
      if (index > 0) lines.push("");
      lines.push(`${achievement.title}`);
      lines.push(`${achievement.organization} | ${achievement.achieveDate}`);
      if (achievement.description) {
        lines.push(achievement.description);
      }
    });
    lines.push("");
  }

  // Publications Section
  if (resumeData.publications.length > 0) {
    lines.push("PUBLICATIONS");
    lines.push("-".repeat(80));
    resumeData.publications.forEach((pub, index) => {
      if (index > 0) lines.push("");
      lines.push(`${pub.title}`);
      lines.push(`${pub.publisher} | ${pub.publicationDate}`);
      if (pub.publicationUrl) {
        lines.push(`URL: ${pub.publicationUrl}`);
      }
      if (pub.description) {
        lines.push(pub.description);
      }
    });
    lines.push("");
  }

  // Honors Section
  if (resumeData.honors.length > 0) {
    lines.push("HONORS & AWARDS");
    lines.push("-".repeat(80));
    resumeData.honors.forEach((honor, index) => {
      if (index > 0) lines.push("");
      lines.push(`${honor.title}`);
      lines.push(`${honor.issuer} | ${honor.issueMonth}/${honor.issueYear}`);
      if (honor.description) {
        lines.push(honor.description);
      }
    });
    lines.push("");
  }

  lines.push("=".repeat(80));
  lines.push("END OF RESUME DATA");
  lines.push("=".repeat(80));

  const txtContent = lines.join("\n");
  const dataBlob = new Blob([txtContent], { type: "text/plain;charset=utf-8;" });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${fileName.replace(".pdf", "")}_data.txt`;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Download resume data as PDF (using browser print)
 */
export function downloadAsPDF(resumeData: ResumeData, fileName: string) {
  // Create a new window with formatted content
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("Please allow pop-ups to download as PDF");
    return;
  }

  const htmlContent = generatePDFHTML(resumeData, fileName);
  printWindow.document.write(htmlContent);
  printWindow.document.close();
  
  // Wait for content to load, then trigger print
  printWindow.onload = () => {
    printWindow.focus();
    printWindow.print();
  };
}

function generatePDFHTML(resumeData: ResumeData, fileName: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${fileName.replace(".pdf", "")} - Resume Data</title>
  <style>
    @media print {
      @page { margin: 1.5cm; }
      body { margin: 0; }
    }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    h1 {
      color: #1447E6;
      border-bottom: 3px solid #1447E6;
      padding-bottom: 10px;
      margin-bottom: 20px;
    }
    h2 {
      color: #1447E6;
      margin-top: 30px;
      margin-bottom: 15px;
      border-bottom: 1px solid #ddd;
      padding-bottom: 5px;
    }
    h3 {
      color: #333;
      margin-top: 20px;
      margin-bottom: 10px;
    }
    .profile-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-bottom: 20px;
    }
    .profile-item {
      margin-bottom: 10px;
    }
    .profile-item strong {
      color: #666;
      display: block;
      font-size: 0.9em;
    }
    .skills {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 10px;
    }
    .skill-tag {
      background: #E8F0FE;
      color: #1447E6;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 0.9em;
    }
    .experience-item, .education-item, .other-item {
      margin-bottom: 20px;
      padding-left: 15px;
      border-left: 3px solid #1447E6;
    }
    .date {
      color: #666;
      font-size: 0.9em;
    }
    .description {
      margin-top: 8px;
      color: #555;
    }
    .tags {
      display: flex;
      gap: 8px;
      margin-top: 5px;
    }
    .tag {
      background: #f0f0f0;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 0.85em;
    }
  </style>
</head>
<body>
  <h1>${resumeData.profile.name || ""} ${resumeData.profile.surname || ""}</h1>
  
  <div class="profile-grid">
    ${resumeData.profile.email ? `<div class="profile-item"><strong>Email</strong>${resumeData.profile.email}</div>` : ""}
    ${resumeData.profile.city || resumeData.profile.country ? `<div class="profile-item"><strong>Location</strong>${resumeData.profile.city || ""}, ${resumeData.profile.country || ""}</div>` : ""}
    ${resumeData.profile.linkedIn ? `<div class="profile-item"><strong>LinkedIn</strong><a href="${resumeData.profile.linkedIn}">${resumeData.profile.linkedIn}</a></div>` : ""}
    ${resumeData.profile.website ? `<div class="profile-item"><strong>Website</strong><a href="${resumeData.profile.website}">${resumeData.profile.website}</a></div>` : ""}
    <div class="profile-item"><strong>Remote Work</strong>${resumeData.profile.remote ? "Yes" : "No"}</div>
    <div class="profile-item"><strong>Open to Relocation</strong>${resumeData.profile.relocation ? "Yes" : "No"}</div>
  </div>

  ${resumeData.profile.headline ? `<p><strong>Headline:</strong> ${resumeData.profile.headline}</p>` : ""}
  
  ${resumeData.profile.professionalSummary ? `
    <h2>Professional Summary</h2>
    <p>${resumeData.profile.professionalSummary}</p>
  ` : ""}

  ${resumeData.skills.length > 0 ? `
    <h2>Skills</h2>
    <div class="skills">
      ${resumeData.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join("")}
    </div>
  ` : ""}

  ${resumeData.workExperiences.length > 0 ? `
    <h2>Work Experience</h2>
    ${resumeData.workExperiences.map(exp => `
      <div class="experience-item">
        <h3>${exp.jobTitle}</h3>
        <p><strong>${exp.company}</strong></p>
        <p class="date">${exp.startMonth}/${exp.startYear} - ${exp.current ? "Present" : `${exp.endMonth}/${exp.endYear}`}</p>
        <div class="tags">
          <span class="tag">${exp.employmentType.replace(/_/g, " ")}</span>
          <span class="tag">${exp.locationType}</span>
        </div>
        ${exp.description ? `<p class="description">${exp.description}</p>` : ""}
      </div>
    `).join("")}
  ` : ""}

  ${resumeData.educations.length > 0 ? `
    <h2>Education</h2>
    ${resumeData.educations.map(edu => `
      <div class="education-item">
        <h3>${edu.school}</h3>
        <p><strong>${edu.degree.replace(/_/g, " ")}${edu.major ? ` in ${edu.major}` : ""}</strong></p>
        <p class="date">${edu.startYear} - ${edu.current ? "Present" : edu.endYear || ""}</p>
        ${edu.description ? `<p class="description">${edu.description}</p>` : ""}
      </div>
    `).join("")}
  ` : ""}

  ${resumeData.licenses.length > 0 ? `
    <h2>Licenses & Certifications</h2>
    ${resumeData.licenses.map(license => `
      <div class="other-item">
        <h3>${license.name}</h3>
        <p class="date">${license.issuer} | ${license.issueYear}</p>
        ${license.description ? `<p class="description">${license.description}</p>` : ""}
      </div>
    `).join("")}
  ` : ""}

  ${resumeData.languages.length > 0 ? `
    <h2>Languages</h2>
    ${resumeData.languages.map(lang => `
      <p><strong>${lang.language}:</strong> ${lang.level}</p>
    `).join("")}
  ` : ""}

  ${resumeData.achievements.length > 0 ? `
    <h2>Achievements</h2>
    ${resumeData.achievements.map(achievement => `
      <div class="other-item">
        <h3>${achievement.title}</h3>
        <p class="date">${achievement.organization} | ${achievement.achieveDate}</p>
        ${achievement.description ? `<p class="description">${achievement.description}</p>` : ""}
      </div>
    `).join("")}
  ` : ""}

  ${resumeData.publications.length > 0 ? `
    <h2>Publications</h2>
    ${resumeData.publications.map(pub => `
      <div class="other-item">
        <h3>${pub.title}</h3>
        <p class="date">${pub.publisher} | ${pub.publicationDate}</p>
        ${pub.publicationUrl ? `<p><a href="${pub.publicationUrl}">${pub.publicationUrl}</a></p>` : ""}
        ${pub.description ? `<p class="description">${pub.description}</p>` : ""}
      </div>
    `).join("")}
  ` : ""}

  ${resumeData.honors.length > 0 ? `
    <h2>Honors & Awards</h2>
    ${resumeData.honors.map(honor => `
      <div class="other-item">
        <h3>${honor.title}</h3>
        <p class="date">${honor.issuer} | ${honor.issueMonth}/${honor.issueYear}</p>
        ${honor.description ? `<p class="description">${honor.description}</p>` : ""}
      </div>
    `).join("")}
  ` : ""}
</body>
</html>
  `;
}

export type ExportFormat = "json" | "csv" | "txt" | "pdf";

export function downloadResumeData(
  resumeData: ResumeData,
  fileName: string,
  format: ExportFormat
) {
  switch (format) {
    case "json":
      downloadAsJSON(resumeData, fileName);
      break;
    case "csv":
      downloadAsCSV(resumeData, fileName);
      break;
    case "txt":
      downloadAsTXT(resumeData, fileName);
      break;
    case "pdf":
      downloadAsPDF(resumeData, fileName);
      break;
    default:
      console.error("Unsupported format:", format);
  }
}
