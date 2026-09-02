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
        {organizations.map((org, idx) => {
          const dateDisplay =
            org.period ||
            (org.startDate && org.endDate
              ? `${org.startDate} – ${org.endDate}`
              : org.startDate
              ? `${org.startDate} – Sekarang`
              : "");

          return (
            <li key={idx} className="text-black text-justify pl-0.5">
              <span className="font-semibold">{org.role}</span>
              {org.name ? `, ${org.name}` : ""}
              {dateDisplay ? ` (${dateDisplay})` : ""}
              {org.description ? ` - ${org.description}` : ""}
            </li>
          );
        })}
      </ul>
    </section>
  );
};
