import { Coffee } from "lucide-react";

export const LandingFooter = () => {
  return (
    <footer className="bg-white border-t border-[#e2e8f0] w-full py-8 text-[#5d5e61]">
      <div className="flex flex-col sm:flex-row justify-between items-center px-4 sm:px-8 w-full max-w-screen-2xl mx-auto gap-4 text-xs">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Resumix Logo" className="w-auto h-5 object-contain" />
          <span className="font-bold ">CV ATS Builder</span>
          <span>© 2026. All rights reserved.</span>
        </div>

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
            href="https://saweria.co/fermanferdaus"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[#854d0e] hover:text-[#af101a] transition-colors font-semibold"
          >
            <Coffee className="w-3.5 h-3.5 text-[#eab308]" />
            <span>Traktir Kopi</span>
          </a>
        </div>
      </div>
    </footer>
  );
};

