export const PreviewSummary = ({ summary = "", title = "PROFIL" }) => {
  if (!summary) return null;

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
        {title || "PROFIL"}
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
  );
};
