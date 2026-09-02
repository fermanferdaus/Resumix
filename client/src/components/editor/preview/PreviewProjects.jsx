export const PreviewProjects = ({
  projects = [],
  title = "PROYEK",
  isLast = false,
}) => {
  if (!projects || projects.length === 0) return null;

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
        {title || "PROYEK"}
      </h2>
      <div className="space-y-2.5">
        {projects.map((proj, idx) => {
          if (!proj) return null;

          const isItemLast = idx === projects.length - 1;
          const shouldOmitBorder = isItemLast && isLast;

          const nameAndRole = [proj.name, proj.role].filter(Boolean).join(" / ");
          const validBullets = Array.isArray(proj.bullets)
            ? proj.bullets.filter((b) => b && b.trim())
            : [];

          const dateDisplay =
            proj.startDate && proj.endDate
              ? `${proj.startDate} - ${proj.endDate}`
              : proj.startDate
              ? `${proj.startDate} - Sekarang`
              : proj.period || "";

          const metaParts = [
            dateDisplay,
            proj.technologies ? `Teknologi: ${proj.technologies}` : "",
          ].filter(Boolean);

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
                {nameAndRole || "NAMA PROYEK"}
                {proj.link && (
                  <span className="font-normal lowercase ml-1.5 text-black">
                    ({proj.link})
                  </span>
                )}
              </div>

              {metaParts.length > 0 && (
                <div
                  style={{
                    fontSize: "10px",
                    lineHeight: 1.4,
                    ...(!hasBullets && !shouldOmitBorder
                      ? {
                          borderBottom: "2px dotted #777",
                          paddingBottom: "9px",
                          marginBottom: "6px",
                        }
                      : {}),
                  }}
                  className="text-black mb-1"
                >
                  {metaParts.join(" | ")}
                </div>
              )}

              {hasBullets && (
                <ul
                  className="list-disc pl-4 space-y-0.5"
                  style={{
                    fontSize: "10px",
                    lineHeight: 1.5,
                    ...(shouldOmitBorder
                      ? {}
                      : {
                          borderBottom: "2px dotted #777",
                          paddingBottom: "9px",
                          marginBottom: "6px",
                        }),
                  }}
                >
                  {validBullets.map((bullet, bIdx) => (
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
          );
        })}
      </div>
    </section>
  );
};
