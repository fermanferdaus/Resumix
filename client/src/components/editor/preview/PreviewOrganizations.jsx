export const PreviewOrganizations = ({
  organizations = [],
  title = "PENGALAMAN ORGANISASI",
  isLast = false,
}) => {
  if (!organizations || organizations.length === 0) return null;

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
        {title || "PENGALAMAN ORGANISASI"}
      </h2>
      <div className="space-y-2.5">
        {organizations.map((org, idx) => {
          if (!org) return null;

          const isItemLast = idx === organizations.length - 1;
          const shouldOmitBorder = isItemLast && isLast;

          const validBullets = Array.isArray(org.bullets) && org.bullets.length > 0
            ? org.bullets.filter((b) => b && typeof b === "string" && b.trim())
            : org.description?.trim()
            ? [org.description.trim()]
            : [];

          const hasBullets = validBullets.length > 0;

          const dateDisplay =
            org.period ||
            (org.startDate && org.endDate
              ? `${org.startDate} - ${org.endDate}`
              : org.startDate
              ? `${org.startDate} - Sekarang`
              : "");

          const nameAndRole = [org.role, org.name].filter(Boolean).join(" / ");

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
                {nameAndRole || "PENGALAMAN ORGANISASI"}
              </div>

              {dateDisplay && (
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
                  {dateDisplay}
                </div>
              )}

              {hasBullets && (
                <ul
                  className="list-disc pl-4 space-y-0.5"
                  style={{
                    fontSize: "10px",
                    lineHeight: 1.5,
                    ...(!shouldOmitBorder
                      ? {
                          borderBottom: "2px dotted #777",
                          paddingBottom: "9px",
                          marginBottom: "6px",
                        }
                      : {}),
                  }}
                >
                  {validBullets.map((bullet, bIdx) => (
                    <li key={bIdx} className="text-black text-justify pl-0.5">
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
