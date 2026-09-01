import React from "react";
import {
  DEFAULT_SECTION_TITLES,
  normalizeSectionOrder,
} from "../../constants/editorSections.js";

// Modular Preview Sub-components
import { PreviewHeader } from "./preview/PreviewHeader.jsx";
import { PreviewSummary } from "./preview/PreviewSummary.jsx";
import { PreviewEducations } from "./preview/PreviewEducations.jsx";
import { PreviewExperiences } from "./preview/PreviewExperiences.jsx";
import { PreviewOrganizations } from "./preview/PreviewOrganizations.jsx";
import { PreviewCertifications } from "./preview/PreviewCertifications.jsx";
import { PreviewSkills } from "./preview/PreviewSkills.jsx";

export const ResumeA4Preview = React.forwardRef(
  ({ data = {}, zoom = 100 }, ref) => {
    const header = data.header || {};
    const summary = data.summary || "";
    const educations = data.educations || [];
    const experiences = data.experiences || [];
    const organizations = data.organizations || [];
    const certifications = data.certifications || [];
    const skills = data.skills || { hardSkills: [], softSkills: [] };

    const sectionTitles = {
      ...DEFAULT_SECTION_TITLES,
      ...(data.sectionTitles || {}),
    };

    const scale = zoom / 100;
    const bodySectionOrder = normalizeSectionOrder(data.sectionOrder);

    const renderSection = (sectionId) => {
      switch (sectionId) {
        case "summary":
          return (
            <PreviewSummary
              key="summary"
              summary={summary}
              title={sectionTitles.summary}
            />
          );
        case "educations":
          return (
            <PreviewEducations
              key="educations"
              educations={educations}
              title={sectionTitles.educations}
            />
          );
        case "experiences":
          return (
            <PreviewExperiences
              key="experiences"
              experiences={experiences}
              title={sectionTitles.experiences}
            />
          );
        case "organizations":
          return (
            <PreviewOrganizations
              key="organizations"
              organizations={organizations}
              title={sectionTitles.organizations}
            />
          );
        case "certifications":
          return (
            <PreviewCertifications
              key="certifications"
              certifications={certifications}
              title={sectionTitles.certifications}
            />
          );
        case "skills":
          return (
            <PreviewSkills
              key="skills"
              skills={skills}
              title={sectionTitles.skills}
            />
          );
        default:
          return null;
      }
    };

    return (
      <div className="flex justify-center items-start w-full py-4 print:p-0 print:m-0 print:block overflow-auto">
        {/* A4 Paper Container with Zoom Transform */}
        <div
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "top center",
            transition: "transform 0.15s ease-out",
          }}
          className="print:transform-none print:p-0 print:m-0 print:block"
        >
          <div
            ref={ref}
            id="resume-a4-document"
            style={{
              width: "210mm",
              minHeight: "297mm",
              paddingTop: "10mm",
              paddingBottom: "10mm",
              paddingLeft: "15mm",
              paddingRight: "15mm",
              fontFamily: "Arial, Helvetica, sans-serif",
              lineHeight: 1.5,
              color: "#000000",
              backgroundColor: "#ffffff",
            }}
            className="box-border shadow-sm border border-[#e2e8f0] print:border-none print:shadow-none print:m-0 print:p-[10mm_15mm] bg-white select-text"
          >
            {/* 1. HEADER (Fixed at Document Top) */}
            <PreviewHeader header={header} />

            {/* 2. BODY SECTIONS (Rendered in Dynamic User Order) */}
            {bodySectionOrder.map((sectionId) => renderSection(sectionId))}
          </div>
        </div>
      </div>
    );
  }
);

ResumeA4Preview.displayName = "ResumeA4Preview";
