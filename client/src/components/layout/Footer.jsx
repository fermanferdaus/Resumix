import { Link } from "react-router-dom";
import { appConfig } from "../../config/appConfig.js";

export const Footer = ({ className = "" }) => {
  return (
    <footer className={`w-full bg-white border-t border-[#e2e8f0] py-4 px-4 sm:px-6 mt-auto rounded-none ${className}`}>
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center text-xs text-[#5d5e61] gap-4">
        {/* Brand & Version */}
        <div className="flex items-center gap-2 font-semibold text-[#1a1b22]">
          <img src="/logo.png" alt="Resumix" className="h-5 w-auto object-contain rounded-none" />
          <span>CV ATS Builder</span>
        </div>

        {/* Copyright */}
        <div>© 2026 Resumix. All rights reserved.</div>

        {/* Legal & Support Links */}
        <div className="flex items-center gap-4">
          <a
            href={appConfig.saweriaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline hover:text-[#ca8a04] text-[#854d0e] font-medium transition-colors"
          >
            ☕ Traktir Kopi
          </a>
          <a
            href={`mailto:${appConfig.feedbackEmail}?subject=Feedback%20Resumix%20ATS%20Builder`}
            className="hover:underline hover:text-[#0f172a] text-[#5d5e61] transition-colors"
          >
            Kirim Feedback
          </a>
          <Link to="#" className="hover:underline hover:text-[#af101a] transition-colors">
            Privasi
          </Link>
          <Link to="#" className="hover:underline hover:text-[#af101a] transition-colors">
            Syarat & Ketentuan
          </Link>
        </div>
      </div>
    </footer>
  );
};
