"use client";
import React, { useState } from "react";

const WhatsAppButton = () => {
  const [hovered, setHovered] = useState(false);
  const phone = "33669151216";
  const message = encodeURIComponent(
    "Bonjour, je souhaite obtenir un devis pour une traduction assermentée arabe-français."
  );

  return (
    <a
      href={`https://wa.me/${phone}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contacter sur WhatsApp"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 group"
      style={{ textDecoration: "none" }}
    >
      {/* Bulle de texte */}
      <span
        className={`
          hidden sm:block bg-white text-gray-800 text-sm font-semibold px-4 py-2 rounded-full shadow-lg
          border border-gray-100 whitespace-nowrap
          transition-all duration-300
          ${hovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4 pointer-events-none"}
        `}
      >
        💬 Besoin d&apos;un devis rapide ?
      </span>

      {/* Bouton WhatsApp */}
      <div
        className={`
          w-14 h-14 rounded-full flex items-center justify-center shadow-xl
          transition-all duration-300
          ${hovered ? "scale-110" : "scale-100"}
          bg-[#25D366] hover:bg-[#20BA5A]
        `}
      >
        {/* WhatsApp SVG icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          className="w-8 h-8"
          fill="white"
        >
          <path d="M16.004 2.667C8.638 2.667 2.667 8.637 2.667 16c0 2.333.63 4.63 1.826 6.638L2.667 29.333l6.898-1.804A13.3 13.3 0 0 0 16.004 29.333C23.37 29.333 29.333 23.363 29.333 16S23.37 2.667 16.004 2.667zm0 2.4c5.953 0 10.933 4.98 10.933 10.933s-4.98 10.933-10.933 10.933c-2.047 0-4.016-.575-5.717-1.635l-.408-.252-4.093 1.071 1.096-3.985-.27-.422A10.891 10.891 0 0 1 5.07 16c0-5.953 4.98-10.933 10.934-10.933zm-3.14 5.44c-.27 0-.713.102-1.085.508-.373.406-1.422 1.39-1.422 3.388s1.456 3.933 1.659 4.207c.203.272 2.845 4.344 6.892 5.919 3.408 1.333 4.102.871 4.838.816.738-.056 2.372-.969 2.71-1.904.337-.934.337-1.735.237-1.902-.101-.168-.372-.27-.776-.473-.406-.203-2.372-1.17-2.741-1.303-.372-.135-.642-.204-.911.202-.27.407-.609.734-.812.937-.203.203-.405.228-.811.025-.406-.203-1.715-.633-3.267-2.014-1.207-1.077-2.022-2.407-2.259-2.813-.237-.406-.025-.625.179-.828.182-.182.406-.473.608-.71.202-.237.27-.406.405-.675.135-.27.068-.508-.034-.711-.102-.204-.888-2.207-1.237-3.013-.321-.762-.654-.658-.911-.67l-.462-.01z" />
        </svg>
      </div>

      {/* Pulse animation */}
      <span
        className="absolute right-0 bottom-0 w-14 h-14 rounded-full bg-[#25D366] opacity-30 animate-ping"
        aria-hidden="true"
      />
    </a>
  );
};

export default WhatsAppButton;
