export const PreviewExperiences = ({
  experiences = [],
  title = "PENGALAMAN KERJA",
}) => {
  if (!experiences || experiences.length === 0) return null;

  return (
    <section className="mb-4">
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
  );
};
