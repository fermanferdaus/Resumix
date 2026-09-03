import { Link } from "react-router-dom";
import { Footer } from "./Footer.jsx";

export const AuthLayout = ({ title, subtitle, children, footerLink }) => {
  return (
    <div className="min-h-screen bg-[#fbf8ff] text-[#1a1b22] flex flex-col justify-between rounded-none">
      {/* Top spacing */}
      <div className="h-4 sm:h-8" />

      {/* Center Container */}
      <main className="w-full max-w-md mx-auto flex flex-col items-center px-4 sm:px-6">
        {/* Branding Header */}
        <div className="text-center mb-6 w-full flex flex-col items-center">
          <Link to="/" className="inline-block mb-3">
            <img
              src="/logo.png"
              alt="Resumix Logo"
              className="h-12 sm:h-14 w-auto object-contain mx-auto rounded-none"
            />
          </Link>

          {subtitle && (
            <p className="text-sm text-[#5d5e61] font-normal max-w-sm mx-auto leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {/* Central Soft Flat Card */}
        <div className="w-full bg-white border border-[#e2e8f0] p-6 sm:p-8 rounded-none">
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

      {/* Reusable Footer Component */}
      <Footer className="bg-transparent border-t border-[#e2e8f0]" />
    </div>
  );
};
