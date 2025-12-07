import React from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Settings, Menu, LogIn, UserPlus } from "lucide-react";

const Navbar = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();

  const handleSignIn = () => {
    navigate("/signin");
  };

  const handleSignUp = () => {
    navigate("/register");
  };

  return (
    <nav className="border-b border-[#BCC8BC] sticky top-0 z-40 backdrop-blur-sm bg-white/95">
      <div className="px-4 lg:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Menu className="w-4 h-4 text-[#2f362f]" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Sign In Button */}
          <button
            onClick={handleSignIn}
            className="px-2.5 py-2 text-sm font-semibold bg-blue-200 text-[#2f362f] rounded-md hover:opacity-90 transition-colors flex items-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span className="hidden sm:inline">Sign In</span>
          </button>

          {/* Sign Up Button */}
          <button
            onClick={handleSignUp}
            className="px-2.5 py-2 text-sm font-semibold bg-blue-200 text-[#2f362f] rounded-md hover:opacity-90 transition-all shadow-md flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            <span className="hidden sm:inline">Sign Up</span>
          </button>

          {/* Notification Bell */}
          <button className="relative p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
            <Bell className="w-4 h-4 text-[#2f362f]" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Settings */}
          <button className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
            <Settings className="w-4 h-4 text-[#2f362f]" />
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-3 pl-3 border-l border-[#BCC8BC]">
            <div className="hidden md:block text-right">
              <p className="text-sm font-semibold text-[#2f362f]">
                Waleed Shahid
              </p>
              <p className="text-xs text-[#2f362f]">Administrator</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#2f362f] flex items-center justify-center text-white font-semibold shadow-lg">
              W
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
