export const PreviewExperiences = ({
  experiences = [],
  title = "PENGALAMAN KERJA",
  isLast = false,
}) => {
  if (!experiences || experiences.length === 0) return null;

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
        {title || "PENGALAMAN KERJA"}
      </h2>
      <div className="space-y-2.5">
        {experiences.map((exp, idx) => {
          const isItemLast = idx === experiences.length - 1;
          const shouldOmitBorder = isItemLast && isLast;
          const validBullets = (exp.bullets || []).filter(Boolean);
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
                {exp.startDate && exp.endDate
                  ? `${exp.startDate} - ${exp.endDate}`
                  : exp.startDate
                  ? `${exp.startDate} - Sekarang`
                  : exp.period || ""}
              </div>

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
