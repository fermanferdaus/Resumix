import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore.js";
import { Button } from "../ui/button.jsx";
import { LogOut, User } from "lucide-react";

export const Navbar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const apiDocsUrl = `${import.meta.env.VITE_API_URL || ""}/docs`;

  return (
    <header className="w-full bg-white border-b border-[#e2e8f0] sticky top-0 z-50 rounded-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo & Navigation */}
        <div className="flex items-center gap-8">
          <Link to="/" className="text-2xl font-bold tracking-tight text-[#1a1b22] hover:text-[#af101a] transition-colors">
            Resumix
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm text-[#5d5e61] font-medium">
            <Link to="/dashboard" className="text-[#1a1b22] hover:text-[#af101a] transition-colors">
              Dashboard
            </Link>
            <a href="#" className="hover:text-[#af101a] transition-colors">
              Templates
            </a>
            {apiDocsUrl && (
              <a href={apiDocsUrl} target="_blank" rel="noreferrer" className="hover:text-[#af101a] transition-colors">
                API Docs
              </a>
            )}
          </nav>
        </div>

        {/* User profile & Logout */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-[#1a1b22] font-medium">
            <div className="w-8 h-8 rounded-none bg-[#fef2f2] border border-[#e2e8f0] flex items-center justify-center text-[#af101a] font-bold">
              {user?.fullName?.charAt(0) || <User className="w-4 h-4" />}
            </div>
            <span className="hidden sm:inline">{user?.fullName || user?.email}</span>
          </div>

          <Button variant="outline" size="sm" onClick={handleLogout} className="flex items-center gap-1.5 text-xs rounded-none">
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
};
