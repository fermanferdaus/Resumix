import React from "react";
import { DEFAULT_SECTION_TITLES } from "../../constants/editorSections.js";

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

    // Format contact items
    let linkItems = [];
    if (Array.isArray(header.links) && header.links.length > 0) {
      linkItems = header.links.filter(Boolean);
    } else if (header.website) {
      linkItems = [header.website];
    }

    const contactParts = [
      header.phone,
      header.email,
      ...linkItems,
      header.location,
    ].filter(Boolean);

    const scale = zoom / 100;

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
            {/* 1. HEADER */}
            <header className="mb-2">
              <h1
                style={{
                  fontSize: "30px",
                  lineHeight: 1.2,
                  fontWeight: 700,
                  letterSpacing: "-0.01em",
                }}
                className="uppercase text-black"
              >
                {header.fullName || "NAMA LENGKAP"}
              </h1>

              <div
                style={{
                  fontSize: "17px",
                  lineHeight: 1.3,
                  fontWeight: 700,
                  marginTop: "2px",
                }}
                className="text-black"
              >
                {header.targetRole || "Profesi Target"}
              </div>

              <div
                style={{
                  fontSize: "10px",
                  lineHeight: 1.5,
                  marginTop: "4px",
                  borderBottom: "2px dotted #777",
                  paddingBottom: "5px",
                  marginBottom: "6px",
                }}
                className="text-black font-normal"
              >
                {contactParts.length > 0
                  ? contactParts.join(" / ")
                  : "+62 81234567890 / email@example.com / https://portfolio.com / Kota, Indonesia"}
              </div>
            </header>

            {/* 2. PROFIL */}
            {summary && (
              <section className="mb-4">
                <h2
                  style={{
                    fontSize: "17px",
                    lineHeight: 1.3,
                    fontWeight: 700,
                  }}
                  className="uppercase text-black tracking-wide"
                >
                  {sectionTitles.summary || "PROFIL"}
                </h2>
                <p
                  style={{
                    fontSize: "10px",
                    lineHeight: 1.5,
                    textAlign: "justify",
                    borderBottom: "2px dotted #777",
                    paddingBottom: "9px",
                    marginBottom: "6px",
                  }}
                  className="text-black font-normal"
                >
                  {summary}
                </p>
              </section>
            )}

            {/* 3. PENDIDIKAN */}
            {educations.length > 0 && (
              <section className="mb-4">
                <h2
                  style={{
                    fontSize: "17px",
                    lineHeight: 1.3,
                    fontWeight: 700,
                  }}
                  className="uppercase text-black tracking-wide"
                >
                  {sectionTitles.educations || "PENDIDIKAN"}
                </h2>
                <div className="space-y-2">
                  {educations.map((edu, idx) => {
                    let gradeText = "";
                    if (edu.gpa?.trim()) {
                      const trimmed = edu.gpa.trim();
                      if (/^(ipk|nilai|gpa)/i.test(trimmed)) {
                        gradeText = `/ ${trimmed}`;
                      } else {
                        const num = parseFloat(trimmed);
                        if (!isNaN(num) && num > 4.0) {
                          gradeText = `/ Nilai: ${trimmed}`;
                        } else {
                          gradeText = `/ IPK: ${trimmed}`;
                        }
                      }
                    }

                    const validBullets = Array.isArray(edu.bullets)
                      ? edu.bullets.filter((b) => b && b.trim())
                      : [];

                    return (
                      <div key={idx}>
                        <div
                          style={{
                            fontSize: "10px",
                            lineHeight: 1.3,
                            fontWeight: 700,
                          }}
                          className="uppercase text-black"
                        >
                          {edu.degree || "PENDIDIKAN"} {gradeText}
                        </div>
                        <div
                          style={{
                            fontSize: "10px",
                            lineHeight: 1.5,
                            borderBottom: "2px dotted #777",
                            paddingBottom: "9px",
                            marginBottom: "6px",
                          }}
                          className="text-black"
                        >
                          {[
                            edu.startDate && edu.endDate
                              ? `${edu.startDate} – ${edu.endDate}`
                              : edu.period || edu.startDate || edu.endDate,
                            edu.institution,
                            edu.location,
                          ]
                            .filter(Boolean)
                            .join(" / ")}
                        </div>

                        {/* Bullet points deskripsi/prestasi pendidikan */}
                        {validBullets.length > 0 && (
                          <ul className="mt-1 space-y-0.5 list-disc list-outside ml-3 text-black">
                            {validBullets.map((bullet, bIdx) => (
                              <li
                                key={bIdx}
                                style={{
                                  fontSize: "10px",
                                  lineHeight: 1.5,
                                  borderBottom: "2px dotted #777",
                                  paddingBottom: "9px",
                                  marginBottom: "6px",
                                }}
                                className="text-black text-justify"
                              >
                                {bullet}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* 4. PENGALAMAN KERJA */}
            {experiences.length > 0 && (
              <section className="mb-4">
                <h2
                  style={{
                    fontSize: "17px",
                    lineHeight: 1.3,
                    fontWeight: 700,
                  }}
                  className="uppercase text-black tracking-wide"
                >
                  {sectionTitles.experiences || "PENGALAMAN KERJA"}
                </h2>
                <div className="space-y-2.5">
                  {experiences.map((exp, idx) => (
                    <div key={idx}>
                      <div
                        style={{
                          fontSize: "10px",
                          lineHeight: 1.3,
                          fontWeight: 700,
                        }}
                        className="uppercase text-black"
                      >
                        {[
                          exp.role,
                          exp.company && exp.location
                            ? `${exp.company}, ${exp.location}`
                            : exp.company || exp.location,
                        ]
                          .filter(Boolean)
                          .join(" / ")}
                      </div>

                      <div
                        style={{ fontSize: "10px", lineHeight: 1.4 }}
                        className="text-black mb-1"
                      >
                        {exp.startDate && exp.endDate
                          ? `${exp.startDate} - ${exp.endDate}`
                          : exp.startDate
                            ? `${exp.startDate} - Sekarang`
                            : exp.period || ""}
                      </div>

                      {exp.bullets && exp.bullets.length > 0 && (
                        <ul
                          className="list-disc pl-4 space-y-0.5"
                          style={{
                            fontSize: "10px",
                            lineHeight: 1.5,
                            borderBottom: "2px dotted #777",
                            paddingBottom: "9px",
                            marginBottom: "6px",
                          }}
                        >
                          {exp.bullets.filter(Boolean).map((bullet, bIdx) => (
                            <li
                              key={bIdx}
                              className="text-black text-justify pl-0.5"
                            >
                              {bullet}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 5. PENGALAMAN ORGANISASI */}
            {organizations.length > 0 && (
              <section className="mb-4">
                <h2
                  style={{
                    fontSize: "17px",
                    lineHeight: 1.3,
                    fontWeight: 700,
                  }}
                  className="uppercase text-black tracking-wide"
                >
                  {sectionTitles.organizations || "PENGALAMAN ORGANISASI"}
                </h2>
                <ul
                  className="list-disc pl-4 space-y-0.5"
                  style={{
                    fontSize: "10px",
                    lineHeight: 1.5,
                    borderBottom: "2px dotted #777",
                    paddingBottom: "9px",
                    marginBottom: "6px",
                  }}
                >
                  {organizations.map((org, idx) => {
                    const dateDisplay =
                      org.period ||
                      (org.startDate && org.endDate
                        ? `${org.startDate} – ${org.endDate}`
                        : org.startDate
                          ? `${org.startDate} – Sekarang`
                          : "");

                    return (
                      <li key={idx} className="text-black text-justify pl-0.5">
                        <span className="font-semibold">{org.role}</span>
                        {org.name ? `, ${org.name}` : ""}
                        {dateDisplay ? ` (${dateDisplay})` : ""}
                        {org.description ? ` - ${org.description}` : ""}
                      </li>
                    );
                  })}
                </ul>
              </section>
            )}

            {/* 6. SERTIFIKAT DAN PRESTASI */}
            {certifications.length > 0 && (
              <section className="mb-4">
                <h2
                  style={{
                    fontSize: "17px",
                    lineHeight: 1.3,
                    fontWeight: 700,
                  }}
                  className="uppercase text-black tracking-wide"
                >
                  {sectionTitles.certifications || "SERTIFIKAT DAN PRESTASI"}
                </h2>
                <ul
                  className="list-disc pl-4 space-y-0.5"
                  style={{
                    fontSize: "10px",
                    lineHeight: 1.5,
                    borderBottom: "2px dotted #777",
                    paddingBottom: "9px",
                    marginBottom: "6px",
                  }}
                >
                  {certifications.map((cert, idx) => {
                    if (!cert) return null;
                    const isObj = typeof cert === "object" && cert !== null;
                    const name = isObj ? cert.name : cert;
                    const issuer = isObj ? cert.issuer : "";
                    const year = isObj ? cert.year || cert.date : "";

                    if (!name && !issuer && !year) return null;

                    const parts = [];
                    if (name) parts.push(name);
                    if (issuer) parts.push(issuer);
                    let mainText = parts.join(", ");
                    if (year) {
                      mainText += ` (${year})`;
                    }

                    return (
                      <li key={idx} className="text-black text-justify pl-0.5">
                        {mainText}
                      </li>
                    );
                  })}
                </ul>
              </section>
            )}

            {/* 7. KEAHLIAN */}
            {((skills?.hardSkills && skills.hardSkills.length > 0) ||
              (skills?.softSkills && skills.softSkills.length > 0)) && (
              <section className="mb-4">
                <h2
                  style={{
                    fontSize: "17px",
                    lineHeight: 1.3,
                    fontWeight: 700,
                  }}
                  className="uppercase text-black tracking-wide"
                >
                  {sectionTitles.skills || "KEAHLIAN"}
                </h2>

                {/* Hard Skill */}
                {skills?.hardSkills && skills.hardSkills.length > 0 && (
                  <div className="mb-2">
                    {skills.softSkills && skills.softSkills.length > 0 && (
                      <div
                        style={{
                          fontSize: "10px",
                          lineHeight: 1.4,
                          fontWeight: 700,
                        }}
                        className="uppercase text-black mb-0.5"
                      >
                        HARD SKILL
                      </div>
                    )}
                    <ul
                      className="list-disc pl-4 space-y-0.5"
                      style={{ fontSize: "10px", lineHeight: 1.5 }}
                    >
                      {skills.hardSkills.map((h, idx) => {
                        if (!h) return null;
                        const isObj = typeof h === "object" && h !== null;
                        const category = isObj ? (h.category || "").trim() : "";
                        const items = isObj
                          ? Array.isArray(h.items)
                            ? h.items.join(", ")
                            : h.items
                          : h;

                        if (!items && !category) return null;

                        return (
                          <li
                            key={idx}
                            className="text-black text-justify pl-0.5"
                          >
                            {category ? (
                              <>
                                <span className="font-semibold">
                                  {category}
                                </span>
                                {" - "}
                                {items}
                              </>
                            ) : (
                              items
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}

                {/* Soft Skill */}
                {skills?.softSkills && skills.softSkills.length > 0 && (
                  <div>
                    {skills.hardSkills && skills.hardSkills.length > 0 && (
                      <div
                        style={{
                          fontSize: "10px",
                          lineHeight: 1.4,
                          fontWeight: 700,
                        }}
                        className="uppercase text-black mb-0.5"
                      >
                        SOFT SKILL
                      </div>
                    )}
                    <ul
                      className="list-disc pl-4 space-y-0.5"
                      style={{ fontSize: "10px", lineHeight: 1.5 }}
                    >
                      {skills.softSkills.map((s, idx) => (
                        <li
                          key={idx}
                          className="text-black text-justify pl-0.5"
                        >
                          {typeof s === "string" ? s : s.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>
            )}
          </div>
        </div>
      </div>
    );
  },
);

ResumeA4Preview.displayName = "ResumeA4Preview";
