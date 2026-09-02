export const PreviewSummary = ({
  summary = "",
  title = "PROFIL",
  isLast = false,
}) => {
  if (!summary) return null;

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
        {title || "PROFIL"}
      </h2>
      <p
        style={{
          fontSize: "10px",
          lineHeight: 1.5,
          textAlign: "justify",
          ...(isLast
            ? {}
            : {
                borderBottom: "2px dotted #777",
                paddingBottom: "9px",
                marginBottom: "6px",
              }),
        }}
        className="text-black font-normal"
      >
        {summary}
      </p>
    </section>
  );
};
