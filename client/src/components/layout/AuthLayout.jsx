import { Link } from "react-router-dom";

export const AuthLayout = ({ title, subtitle, children, footerLink }) => {
  return (
    <div className="min-h-screen bg-[#fbf8ff] text-[#1a1b22] flex flex-col justify-between p-4 sm:p-6">
      {/* Top spacing */}
      <div className="h-4 sm:h-8" />

      {/* Center Container */}
      <main className="w-full max-w-md mx-auto flex flex-col items-center">
        {/* Branding Header with Logo Image */}
        <div className="text-center mb-8 w-full flex flex-col items-center">
          <Link to="/" className="inline-block mb-3">
            <img
              src="/logo.png"
              alt="Resumix Logo"
              className="h-12 sm:h-14 w-auto object-contain mx-auto"
            />
          </Link>
          {subtitle && (
            <p className="text-sm text-[#5d5e61] font-normal max-w-sm mx-auto leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {/* Central Flat Card */}
        <div className="w-full bg-white border border-[#e2e8f0] p-6 sm:p-8">
          {title && (
            <h2 className="text-xl font-bold text-[#0f172a] mb-6 text-center tracking-tight">
              {title}
            </h2>
          )}
          {children}
        </div>

        {/* Bottom Link (Login/Register toggle) */}
        {footerLink && <div className="mt-6 text-center text-sm text-[#5d5e61]">{footerLink}</div>}
      </main>

      {/* Footer */}
      <footer className="w-full max-w-screen-xl mx-auto py-6 border-t border-[#e2e8f0] mt-12 flex flex-col sm:flex-row justify-between items-center text-xs text-[#5d5e61] gap-4">
        <div className="font-semibold text-[#1a1b22]">Resumix ATS CV Builder</div>
        <div>© 2026 Resumix. All rights reserved.</div>
        <div className="flex gap-4">
          <a href="#" className="hover:underline hover:text-[#1a1b22]">
            Privacy Policy
          </a>
          <a href="#" className="hover:underline hover:text-[#1a1b22]">
            Terms & Conditions
          </a>
        </div>
      </footer>
    </div>
  );
};
