export const PreviewHeader = ({ header = {} }) => {
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

  return (
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
  );
};
