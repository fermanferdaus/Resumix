import { appConfig } from "../../config/appConfig.js";
import { Mail, ExternalLink, MessageSquare } from "lucide-react";

const GithubIcon = ({ className = "w-5 h-5" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const InstagramIcon = ({ className = "w-5 h-5" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export const ContactSection = () => {
  const { contact } = appConfig;

  const contactChannels = [
    {
      icon: Mail,
      label: "Email Dukungan & Masukan",
      identifier: contact.email,
      href: `mailto:${contact.email}`,
      cta: "Kirim Email",
      isExternal: false,
    },
    {
      icon: GithubIcon,
      label: "GitHub Repositori & Kontribusi",
      identifier: "github.com/fermanferdaus",
      href: contact.githubUrl,
      cta: "Kunjungi GitHub",
      isExternal: true,
    },
    {
      icon: InstagramIcon,
      label: "Instagram Pembaruan & Diskusi",
      identifier: "@fermanferdaus_",
      href: contact.instagramUrl,
      cta: "Buka Profil",
      isExternal: true,
    },
  ];

  return (
    <section id="kontak" className="py-20 border-b border-[#e2e8f0] bg-white">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8">
        {/* Section Heading */}
        <div className="max-w-3xl mb-12">
          <span className="text-xs font-mono-code text-[#af101a] uppercase font-bold tracking-wider block mb-2">
            HUBUNGI KAMI
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0f172a] tracking-tight">
            Saluran Kontak Pengembang
          </h2>
          <p className="text-sm sm:text-base text-[#5d5e61] mt-3 leading-relaxed">
            Punya masukan fitur, menemukan kendala, atau ingin berdiskusi seputar standar ATS? Terhubung langsung melalui saluran resmi di bawah.
          </p>
        </div>

        {/* Contact Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {contactChannels.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <div
                key={idx}
                className="bg-[#f8fafc] border border-[#e2e8f0] p-6 flex flex-col justify-between hover:border-[#1a1c1e] transition-all group"
              >
                <div>
                  <div className="w-10 h-10 bg-white border border-[#cbd5e1] flex items-center justify-center text-[#af101a] mb-4 group-hover:border-[#af101a] transition-colors">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-mono-code text-[#64748b] block mb-1">
                    {item.label}
                  </span>
                  <div className="text-sm font-bold text-[#0f172a] font-mono-code break-all">
                    {item.identifier}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#e2e8f0]">
                  <a
                    href={item.href}
                    target={item.isExternal ? "_blank" : undefined}
                    rel={item.isExternal ? "noopener noreferrer" : undefined}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#af101a] hover:text-[#1a1c1e] transition-colors"
                  >
                    <span>{item.cta}</span>
                    {item.isExternal ? (
                      <ExternalLink className="w-3.5 h-3.5" />
                    ) : (
                      <MessageSquare className="w-3.5 h-3.5" />
                    )}
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
