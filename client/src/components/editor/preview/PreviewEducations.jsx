export const PreviewEducations = ({
  educations = [],
  title = "PENDIDIKAN",
  isLast = false,
}) => {
  if (!educations || educations.length === 0) return null;

  return (
    <section className={isLast ? "mb-0" : "mb-4"}>
      <h2
        style={{
          fontSize: "17px",
          lineHeight: 1.3,
          fontWeight: 700,
        }}
        className="uppercase text-black tracking-wide"
      >
        {title || "PENDIDIKAN"}
      </h2>
      <div className="space-y-2">
        {educations.map((edu, idx) => {
          const isItemLast = idx === educations.length - 1;
          const shouldOmitBorder = isItemLast && isLast;

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

          const hasBullets = validBullets.length > 0;

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
                  ...(!hasBullets && !shouldOmitBorder
                    ? {
                        borderBottom: "2px dotted #777",
                        paddingBottom: "9px",
                        marginBottom: "6px",
                      }
                    : {}),
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
              {hasBullets && (
                <ul className="mt-1 space-y-0.5 list-disc list-outside ml-3 text-black">
                  {validBullets.map((bullet, bIdx) => {
                    const isBulletLast = bIdx === validBullets.length - 1;
                    const shouldOmitBulletBorder = isBulletLast && shouldOmitBorder;
                    return (
                      <li
                        key={bIdx}
                        style={{
                          fontSize: "10px",
                          lineHeight: 1.5,
                          ...(shouldOmitBulletBorder
                            ? {}
                            : {
                                borderBottom: "2px dotted #777",
                                paddingBottom: "9px",
                                marginBottom: "6px",
                              }),
                        }}
                        className="text-black text-justify"
                      >
                        {bullet}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
