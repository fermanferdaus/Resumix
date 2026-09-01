import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore.js";
import { Button } from "../ui/button.jsx";
import { LogOut, User, Coffee } from "lucide-react";
import { appConfig } from "../../config/appConfig.js";

export const Navbar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const isDashboard = location.pathname.startsWith("/dashboard");
  const isTemplateOrEditor =
    location.pathname.startsWith("/editor") || location.pathname.startsWith("/templates");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="w-full bg-white border-b border-[#e2e8f0] fixed top-0 left-0 right-0 z-50 rounded-none print:hidden h-16">
      <div className="w-full mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Left: Logo & Navigation */}
        <div className="flex items-center gap-8 h-full">
          <Link to="/dashboard" className="flex items-center gap-2.5">
            <img
              src="/logo.png"
              alt="Resumix Logo"
              className="h-8 w-auto object-contain rounded-none"
            />
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium h-full">
            <Link
              to="/dashboard"
              className={`h-full flex items-center pt-[2px] transition-colors ${
                isDashboard
                  ? "border-b-2 border-[#af101a] text-[#af101a] font-semibold"
                  : "text-[#5d5e61] hover:text-[#1a1b22]"
              }`}
            >
              Dashboard
            </Link>

            <Link
              to="/dashboard"
              className={`h-full flex items-center pt-[2px] transition-colors ${
                isTemplateOrEditor
                  ? "border-b-2 border-[#af101a] text-[#af101a] font-semibold"
                  : "text-[#5d5e61] hover:text-[#1a1b22]"
              }`}
            >
              Editor
            </Link>

            <span
              className="h-full flex items-center text-[#5d5e61] cursor-not-allowed opacity-60 hover:text-[#1a1b22] transition-colors"
              title="Manajemen profil akan hadir di tahap berikutnya"
            >
              Profil
            </span>
          </nav>
        </div>

        {/* Right: Traktir Kopi, User Profile & Logout */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Tombol Traktir Kopi Saweria */}
          <a
            href={appConfig.saweriaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-[#faad14] hover:bg-[#d48806] text-[#1a1b22] font-semibold text-xs transition-colors rounded-none border border-[#d48806] cursor-pointer"
            title="Dukung Resumix / Traktir Kopi via Saweria"
          >
            <Coffee className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="hidden sm:inline">Traktir Kopi</span>
            <span className="sm:hidden">Kopi</span>
          </a>

          <div className="flex items-center gap-2 text-sm text-[#1a1b22] font-medium">
            <div className="w-8 h-8 rounded-none bg-[#fef2f2] border border-[#fecaca] flex items-center justify-center text-[#af101a] font-bold">
              {user?.fullName?.charAt(0)?.toUpperCase() || <User className="w-4 h-4" />}
            </div>
            <span className="hidden sm:inline font-semibold">{user?.fullName || user?.email}</span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs rounded-none"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar</span>
          </Button>
        </div>
      </div>
    </header>
  );
};
