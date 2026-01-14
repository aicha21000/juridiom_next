"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import {
  FaSun, FaMoon, FaBars, FaTimes,
  FaHome, FaCog, FaFileAlt, FaPhone, FaQuestion, FaShoppingCart,
  FaUser, FaSignInAlt, FaSignOutAlt
} from "react-icons/fa";
import logo from "../assets/logo_trad.svg";

const MobileHeader = () => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);
  const toggleMenu = () => setIsMenuOpen(prev => !prev);

  // Échap + scroll lock
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isMenuOpen) closeMenu();
    };

    if (isMenuOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  const navItems = [
    { name: "Accueil", path: "/", icon: FaHome },
    { name: "Services", path: "/services", icon: FaCog },
    { name: "À Propos", path: "/about", icon: FaPhone }, // Using FaPhone as placeholder or FaUser replacement if generic
    { name: "Blog", path: "/blog", icon: FaFileAlt },
    { name: "Contact", path: "/contact", icon: FaPhone },
    { name: "FAQ", path: "/faq", icon: FaQuestion },
    { name: "Panier", path: "/panier", icon: FaShoppingCart },
  ];

  return (
    <>
      {/* Header Mobile */}
      <header
        className={`mobile-header fixed top-0 left-0 right-0 z-60 transition-all duration-300 ${isDarkMode
          ? "bg-gray-900/98 border-b border-gray-800/50"
          : "bg-white/98 border-b border-gray-200/50"
          } py-2 shadow-lg`}
      >
        <div className="flex items-center justify-between px-6">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-lg"
            onClick={closeMenu}
          >
            <img
              src={logo.src}
              alt="traductionenarabe.fr"
              className="h-6 w-auto object-contain transition-all duration-300"
              style={{
                filter: isDarkMode ? "invert(1) contrast(1.05) saturate(1.1)" : "none",
              }}
            />
            <span
              className={`font-bold text-base ${isDarkMode ? "text-white" : "text-gray-900"}`}
            >
              Traduction
            </span>
          </Link>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            {/* Thème */}
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full transition-all duration-300 hover:scale-110 ${isDarkMode ? "text-yellow-400 hover:bg-yellow-400/10" : "text-blue-600 hover:bg-blue-100"
                }`}
              aria-label={isDarkMode ? "Mode clair" : "Mode sombre"}
            >
              {isDarkMode ? <FaSun className="w-5 h-5" /> : <FaMoon className="w-5 h-5" />}
            </button>

            {/* Bouton fermer le menu - visible seulement quand le menu est ouvert */}
            {isMenuOpen && (
              <button
                onClick={closeMenu}
                className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600"
                aria-label="Fermer le menu"
              >
                ✕
              </button>
            )}

            {/* Menu (header) */}
            <button
              onClick={isMenuOpen ? closeMenu : toggleMenu}
              className={`p-2 rounded-full transition-all duration-300 ${isDarkMode ? "text-white hover:bg-white/10" : "text-gray-800 hover:bg-gray-100"
                }`}
              aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-drawer"
            >
              {isMenuOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* --- LAYERS TOUJOURS MONTÉS --- */}

      {/* Overlay plein écran (au-dessus du header) */}
      <div
        className={`fixed inset-0 transition-opacity duration-300 ${isMenuOpen ? "opacity-100 pointer-events-auto z-[70]" : "opacity-0 pointer-events-none z-[10]"
          } bg-black/30`}
        onClick={closeMenu}
        aria-hidden={!isMenuOpen}
      />

      {/* Panneau latéral (au-dessus de l'overlay) */}
      <aside
        id="mobile-drawer"
        role="dialog"
        aria-modal="true"
        aria-hidden={!isMenuOpen}
        className={`mobile-menu fixed top-20 right-0 h-[calc(100vh-5rem)] w-80 max-w-[85vw]
          transform transition-transform duration-300 ease-in-out
          ${isMenuOpen ? "translate-x-0 z-[80]" : "translate-x-full z-[80]"}
          ${isDarkMode ? "bg-gray-900" : "bg-white"} shadow-2xl`}
        // Empêche que le mousedown se propage à l'overlay / header
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* En-tête du menu */}
        <div className={`p-4 border-b ${isDarkMode ? "border-gray-800" : "border-gray-200"}`}>
          <div className="flex items-center justify-center">
            <h2 className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>Menu</h2>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 max-h-[calc(100vh-12rem)]">
          <ul className="space-y-1 px-4">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <li key={index}>
                  <Link
                    href={item.path}
                    onClick={closeMenu}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${pathname === item.path
                      ? `${isDarkMode ? "bg-red-500/20 text-red-400" : "bg-red-100 text-red-600"}`
                      : `${isDarkMode ? "text-gray-300 hover:text-white hover:bg-white/10" : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"}`
                      }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Auth Section */}
          <div className={`mt-4 pt-4 px-4 border-t ${isDarkMode ? "border-gray-800" : "border-gray-200"}`}>
            {user ? (
              <div className="space-y-1">
                <Link
                  href="/dashboard"
                  onClick={closeMenu}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${pathname === "/dashboard"
                    ? `${isDarkMode ? "bg-red-500/20 text-red-400" : "bg-red-100 text-red-600"}`
                    : `${isDarkMode ? "text-gray-300 hover:text-white hover:bg-white/10" : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"}`
                    }`}
                >
                  <FaUser className="w-5 h-5" />
                  <span className="font-medium">Mon Espace</span>
                </Link>
                <button
                  onClick={async () => {
                    await logout();
                    closeMenu();
                    router.push("/login");
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${isDarkMode ? "text-gray-300 hover:text-white hover:bg-white/10" : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                >
                  <FaSignOutAlt className="w-5 h-5" />
                  <span className="font-medium">Déconnexion</span>
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={closeMenu}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${pathname === "/login"
                  ? `${isDarkMode ? "bg-red-500/20 text-red-400" : "bg-red-100 text-red-600"}`
                  : `${isDarkMode ? "text-gray-300 hover:text-white hover:bg-white/10" : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"}`
                  }`}
              >
                <FaSignInAlt className="w-5 h-5" />
                <span className="font-medium">Connexion</span>
              </Link>
            )}
          </div>
        </nav>

        {/* Bouton fermer le menu - EN DEHORS de la navigation */}
        <div className={`px-4 pb-4 border-t ${isDarkMode ? "border-gray-800" : "border-gray-200"}`}>
          <button
            onClick={closeMenu}
            className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${isDarkMode
              ? "text-gray-300 hover:text-red-400 hover:bg-red-400/10 border border-gray-700"
              : "text-gray-700 hover:text-red-600 hover:bg-red-100 border border-gray-300"
              }`}
            aria-label="Fermer le menu"
          >
            <FaTimes className="w-4 h-4" />
            <span>Fermer le menu</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default MobileHeader;
