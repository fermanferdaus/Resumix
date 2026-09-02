export const PreviewCertifications = ({
  certifications = [],
  title = "SERTIFIKAT DAN PRESTASI",
  isLast = false,
}) => {
  if (!certifications || certifications.length === 0) return null;

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
        {title || "SERTIFIKAT DAN PRESTASI"}
      </h2>
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
        {certifications.map((cert, idx) => {
          if (!cert) return null;
          const isObj = typeof cert === "object" && cert !== null;
          const name = isObj ? cert.name : cert;
          const issuer = isObj ? cert.issuer : "";
          const year = isObj ? cert.year || cert.date : "";
          const credentialId = isObj
            ? cert.credentialId || cert.number || cert.certificateNumber
            : "";

          if (!name && !issuer && !year && !credentialId) return null;

          const parts = [];
          if (name) parts.push(name);
          if (issuer) parts.push(issuer);
          if (credentialId && String(credentialId).trim()) {
            const trimmed = String(credentialId).trim();
            const formattedId = /^(no|id|credential|nomor)/i.test(trimmed)
              ? trimmed
              : `No. ${trimmed}`;
            parts.push(formattedId);
          }
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
  );
};
