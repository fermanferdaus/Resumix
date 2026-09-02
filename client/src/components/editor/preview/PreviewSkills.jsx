export const PreviewSkills = ({
  skills = { hardSkills: [], softSkills: [] },
  title = "KEAHLIAN",
  isLast = false,
}) => {
  const hasHardSkills = skills?.hardSkills && skills.hardSkills.length > 0;
  const hasSoftSkills = skills?.softSkills && skills.softSkills.length > 0;
  if (!hasHardSkills && !hasSoftSkills) return null;

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
        {title || "KEAHLIAN"}
      </h2>

      {/* Hard Skill */}
      {hasHardSkills && (
        <div className={hasSoftSkills ? "mb-2" : ""}>
          {hasSoftSkills && (
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
            style={{
              fontSize: "10px",
              lineHeight: 1.5,
              ...(!hasSoftSkills && !isLast
                ? {
                    borderBottom: "2px dotted #777",
                    paddingBottom: "9px",
                    marginBottom: "6px",
                  }
                : {}),
            }}
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
                <li key={idx} className="text-black text-justify pl-0.5">
                  {category ? (
                    <>
                      <span className="font-semibold">{category}</span>
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
      {hasSoftSkills && (
        <div>
          {hasHardSkills && (
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
            style={{
              fontSize: "10px",
              lineHeight: 1.5,
              ...(isLast
                ? {}
                : {
                    borderBottom: "2px dotted #777",
                    paddingBottom: "9px",
                    marginBottom: "6px",
                  }),
            }}
          >
            {skills.softSkills.map((s, idx) => (
              <li key={idx} className="text-black text-justify pl-0.5">
                {typeof s === "string" ? s : s.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
};
