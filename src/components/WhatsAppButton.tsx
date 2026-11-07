"use client";
import React from "react";

const WhatsAppButton = () => {
  const phone = "33669151216";
  const message = encodeURIComponent(
    "Bonjour Maître Salhi, je souhaite obtenir un devis / des informations pour une traduction assermentée arabe-français."
  );

  return (
    <aside aria-label="Assistance WhatsApp" className="fixed bottom-6 right-6 z-50">
      <a
        href={`https://wa.me/${phone}?text=${message}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Discuter sur WhatsApp"
        className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 hover:shadow-emerald-500/30 group"
        style={{ textDecoration: "none" }}
      >
        {/* WhatsApp Icon */}
        <div className="relative flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
            className="w-6 h-6 flex-shrink-0"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M16.004 2.667C8.638 2.667 2.667 8.637 2.667 16c0 2.333.63 4.63 1.826 6.638L2.667 29.333l6.898-1.804A13.3 13.3 0 0 0 16.004 29.333C23.37 29.333 29.333 23.363 29.333 16S23.37 2.667 16.004 2.667zm0 2.4c5.953 0 10.933 4.98 10.933 10.933s-4.98 10.933-10.933 10.933c-2.047 0-4.016-.575-5.717-1.635l-.408-.252-4.093 1.071 1.096-3.985-.27-.422A10.891 10.891 0 0 1 5.07 16c0-5.953 4.98-10.933 10.934-10.933zm-3.14 5.44c-.27 0-.713.102-1.085.508-.373.406-1.422 1.39-1.422 3.388s1.456 3.933 1.659 4.207c.203.272 2.845 4.344 6.892 5.919 3.408 1.333 4.102.871 4.838.816.738-.056 2.372-.969 2.71-1.904.337-.934.337-1.735.237-1.902-.101-.168-.372-.27-.776-.473-.406-.203-2.372-1.17-2.741-1.303-.372-.135-.642-.204-.911.202-.27.407-.609.734-.812.937-.203.203-.405.228-.811.025-.406-.203-1.715-.633-3.267-2.014-1.207-1.077-2.022-2.407-2.259-2.813-.237-.406-.025-.625.179-.828.182-.182.406-.473.608-.71.202-.237.27-.406.405-.675.135-.27.068-.508-.034-.711-.102-.204-.888-2.207-1.237-3.013-.321-.762-.654-.658-.911-.67l-.462-.01z" />
          </svg>
          {/* Online green indicator badge */}
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-300 border-2 border-white rounded-full animate-pulse" />
        </div>

        {/* Text Label */}
        <span className="text-sm font-semibold tracking-wide whitespace-nowrap">
          Discuter sur WhatsApp
        </span>
      </a>
    </aside>
  );
};

export default WhatsAppButton;
