import { Link } from "react-router-dom";

export const Footer = ({ className = "" }) => {
  return (
    <footer className={`w-full bg-white border-t border-[#e2e8f0] py-6 px-4 sm:px-6 mt-12 rounded-none ${className}`}>
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center text-xs text-[#5d5e61] gap-4">
        {/* Brand & Version */}
        <div className="flex items-center gap-2 font-semibold text-[#1a1b22]">
          <img src="/logo.png" alt="Resumix" className="h-5 w-auto object-contain rounded-none" />
          <span>Resumix ATS Platform</span>
        </div>

        {/* Copyright */}
        <div>© 2026 Resumix. All rights reserved.</div>

        {/* Legal / Policy Links */}
        <div className="flex gap-4">
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
