import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ListTodo, PieChart, Moon, Sun, User, Settings, LogOut, ChevronDown, UserPlus, Menu, X } from 'lucide-react';
import { useAppContext } from '../App';

export default function Navbar() {
  const { darkMode, setDarkMode, userProfile, handleLogout } = useAppContext();
  const location = useLocation();
  
  // State for Dropdowns & Menus
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const dropdownRef = useRef(null);

  // Close Profile Dropdown on Click Outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  // Close Mobile Menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Home', path: '/', icon: <LayoutDashboard size={18} /> },
    { name: 'ToDo', path: '/todo', icon: <ListTodo size={18} /> },
    { name: 'Progress', path: '/progress', icon: <PieChart size={18} /> },
    { name: 'Assign', path: '/assign', icon: <UserPlus size={18} /> },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-sm border-b border-gray-100 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          
          {/* --- LEFT SECTION: LOGO & HAMBURGER --- */}
          <div className="flex items-center gap-4">
            
            {/* Mobile Hamburger Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 -ml-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden focus:outline-none transition-colors"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Logo */}
            <Link to="/" className="flex flex-col items-center leading-none group">
              <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter drop-shadow-sm group-hover:scale-105 transition-transform">
                ViP
              </span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Todo
              </span>
            </Link>
          </div>
          
          {/* --- CENTER SECTION: DESKTOP NAV (Hidden on Mobile) --- */}
          <div className="hidden md:flex md:space-x-1 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  location.pathname === link.path
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-700/50'
                }`}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
          </div>

          {/* --- RIGHT SECTION: THEME & PROFILE --- */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-yellow-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shadow-sm"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 focus:outline-none hover:bg-slate-50 dark:hover:bg-slate-800 p-1 pr-2 rounded-full transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
              >
                <div className="h-9 w-9 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-sm ring-2 ring-transparent group-hover:ring-blue-500 transition-all">
                   {userProfile.avatar}
                </div>
                <ChevronDown size={16} className={`text-slate-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl py-2 border border-slate-100 dark:border-slate-800 ring-1 ring-black ring-opacity-5 z-[60] animate-in slide-in-from-top-2 origin-top-right">
                  <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{userProfile.name}</p>
                    <p className="text-xs text-slate-500 truncate font-medium">{userProfile.designation}</p>
                  </div>
                  
                  <div className="p-2 space-y-1">
                    <Link 
                      to="/profile?section=profile" 
                      onClick={() => setIsDropdownOpen(false)} 
                      className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-xl transition-colors group"
                    >
                      <User size={18} className="text-slate-400 group-hover:text-blue-600 transition-colors"/> 
                      <span className="font-bold">My Profile</span>
                    </Link>
                    
                    <Link 
                      to="/profile?section=settings" 
                      onClick={() => setIsDropdownOpen(false)} 
                      className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-slate-800 rounded-xl transition-colors group"
                    >
                      <Settings size={18} className="text-slate-400 group-hover:text-purple-600 transition-colors"/> 
                      <span className="font-bold">Settings</span>
                    </Link>
                  </div>
                  
                  <div className="border-t border-slate-100 dark:border-slate-800 mt-2 p-2">
                    <Link 
                      to="/profile?section=logout" 
                      onClick={() => setIsDropdownOpen(false)} 
                      className="w-full text-left flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 font-bold rounded-xl transition-colors"
                    >
                      <LogOut size={18}/> Log Out
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* --- MOBILE MENU (Slide Down) --- */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 animate-in slide-in-from-top-5 shadow-lg absolute w-full z-40">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center gap-3 px-4 py-4 rounded-xl text-base font-bold transition-all ${
                  location.pathname === link.path
                    ? 'bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}