"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { FaSun, FaMoon, FaUser, FaSignInAlt } from "react-icons/fa";
import Image from "next/image";
import logo from "../assets/logo_trad.svg";

const Header = () => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const pathname = usePathname();
  const router = useRouter();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Ferme le menu si clic à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  // Ferme le menu avec Escape
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

  const navLinks = ["Accueil", "Services", "À Propos", "Blog", "Contact", "Panier", "FAQ"];

  // Auth navigation removed

  const getPath = (link: string) => {
    switch (link) {
      case "Accueil":
        return "/";
      case "À Propos":
        return "/about";
      default:
        return `/${link.toLowerCase().replace(/ /g, "-")}`;
    }
  };

  return (
    <header
      className={`w-full h-16 py-0 ${isDarkMode
        ? "bg-gray-900 border-b border-gray-800"
        : "backdrop-blur supports-[backdrop-filter]:bg-white/70 bg-white/70 border-b border-black/10"
        } fixed top-0 left-0 z-20`}
    >
      <div
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center ${isDarkMode ? "text-white" : "text-gray-800"
          }`}
      >
        <div className="flex items-center">
          <Link
            href="/"
            className="focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
            aria-label="traductionenarabe.fr - Accueil"
          >
            <Image
              src={logo}
              alt="traductionenarabe.fr"
              className="h-14 w-auto object-contain transition"
              width={150}
              height={56}
              style={{
                filter: isDarkMode
                  ? "invert(1) contrast(1.05) saturate(1.1)"
                  : "none",
              }}
            />
          </Link>
        </div>

        {/* Bouton mobile */}
        <div className="lg:hidden">
          <button
            ref={buttonRef}
            onClick={isMenuOpen ? closeMenu : toggleMenu}
            className={`text-2xl rounded-md px-2 py-1 ${isDarkMode ? "hover:bg-white/10" : "hover:bg-black/5"
              } focus:outline-none focus:ring-2 focus:ring-red-500`}
            aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={isMenuOpen}
            aria-controls="navigation-menu"
          >
            {isMenuOpen ? "✖" : "☰"}
          </button>
        </div>

        {/* Navigation */}
        <nav
          ref={menuRef}
          className={`lg:flex lg:block ${isMenuOpen ? "block" : "hidden"
            } ${isMenuOpen
              ? `${isDarkMode
                ? "absolute top-full left-0 w-full bg-gray-900"
                : "absolute top-full left-0 w-full bg-white/95 backdrop-blur"
              } ${isDarkMode
                ? "border-b border-gray-800"
                : "border-b border-black/10"
              } shadow-sm`
              : ""
            }`}
          id="navigation-menu"
          aria-label="Navigation principale"
        >
          <ul className="flex flex-col lg:flex-row space-y-3 lg:space-y-0 lg:space-x-6 px-6 py-4 lg:p-0">
            {navLinks.map((link, i) => {
              const href = getPath(link);
              const isActive = pathname === href;
              return (
                <li key={i}>
                  <Link
                    href={href}
                    className={
                      isActive
                        ? `${isDarkMode ? "text-red-400" : "text-red-700"
                        } font-semibold`
                        : `${isDarkMode
                          ? "text-gray-100 hover:text-red-400"
                          : "text-gray-800 hover:text-red-700"
                        } transition-colors`
                    }
                    aria-label={link === "Accueil" ? "Navigation vers l'accueil" : undefined}
                  >
                    {link}
                  </Link>
                </li>
              );
            })}

            {/* Auth buttons */}
            {user ? (
              <>
                <li>
                  <Link
                    href="/dashboard"
                    className={`flex items-center space-x-1 ${pathname === "/dashboard"
                      ? isDarkMode ? "text-red-400" : "text-red-700"
                      : isDarkMode
                        ? "text-gray-100 hover:text-red-400"
                        : "text-gray-800 hover:text-red-700"
                      } transition-colors`}
                  >
                    <FaUser />
                    <span>Mon Espace</span>
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className={`${isDarkMode
                      ? "text-gray-100 hover:text-red-400"
                      : "text-gray-800 hover:text-red-700"
                      } transition-colors`}
                  >
                    Déconnexion
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link
                  href="/login"
                  className={`flex items-center space-x-1 ${pathname === "/login"
                    ? isDarkMode ? "text-red-400" : "text-red-700"
                    : isDarkMode
                      ? "text-gray-100 hover:text-red-400"
                      : "text-gray-800 hover:text-red-700"
                    } transition-colors`}
                >
                  <FaSignInAlt />
                  <span>Connexion</span>
                </Link>
              </li>
            )}

            <li>
              <button
                onClick={toggleDarkMode}
                className={`${isDarkMode
                  ? "text-gray-100 hover:text-red-400 hover:bg-white/10"
                  : "text-gray-800 hover:text-red-700 hover:bg-black/5"
                  } transition-colors rounded-md px-2 py-1`}
                aria-label={isDarkMode ? "Passer en mode clair" : "Passer en mode sombre"}
              >
                {isDarkMode ? (
                  <FaSun className="inline-block mr-2 text-yellow-400" />
                ) : (
                  <FaMoon className="inline-block mr-2 text-blue-700" />
                )}
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
