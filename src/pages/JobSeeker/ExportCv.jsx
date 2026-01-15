"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Download, Plus, Trash2, GripVertical } from "lucide-react";
import jsPDF from "jspdf";

function CreateCV() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    // Personal Information
    name: "",
    professionalTitle: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    github: "",

    // Professional Summary
    summary: "",

    // Skills
    technicalSkills: "",
    softSkills: "",

    // Work Experience
    experiences: [
      {
        title: "",
        company: "",
        location: "",
        startDate: "",
        endDate: "",
        current: false,
        achievements: [""],
      },
    ],

    // Education
    educations: [
      {
        degree: "",
        institution: "",
        location: "",
        graduationYear: "",
        gpa: "",
      },
    ],

    // Projects
    projects: [
      {
        name: "",
        description: "",
        technologies: "",
        role: "",
      },
    ],

    // Certifications
    certifications: [{ name: "", issuer: "", date: "" }],

    // Languages
    languages: [{ language: "", proficiency: "" }],

    // Additional Information
    additionalInfo: "",
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleArrayChange = (index, field, value, arrayName) => {
    setFormData((prev) => {
      const newArray = [...prev[arrayName]];
      newArray[index][field] = value;
      return { ...prev, [arrayName]: newArray };
    });
  };

  const handleAchievementChange = (expIndex, achIndex, value) => {
    setFormData((prev) => {
      const newExperiences = [...prev.experiences];
      newExperiences[expIndex].achievements[achIndex] = value;
      return { ...prev, experiences: newExperiences };
    });
  };

  const addAchievement = (expIndex) => {
    setFormData((prev) => {
      const newExperiences = [...prev.experiences];
      newExperiences[expIndex].achievements.push("");
      return { ...prev, experiences: newExperiences };
    });
  };

  const removeAchievement = (expIndex, achIndex) => {
    setFormData((prev) => {
      const newExperiences = [...prev.experiences];
      newExperiences[expIndex].achievements = newExperiences[
        expIndex
      ].achievements.filter((_, i) => i !== achIndex);
      return { ...prev, experiences: newExperiences };
    });
  };

  const addItem = (arrayName) => {
    const templates = {
      experiences: {
        title: "",
        company: "",
        location: "",
        startDate: "",
        endDate: "",
        current: false,
        achievements: [""],
      },
      educations: {
        degree: "",
        institution: "",
        location: "",
        graduationYear: "",
        gpa: "",
      },
      projects: { name: "", description: "", technologies: "", role: "" },
      certifications: { name: "", issuer: "", date: "" },
      languages: { language: "", proficiency: "" },
    };
    setFormData((prev) => ({
      ...prev,
      [arrayName]: [...prev[arrayName], templates[arrayName]],
    }));
  };

  const removeItem = (arrayName, index) => {
    setFormData((prev) => ({
      ...prev,
      [arrayName]: prev[arrayName].filter((_, i) => i !== index),
    }));
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margins = { left: 20, right: 20, top: 20, bottom: 20 };
    const contentWidth = pageWidth - margins.left - margins.right;
    let yPosition = margins.top;

    const checkPageBreak = (requiredSpace) => {
      if (yPosition + requiredSpace > pageHeight - margins.bottom) {
        doc.addPage();
        yPosition = margins.top;
        return true;
      }
      return false;
    };

    const addSectionHeader = (title) => {
      checkPageBreak(15);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(44, 62, 80);
      doc.text(title.toUpperCase(), margins.left, yPosition);
      yPosition += 2;
      doc.setDrawColor(52, 73, 94);
      doc.setLineWidth(0.5);
      doc.line(margins.left, yPosition, pageWidth - margins.right, yPosition);
      yPosition += 6;
    };

    // Header - Name
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.setTextColor(44, 62, 80);
    const name = formData.name || "YOUR NAME";
    doc.text(name.toUpperCase(), pageWidth / 2, yPosition, { align: "center" });
    yPosition += 8;

    // Professional Title
    if (formData.professionalTitle) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.setTextColor(127, 140, 141);
      doc.text(formData.professionalTitle, pageWidth / 2, yPosition, {
        align: "center",
      });
      yPosition += 6;
    }

    // Contact Information
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(52, 73, 94);
    const contactParts = [
      formData.email,
      formData.phone,
      formData.location,
      formData.linkedin,
      formData.github,
    ].filter(Boolean);

    if (contactParts.length > 0) {
      const contactLine = contactParts.join("  |  ");
      const contactLines = doc.splitTextToSize(contactLine, contentWidth);
      contactLines.forEach((line) => {
        doc.text(line, pageWidth / 2, yPosition, { align: "center" });
        yPosition += 4;
      });
    }
    yPosition += 6;

    // Professional Summary
    if (formData.summary) {
      addSectionHeader("Professional Summary");
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(44, 62, 80);
      const summaryLines = doc.splitTextToSize(formData.summary, contentWidth);
      summaryLines.forEach((line) => {
        checkPageBreak(5);
        doc.text(line, margins.left, yPosition);
        yPosition += 5;
      });
      yPosition += 6;
    }

    // Key Skills
    if (formData.technicalSkills || formData.softSkills) {
      addSectionHeader("Key Skills");
      doc.setFontSize(10);

      if (formData.technicalSkills) {
        doc.setFont("helvetica", "bold");
        doc.setTextColor(44, 62, 80);
        doc.text("Technical Skills: ", margins.left, yPosition);
        const techWidth = doc.getTextWidth("Technical Skills: ");
        doc.setFont("helvetica", "normal");
        const techLines = doc.splitTextToSize(
          formData.technicalSkills,
          contentWidth - techWidth
        );
        doc.text(techLines[0], margins.left + techWidth, yPosition);
        yPosition += 5;
        for (let i = 1; i < techLines.length; i++) {
          doc.text(techLines[i], margins.left, yPosition);
          yPosition += 5;
        }
      }

      if (formData.softSkills) {
        checkPageBreak(10);
        doc.setFont("helvetica", "bold");
        doc.text("Soft Skills: ", margins.left, yPosition);
        const softWidth = doc.getTextWidth("Soft Skills: ");
        doc.setFont("helvetica", "normal");
        const softLines = doc.splitTextToSize(
          formData.softSkills,
          contentWidth - softWidth
        );
        doc.text(softLines[0], margins.left + softWidth, yPosition);
        yPosition += 5;
        for (let i = 1; i < softLines.length; i++) {
          doc.text(softLines[i], margins.left, yPosition);
          yPosition += 5;
        }
      }
      yPosition += 4;
    }

    // Work Experience
    const hasExperience = formData.experiences.some(
      (e) => e.title || e.company
    );
    if (hasExperience) {
      addSectionHeader("Professional Experience");

      formData.experiences.forEach((exp) => {
        if (exp.title || exp.company) {
          checkPageBreak(25);

          // Job Title
          doc.setFont("helvetica", "bold");
          doc.setFontSize(11);
          doc.setTextColor(44, 62, 80);
          doc.text(exp.title || "Position Title", margins.left, yPosition);

          // Date on the right
          const dateText = exp.current
            ? `${exp.startDate} - Present`
            : `${exp.startDate} - ${exp.endDate}`;
          if (exp.startDate) {
            doc.setFont("helvetica", "normal");
            doc.setFontSize(9);
            doc.text(dateText, pageWidth - margins.right, yPosition, {
              align: "right",
            });
          }
          yPosition += 5;

          // Company and Location
          doc.setFont("helvetica", "italic");
          doc.setFontSize(10);
          doc.setTextColor(127, 140, 141);
          const companyLine = [exp.company, exp.location]
            .filter(Boolean)
            .join(" | ");
          doc.text(companyLine || "Company Name", margins.left, yPosition);
          yPosition += 6;

          // Achievements
          doc.setFont("helvetica", "normal");
          doc.setFontSize(9);
          doc.setTextColor(44, 62, 80);
          exp.achievements.forEach((achievement) => {
            if (achievement) {
              checkPageBreak(8);
              const bulletText = `•  ${achievement}`;
              const achievementLines = doc.splitTextToSize(
                bulletText,
                contentWidth - 5
              );
              achievementLines.forEach((line, idx) => {
                doc.text(
                  idx === 0 ? line : `   ${line}`,
                  margins.left + 3,
                  yPosition
                );
                yPosition += 4;
              });
            }
          });
          yPosition += 4;
        }
      });
      yPosition += 2;
    }

    // Education
    const hasEducation = formData.educations.some(
      (e) => e.degree || e.institution
    );
    if (hasEducation) {
      addSectionHeader("Education");

      formData.educations.forEach((edu) => {
        if (edu.degree || edu.institution) {
          checkPageBreak(15);

          // Degree
          doc.setFont("helvetica", "bold");
          doc.setFontSize(11);
          doc.setTextColor(44, 62, 80);
          doc.text(edu.degree || "Degree", margins.left, yPosition);

          // Year on the right
          if (edu.graduationYear) {
            doc.setFont("helvetica", "normal");
            doc.setFontSize(9);
            doc.text(edu.graduationYear, pageWidth - margins.right, yPosition, {
              align: "right",
            });
          }
          yPosition += 5;

          // Institution
          doc.setFont("helvetica", "italic");
          doc.setFontSize(10);
          doc.setTextColor(127, 140, 141);
          const eduLine = [edu.institution, edu.location]
            .filter(Boolean)
            .join(" | ");
          doc.text(eduLine || "Institution", margins.left, yPosition);

          // GPA
          if (edu.gpa) {
            yPosition += 5;
            doc.setFont("helvetica", "normal");
            doc.setFontSize(9);
            doc.setTextColor(44, 62, 80);
            doc.text(`GPA: ${edu.gpa}`, margins.left, yPosition);
          }
          yPosition += 8;
        }
      });
    }

    // Projects
    const hasProjects = formData.projects.some((p) => p.name || p.description);
    if (hasProjects) {
      addSectionHeader("Projects");

      formData.projects.forEach((project) => {
        if (project.name || project.description) {
          checkPageBreak(20);

          doc.setFont("helvetica", "bold");
          doc.setFontSize(10);
          doc.setTextColor(44, 62, 80);
          doc.text(project.name || "Project Name", margins.left, yPosition);
          yPosition += 5;

          if (project.description) {
            doc.setFont("helvetica", "normal");
            doc.setFontSize(9);
            const descLines = doc.splitTextToSize(
              project.description,
              contentWidth
            );
            descLines.forEach((line) => {
              doc.text(line, margins.left, yPosition);
              yPosition += 4;
            });
          }

          if (project.technologies) {
            doc.setFont("helvetica", "italic");
            doc.setFontSize(9);
            doc.setTextColor(127, 140, 141);
            doc.text(
              `Technologies: ${project.technologies}`,
              margins.left,
              yPosition
            );
            yPosition += 4;
          }

          if (project.role) {
            doc.setFont("helvetica", "normal");
            doc.setFontSize(9);
            doc.setTextColor(44, 62, 80);
            doc.text(`Role: ${project.role}`, margins.left, yPosition);
            yPosition += 4;
          }
          yPosition += 4;
        }
      });
    }

    // Certifications
    const hasCertifications = formData.certifications.some((c) => c.name);
    if (hasCertifications) {
      addSectionHeader("Certifications");

      formData.certifications.forEach((cert) => {
        if (cert.name) {
          checkPageBreak(8);
          doc.setFont("helvetica", "normal");
          doc.setFontSize(10);
          doc.setTextColor(44, 62, 80);
          const certLine = [cert.name, cert.issuer, cert.date]
            .filter(Boolean)
            .join(" | ");
          doc.text(`•  ${certLine}`, margins.left, yPosition);
          yPosition += 5;
        }
      });
      yPosition += 4;
    }

    // Languages
    const hasLanguages = formData.languages.some((l) => l.language);
    if (hasLanguages) {
      addSectionHeader("Languages");

      const langItems = formData.languages
        .filter((l) => l.language)
        .map((l) =>
          l.proficiency ? `${l.language} (${l.proficiency})` : l.language
        );

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(44, 62, 80);
      doc.text(langItems.join("  |  "), margins.left, yPosition);
      yPosition += 8;
    }

    // Additional Information
    if (formData.additionalInfo) {
      addSectionHeader("Additional Information");
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(44, 62, 80);
      const addLines = doc.splitTextToSize(
        formData.additionalInfo,
        contentWidth
      );
      addLines.forEach((line) => {
        checkPageBreak(5);
        doc.text(line, margins.left, yPosition);
        yPosition += 4;
      });
    }

    doc.save(`${formData.name || "MyCV"}_Resume.pdf`);
  };

  const inputClass =
    "w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-sm";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const sectionClass =
    "space-y-4 p-6 bg-gray-50 rounded-xl border border-gray-200";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 px-6 py-4 flex items-center justify-between z-50 shadow-sm">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">CV Builder</h1>
        </div>
        <button
          onClick={() => navigate("/")}
          className="px-5 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium text-sm"
        >
          Quay về
        </button>
      </nav>

      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 flex flex-col xl:flex-row gap-8 max-w-[1600px] mx-auto">
        {/* Left: Form */}
        <div className="xl:w-1/2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Build Your Resume
            </h2>

            {/* Personal Information */}
            <div className={sectionClass}>
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </span>
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className={labelClass}>Full Name *</label>
                  <input
                    name="name"
                    placeholder="Dinh Bac"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={inputClass}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass}>Professional Title</label>
                  <input
                    name="professionalTitle"
                    placeholder="Senior Software Engineer"
                    value={formData.professionalTitle}
                    onChange={handleInputChange}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Email *</label>
                  <input
                    name="email"
                    type="email"
                    placeholder="mdt@email.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Phone</label>
                  <input
                    name="phone"
                    placeholder="123-456-7890"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Location</label>
                  <input
                    name="location"
                    placeholder="San Francisco, CA"
                    value={formData.location}
                    onChange={handleInputChange}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>LinkedIn</label>
                  <input
                    name="linkedin"
                    placeholder="linkedin.com/in/mdt"
                    value={formData.linkedin}
                    onChange={handleInputChange}
                    className={inputClass}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass}>GitHub / Portfolio</label>
                  <input
                    name="github"
                    placeholder="github.com/db"
                    value={formData.github}
                    onChange={handleInputChange}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            {/* Professional Summary */}
            <div className={sectionClass}>
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </span>
                Professional Summary
              </h3>
              <p className="text-xs text-gray-500 -mt-2">
                Write 3-4 lines highlighting years of experience, key skills,
                and career goals. Avoid personal pronouns.
              </p>
              <textarea
                name="summary"
                placeholder="Results-driven Software Engineer with 5+ years of experience in full-stack development. Proven track record of delivering scalable web applications and leading cross-functional teams. Seeking to leverage expertise in React and Node.js to drive innovation at a forward-thinking company."
                value={formData.summary}
                onChange={handleInputChange}
                className={`${inputClass} h-28 resize-none`}
              />
            </div>

            {/* Key Skills */}
            <div className={sectionClass}>
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </span>
                Key Skills
              </h3>
              <div>
                <label className={labelClass}>Technical Skills</label>
                <textarea
                  name="technicalSkills"
                  placeholder="JavaScript, TypeScript, React, Node.js, Python, PostgreSQL, MongoDB, AWS, Docker, Git, CI/CD, REST APIs, GraphQL"
                  value={formData.technicalSkills}
                  onChange={handleInputChange}
                  className={`${inputClass} h-20 resize-none`}
                />
              </div>
              <div>
                <label className={labelClass}>Soft Skills</label>
                <textarea
                  name="softSkills"
                  placeholder="Team Leadership, Agile/Scrum, Problem Solving, Communication, Project Management, Mentoring"
                  value={formData.softSkills}
                  onChange={handleInputChange}
                  className={`${inputClass} h-16 resize-none`}
                />
              </div>
            </div>

            {/* Work Experience */}
            <div className={sectionClass}>
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                  4
                </span>
                Professional Experience
              </h3>
              <p className="text-xs text-gray-500 -mt-2">
                Use action verbs and quantify achievements (%, numbers, KPIs)
              </p>

              {formData.experiences.map((exp, expIndex) => (
                <div
                  key={expIndex}
                  className="space-y-3 p-4 bg-white rounded-lg border border-gray-200 relative"
                >
                  {formData.experiences.length > 1 && (
                    <button
                      onClick={() => removeItem("experiences", expIndex)}
                      className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass}>Job Title *</label>
                      <input
                        placeholder="Senior Software Engineer"
                        value={exp.title}
                        onChange={(e) =>
                          handleArrayChange(
                            expIndex,
                            "title",
                            e.target.value,
                            "experiences"
                          )
                        }
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Company *</label>
                      <input
                        placeholder="Tech Company Inc."
                        value={exp.company}
                        onChange={(e) =>
                          handleArrayChange(
                            expIndex,
                            "company",
                            e.target.value,
                            "experiences"
                          )
                        }
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Location</label>
                      <input
                        placeholder="San Francisco, CA"
                        value={exp.location}
                        onChange={(e) =>
                          handleArrayChange(
                            expIndex,
                            "location",
                            e.target.value,
                            "experiences"
                          )
                        }
                        className={inputClass}
                      />
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <label className={labelClass}>Start Date</label>
                        <input
                          placeholder="Jan 2020"
                          value={exp.startDate}
                          onChange={(e) =>
                            handleArrayChange(
                              expIndex,
                              "startDate",
                              e.target.value,
                              "experiences"
                            )
                          }
                          className={inputClass}
                        />
                      </div>
                      <div className="flex-1">
                        <label className={labelClass}>End Date</label>
                        <input
                          placeholder="Present"
                          value={exp.endDate}
                          onChange={(e) =>
                            handleArrayChange(
                              expIndex,
                              "endDate",
                              e.target.value,
                              "experiences"
                            )
                          }
                          disabled={exp.current}
                          className={`${inputClass} ${
                            exp.current ? "bg-gray-100" : ""
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={exp.current}
                      onChange={(e) =>
                        handleArrayChange(
                          expIndex,
                          "current",
                          e.target.checked,
                          "experiences"
                        )
                      }
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <label className="text-sm text-gray-600">
                      Currently working here
                    </label>
                  </div>

                  <div>
                    <label className={labelClass}>
                      Key Achievements & Responsibilities
                    </label>
                    {exp.achievements.map((achievement, achIndex) => (
                      <div key={achIndex} className="flex gap-2 mb-2">
                        <span className="text-gray-400 mt-3">•</span>
                        <input
                          placeholder="Led development of microservices architecture, reducing deployment time by 40%"
                          value={achievement}
                          onChange={(e) =>
                            handleAchievementChange(
                              expIndex,
                              achIndex,
                              e.target.value
                            )
                          }
                          className={`${inputClass} flex-1`}
                        />
                        {exp.achievements.length > 1 && (
                          <button
                            onClick={() =>
                              removeAchievement(expIndex, achIndex)
                            }
                            className="p-2 text-gray-400 hover:text-red-500 transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={() => addAchievement(expIndex)}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" /> Add Achievement
                    </button>
                  </div>
                </div>
              ))}
              <button
                onClick={() => addItem("experiences")}
                className="w-full px-4 py-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition text-sm font-medium flex items-center justify-center gap-2 border-2 border-dashed border-blue-200"
              >
                <Plus className="w-4 h-4" /> Add Experience
              </button>
            </div>

            {/* Education */}
            <div className={sectionClass}>
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                  5
                </span>
                Education
              </h3>

              {formData.educations.map((edu, index) => (
                <div
                  key={index}
                  className="space-y-3 p-4 bg-white rounded-lg border border-gray-200 relative"
                >
                  {formData.educations.length > 1 && (
                    <button
                      onClick={() => removeItem("educations", index)}
                      className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="md:col-span-2">
                      <label className={labelClass}>Degree *</label>
                      <input
                        placeholder="Bachelor of Science in Computer Science"
                        value={edu.degree}
                        onChange={(e) =>
                          handleArrayChange(
                            index,
                            "degree",
                            e.target.value,
                            "educations"
                          )
                        }
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Institution *</label>
                      <input
                        placeholder="Stanford University"
                        value={edu.institution}
                        onChange={(e) =>
                          handleArrayChange(
                            index,
                            "institution",
                            e.target.value,
                            "educations"
                          )
                        }
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Location</label>
                      <input
                        placeholder="Stanford, CA"
                        value={edu.location}
                        onChange={(e) =>
                          handleArrayChange(
                            index,
                            "location",
                            e.target.value,
                            "educations"
                          )
                        }
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Graduation Year</label>
                      <input
                        placeholder="2018"
                        value={edu.graduationYear}
                        onChange={(e) =>
                          handleArrayChange(
                            index,
                            "graduationYear",
                            e.target.value,
                            "educations"
                          )
                        }
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>GPA (Optional)</label>
                      <input
                        placeholder="3.8/4.0"
                        value={edu.gpa}
                        onChange={(e) =>
                          handleArrayChange(
                            index,
                            "gpa",
                            e.target.value,
                            "educations"
                          )
                        }
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button
                onClick={() => addItem("educations")}
                className="w-full px-4 py-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition text-sm font-medium flex items-center justify-center gap-2 border-2 border-dashed border-blue-200"
              >
                <Plus className="w-4 h-4" /> Add Education
              </button>
            </div>

            {/* Projects */}
            <div className={sectionClass}>
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                  6
                </span>
                Projects
                <span className="text-xs font-normal text-gray-500">
                  (Optional)
                </span>
              </h3>

              {formData.projects.map((project, index) => (
                <div
                  key={index}
                  className="space-y-3 p-4 bg-white rounded-lg border border-gray-200 relative"
                >
                  <button
                    onClick={() => removeItem("projects", index)}
                    className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div>
                    <label className={labelClass}>Project Name</label>
                    <input
                      placeholder="E-Commerce Platform"
                      value={project.name}
                      onChange={(e) =>
                        handleArrayChange(
                          index,
                          "name",
                          e.target.value,
                          "projects"
                        )
                      }
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Description</label>
                    <textarea
                      placeholder="Built a full-stack e-commerce platform serving 10,000+ monthly active users"
                      value={project.description}
                      onChange={(e) =>
                        handleArrayChange(
                          index,
                          "description",
                          e.target.value,
                          "projects"
                        )
                      }
                      className={`${inputClass} h-16 resize-none`}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Technologies Used</label>
                    <input
                      placeholder="React, Node.js, PostgreSQL, AWS"
                      value={project.technologies}
                      onChange={(e) =>
                        handleArrayChange(
                          index,
                          "technologies",
                          e.target.value,
                          "projects"
                        )
                      }
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Your Role & Impact</label>
                    <input
                      placeholder="Lead Developer - Architected the backend and reduced load time by 50%"
                      value={project.role}
                      onChange={(e) =>
                        handleArrayChange(
                          index,
                          "role",
                          e.target.value,
                          "projects"
                        )
                      }
                      className={inputClass}
                    />
                  </div>
                </div>
              ))}
              <button
                onClick={() => addItem("projects")}
                className="w-full px-4 py-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition text-sm font-medium flex items-center justify-center gap-2 border-2 border-dashed border-blue-200"
              >
                <Plus className="w-4 h-4" /> Add Project
              </button>
            </div>

            {/* Certifications */}
            <div className={sectionClass}>
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                  7
                </span>
                Certifications
                <span className="text-xs font-normal text-gray-500">
                  (Optional)
                </span>
              </h3>

              {formData.certifications.map((cert, index) => (
                <div key={index} className="flex gap-3 items-start">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input
                      placeholder="AWS Solutions Architect"
                      value={cert.name}
                      onChange={(e) =>
                        handleArrayChange(
                          index,
                          "name",
                          e.target.value,
                          "certifications"
                        )
                      }
                      className={inputClass}
                    />
                    <input
                      placeholder="Amazon Web Services"
                      value={cert.issuer}
                      onChange={(e) =>
                        handleArrayChange(
                          index,
                          "issuer",
                          e.target.value,
                          "certifications"
                        )
                      }
                      className={inputClass}
                    />
                    <input
                      placeholder="2023"
                      value={cert.date}
                      onChange={(e) =>
                        handleArrayChange(
                          index,
                          "date",
                          e.target.value,
                          "certifications"
                        )
                      }
                      className={inputClass}
                    />
                  </div>
                  <button
                    onClick={() => removeItem("certifications", index)}
                    className="p-2 text-gray-400 hover:text-red-500 transition mt-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => addItem("certifications")}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Add Certification
              </button>
            </div>

            {/* Languages */}
            <div className={sectionClass}>
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                  8
                </span>
                Languages
                <span className="text-xs font-normal text-gray-500">
                  (Optional)
                </span>
              </h3>

              {formData.languages.map((lang, index) => (
                <div key={index} className="flex gap-3 items-center">
                  <input
                    placeholder="English"
                    value={lang.language}
                    onChange={(e) =>
                      handleArrayChange(
                        index,
                        "language",
                        e.target.value,
                        "languages"
                      )
                    }
                    className={`${inputClass} flex-1`}
                  />
                  <select
                    value={lang.proficiency}
                    onChange={(e) =>
                      handleArrayChange(
                        index,
                        "proficiency",
                        e.target.value,
                        "languages"
                      )
                    }
                    className={`${inputClass} flex-1`}
                  >
                    <option value="">Select Proficiency</option>
                    <option value="Native">Native</option>
                    <option value="Fluent">Fluent</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Basic">Basic</option>
                  </select>
                  <button
                    onClick={() => removeItem("languages", index)}
                    className="p-2 text-gray-400 hover:text-red-500 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => addItem("languages")}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Add Language
              </button>
            </div>

            {/* Additional Information */}
            <div className={sectionClass}>
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                  9
                </span>
                Additional Information
                <span className="text-xs font-normal text-gray-500">
                  (Optional)
                </span>
              </h3>
              <textarea
                name="additionalInfo"
                placeholder="Volunteer work, publications, awards, interests, or any other relevant information..."
                value={formData.additionalInfo}
                onChange={handleInputChange}
                className={`${inputClass} h-20 resize-none`}
              />
            </div>

            {/* Export Button */}
            <button
              onClick={generatePDF}
              className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition font-semibold flex items-center justify-center gap-3 shadow-lg shadow-blue-200"
            >
              <Download className="w-5 h-5" />
              Download PDF Resume
            </button>
          </div>
        </div>

        {/* Right: Preview */}
        <div className="xl:w-1/2">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-lg sticky top-24 overflow-hidden">
            <div className="bg-gray-50 px-6 py-3 border-b border-gray-200 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">
                Live Preview
              </span>
            </div>
            <div className="p-8 overflow-auto h-[calc(100vh-10rem)]">
              {/* Header */}
              <div className="text-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 tracking-wide">
                  {(formData.name || "YOUR NAME").toUpperCase()}
                </h1>
                {formData.professionalTitle && (
                  <p className="text-lg text-gray-500 mt-1">
                    {formData.professionalTitle}
                  </p>
                )}
                <div className="flex flex-wrap justify-center gap-2 text-sm text-gray-600 mt-3">
                  {[
                    formData.email,
                    formData.phone,
                    formData.location,
                    formData.linkedin,
                    formData.github,
                  ]
                    .filter(Boolean)
                    .map((item, idx, arr) => (
                      <span key={idx}>
                        {item}
                        {idx < arr.length - 1 && (
                          <span className="mx-2 text-gray-300">|</span>
                        )}
                      </span>
                    ))}
                </div>
              </div>

              <hr className="border-gray-300 mb-6" />

              {/* Professional Summary */}
              {formData.summary && (
                <div className="mb-6">
                  <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-2 pb-1 border-b border-gray-300">
                    Professional Summary
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {formData.summary}
                  </p>
                </div>
              )}

              {/* Key Skills */}
              {(formData.technicalSkills || formData.softSkills) && (
                <div className="mb-6">
                  <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-2 pb-1 border-b border-gray-300">
                    Key Skills
                  </h3>
                  {formData.technicalSkills && (
                    <p className="text-sm text-gray-700 mb-1">
                      <span className="font-semibold">Technical:</span>{" "}
                      {formData.technicalSkills}
                    </p>
                  )}
                  {formData.softSkills && (
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">Soft Skills:</span>{" "}
                      {formData.softSkills}
                    </p>
                  )}
                </div>
              )}

              {/* Professional Experience */}
              {formData.experiences.some((e) => e.title || e.company) && (
                <div className="mb-6">
                  <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-3 pb-1 border-b border-gray-300">
                    Professional Experience
                  </h3>
                  {formData.experiences.map(
                    (exp, index) =>
                      (exp.title || exp.company) && (
                        <div key={index} className="mb-4">
                          <div className="flex justify-between items-start">
                            <h4 className="text-sm font-bold text-gray-800">
                              {exp.title || "Position"}
                            </h4>
                            <span className="text-xs text-gray-500">
                              {exp.current
                                ? `${exp.startDate} - Present`
                                : `${exp.startDate} - ${exp.endDate}`}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 italic">
                            {[exp.company, exp.location]
                              .filter(Boolean)
                              .join(" | ")}
                          </p>
                          <ul className="mt-2 space-y-1">
                            {exp.achievements.map(
                              (achievement, achIdx) =>
                                achievement && (
                                  <li
                                    key={achIdx}
                                    className="text-sm text-gray-700 flex"
                                  >
                                    <span className="mr-2">•</span>
                                    <span>{achievement}</span>
                                  </li>
                                )
                            )}
                          </ul>
                        </div>
                      )
                  )}
                </div>
              )}

              {/* Education */}
              {formData.educations.some((e) => e.degree || e.institution) && (
                <div className="mb-6">
                  <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-3 pb-1 border-b border-gray-300">
                    Education
                  </h3>
                  {formData.educations.map(
                    (edu, index) =>
                      (edu.degree || edu.institution) && (
                        <div key={index} className="mb-3">
                          <div className="flex justify-between items-start">
                            <h4 className="text-sm font-bold text-gray-800">
                              {edu.degree || "Degree"}
                            </h4>
                            <span className="text-xs text-gray-500">
                              {edu.graduationYear}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 italic">
                            {[edu.institution, edu.location]
                              .filter(Boolean)
                              .join(" | ")}
                          </p>
                          {edu.gpa && (
                            <p className="text-xs text-gray-600 mt-1">
                              GPA: {edu.gpa}
                            </p>
                          )}
                        </div>
                      )
                  )}
                </div>
              )}

              {/* Projects */}
              {formData.projects.some((p) => p.name) && (
                <div className="mb-6">
                  <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-3 pb-1 border-b border-gray-300">
                    Projects
                  </h3>
                  {formData.projects.map(
                    (project, index) =>
                      project.name && (
                        <div key={index} className="mb-3">
                          <h4 className="text-sm font-bold text-gray-800">
                            {project.name}
                          </h4>
                          {project.description && (
                            <p className="text-sm text-gray-700">
                              {project.description}
                            </p>
                          )}
                          {project.technologies && (
                            <p className="text-xs text-gray-500 italic mt-1">
                              Technologies: {project.technologies}
                            </p>
                          )}
                          {project.role && (
                            <p className="text-xs text-gray-600">
                              Role: {project.role}
                            </p>
                          )}
                        </div>
                      )
                  )}
                </div>
              )}

              {/* Certifications */}
              {formData.certifications.some((c) => c.name) && (
                <div className="mb-6">
                  <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-2 pb-1 border-b border-gray-300">
                    Certifications
                  </h3>
                  <ul className="space-y-1">
                    {formData.certifications.map(
                      (cert, index) =>
                        cert.name && (
                          <li key={index} className="text-sm text-gray-700">
                            •{" "}
                            {[cert.name, cert.issuer, cert.date]
                              .filter(Boolean)
                              .join(" | ")}
                          </li>
                        )
                    )}
                  </ul>
                </div>
              )}

              {/* Languages */}
              {formData.languages.some((l) => l.language) && (
                <div className="mb-6">
                  <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-2 pb-1 border-b border-gray-300">
                    Languages
                  </h3>
                  <p className="text-sm text-gray-700">
                    {formData.languages
                      .filter((l) => l.language)
                      .map((l) =>
                        l.proficiency
                          ? `${l.language} (${l.proficiency})`
                          : l.language
                      )
                      .join("  |  ")}
                  </p>
                </div>
              )}

              {/* Additional Information */}
              {formData.additionalInfo && (
                <div>
                  <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-2 pb-1 border-b border-gray-300">
                    Additional Information
                  </h3>
                  <p className="text-sm text-gray-700">
                    {formData.additionalInfo}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateCV;
