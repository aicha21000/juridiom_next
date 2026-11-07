"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "../context/ThemeContext";
import { FaSun, FaMoon, FaUser } from "react-icons/fa";
import Image from "next/image";
import logo from "../assets/logo_trad.svg";
import Cookies from "js-cookie";

const Header = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const pathname = usePathname();
  const router = useRouter();

  // Utilisation du cookie auth_token au lieu de Firebase Auth
  // Firebase ne charge ainsi que sur les pages admin/dashboard/login
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const checkAuth = () => setIsLoggedIn(!!Cookies.get("auth_token"));
    checkAuth();
    // Vérifier à chaque changement de route
    const interval = setInterval(checkAuth, 2000);
    return () => clearInterval(interval);
  }, [pathname]);

  const handleLogout = async () => {
    // Import dynamique de Firebase Auth uniquement si l'utilisateur clique sur déconnexion
    const { signOut } = await import("firebase/auth");
    const { auth } = await import("../services/firebase");
    await signOut(auth);
    Cookies.remove("auth_token");
    setIsLoggedIn(false);
    router.push("/login");
  };

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

  const navLinks = ["Accueil", "Services", "À Propos", "Blog", "Contact", "Ma commande", "FAQ"];

  // Auth navigation removed

  const getPath = (link: string) => {
    switch (link) {
      case "Accueil":
        return "/";
      case "À Propos":
        return "/about";
      case "Ma commande":
        return "/panier";
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
        <div className="flex items-center gap-3">
          {/* Téléphone cliquable — Fix #4 */}
          <a
            href="tel:+33669151216"
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors shadow-sm"
            aria-label="Appeler Aicha Salhi"
          >
            📞 06 69 15 12 16
          </a>
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
            {/* Téléphone cliquable mobile — Fix #4 */}
            <li className="lg:hidden">
              <a
                href="tel:+33669151216"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors"
                onClick={closeMenu}
              >
                📞 06 69 15 12 16
              </a>
            </li>
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
            {isLoggedIn ? (
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
            ) : null}

            {/* Fix #7 - Dark Mode déplacé en fin de nav, discret */}
            <li className="hidden lg:block">
              <button
                onClick={toggleDarkMode}
                className={`${isDarkMode
                  ? "text-gray-500 hover:text-gray-300"
                  : "text-gray-400 hover:text-gray-600"
                  } transition-colors rounded-md px-2 py-1 text-sm`}
                aria-label={isDarkMode ? "Passer en mode clair" : "Passer en mode sombre"}
                title={isDarkMode ? "Mode clair" : "Mode sombre"}
              >
                {isDarkMode ? (
                  <FaSun className="text-yellow-400" />
                ) : (
                  <FaMoon className="text-gray-400" />
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
