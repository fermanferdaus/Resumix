import { appConfig } from "../../config/appConfig.js";
import { Coffee, Mail } from "lucide-react";

const GithubIcon = ({ className = "w-3.5 h-3.5" }) => (
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

const InstagramIcon = ({ className = "w-3.5 h-3.5" }) => (
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

export const LandingFooter = () => {
  const { contact, saweriaUrl } = appConfig;

  return (
    <footer className="bg-white border-t border-[#e2e8f0] w-full py-8 text-[#5d5e61]">
      <div className="flex flex-col md:flex-row justify-between items-center px-4 sm:px-8 w-full max-w-screen-2xl mx-auto gap-6 text-xs">
        {/* Brand & Copyright */}
        <div className="flex items-center gap-2.5">
          <img src="/logo.png" alt="Resumix Logo" className="w-auto h-5 object-contain" />
          <span className="text-[#94a3b8]">|</span>
          <span>CV ATS Builder © 2026. All rights reserved.</span>
        </div>

        {/* Section Anchors */}
        <div className="flex flex-wrap items-center justify-center gap-6 font-medium">
          <a
            href="#template-showcase"
            className="hover:text-[#af101a] transition-colors"
          >
            Template Standar
          </a>
          <a
            href="#keunggulan"
            className="hover:text-[#af101a] transition-colors"
          >
            Fitur
          </a>
          <a
            href="#faq"
            className="hover:text-[#af101a] transition-colors"
          >
            FAQ
          </a>
          <a
            href="#kontak"
            className="hover:text-[#af101a] transition-colors"
          >
            Kontak
          </a>
          <a
            href={saweriaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[#854d0e] hover:text-[#af101a] transition-colors font-semibold"
          >
            <Coffee className="w-3.5 h-3.5 text-[#eab308]" />
            <span>Traktir Kopi</span>
          </a>
        </div>

        {/* Social / Contact Icons */}
        <div className="flex items-center gap-3">
          <a
            href={`mailto:${contact.email}`}
            title={`Email: ${contact.email}`}
            className="w-8 h-8 bg-[#f8fafc] border border-[#cbd5e1] hover:border-[#af101a] hover:text-[#af101a] flex items-center justify-center transition-colors"
          >
            <Mail className="w-3.5 h-3.5" />
          </a>
          <a
            href={contact.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="GitHub: fermanferdaus"
            className="w-8 h-8 bg-[#f8fafc] border border-[#cbd5e1] hover:border-[#af101a] hover:text-[#af101a] flex items-center justify-center transition-colors"
          >
            <GithubIcon className="w-3.5 h-3.5" />
          </a>
          <a
            href={contact.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Instagram: @fermanferdaus_"
            className="w-8 h-8 bg-[#f8fafc] border border-[#cbd5e1] hover:border-[#af101a] hover:text-[#af101a] flex items-center justify-center transition-colors"
          >
            <InstagramIcon className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </footer>
  );
};
