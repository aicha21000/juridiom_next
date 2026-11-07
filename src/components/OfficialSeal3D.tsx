"use client";
import React, { useState, useRef } from "react";
import Image, { StaticImageData } from "next/image";
import defaultSealImg from "../assets/sceau_officiel_3d.jpg";

interface OfficialSeal3DProps {
  imageSrc?: string | StaticImageData;
}

const OfficialSeal3D: React.FC<OfficialSeal3DProps> = ({ imageSrc = defaultSealImg }) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isStamped, setIsStamped] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate rotation (-18 to +18 deg)
    const rotateX = ((y - centerY) / centerY) * -16;
    const rotateY = ((x - centerX) / centerX) * 16;

    // Calculate glare position in percent
    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setRotate({ x: rotateX, y: rotateY });
    setGlare({ x: glareX, y: glareY, opacity: 0.55 });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotate({ x: 0, y: 0 });
    setGlare({ x: 50, y: 50, opacity: 0 });
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card || e.touches.length === 0) return;

    const rect = card.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -14;
    const rotateY = ((x - centerX) / centerX) * 14;

    setRotate({ x: rotateX, y: rotateY });
    setGlare({ x: (x / rect.width) * 100, y: (y / rect.height) * 100, opacity: 0.5 });
  };

  const handleClick = () => {
    setIsStamped(true);
    setTimeout(() => setIsStamped(false), 700);
  };

  return (
    <div className="flex flex-col items-center justify-center select-none py-4">
      {/* 3D Perspective Container */}
      <div
        className="relative w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80 perspective-1000 cursor-pointer"
        style={{ perspective: "1000px" }}
      >
        {/* Tilting Card Element */}
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseLeave}
          onClick={handleClick}
          style={{
            transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) ${
              isStamped ? "scale3d(0.95, 0.95, 0.95)" : isHovered ? "scale3d(1.05, 1.05, 1.05)" : "scale3d(1, 1, 1)"
            }`,
            transition: isHovered && !isStamped ? "transform 0.08s ease-out" : "transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)",
            transformStyle: "preserve-3d",
          }}
          className="w-full h-full rounded-full relative flex items-center justify-center p-3"
        >
          {/* Dynamic 3D Drop Shadow that shifts opposite to the tilt */}
          <div
            className="absolute inset-0 rounded-full pointer-events-none transition-all duration-200"
            style={{
              boxShadow: `${-rotate.y * 1.5}px ${rotate.x * 1.5 + 20}px 35px -5px rgba(185, 28, 28, 0.4), 0 20px 25px -5px rgba(0, 0, 0, 0.3)`,
              transform: "translateZ(-20px)",
            }}
          />

          {/* Sceau Visuel 3D Principal */}
          <div
            className="relative w-full h-full rounded-full overflow-hidden flex items-center justify-center border-4 border-amber-400/40 shadow-inner"
            style={{
              transform: "translateZ(30px)",
              transformStyle: "preserve-3d",
            }}
          >
            <Image
              src={imageSrc}
              alt="Sceau officiel 3D de Traductrice Assermentée"
              fill
              className="object-cover drop-shadow-2xl transition-transform duration-300"
              sizes="(max-width: 768px) 280px, 320px"
              priority
            />

            {/* Dynamic Interactive Glare / Specular Reflection overlay */}
            <div
              className="absolute inset-0 rounded-full pointer-events-none transition-opacity duration-300"
              style={{
                background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255, 255, 255, 0.55) 0%, rgba(255, 255, 255, 0.15) 30%, transparent 60%)`,
                opacity: glare.opacity,
                transform: "translateZ(50px)",
              }}
            />
          </div>

          {/* Floating 3D Badge (Layered Depth) */}
          <div
            className="absolute -bottom-3 px-3.5 py-1 rounded-full bg-gradient-to-r from-red-700 via-red-800 to-amber-700 text-white text-[11px] font-extrabold tracking-wider uppercase border border-amber-400/50 shadow-xl pointer-events-none whitespace-nowrap"
            style={{
              transform: `translateZ(65px) translateY(${rotate.x * 0.4}px) translateX(${rotate.y * -0.4}px)`,
              transition: "transform 0.1s ease-out",
            }}
          >
            ⚖️ Sceau Officiel • Cour d&apos;Appel
          </div>
        </div>
      </div>

      {/* Interactive Helper Caption */}
      <div className="mt-6 text-center max-w-xs">
        <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center justify-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-ping" />
          <span>Survolez ou inclinez le sceau pour observer les reliefs en 3D</span>
        </p>
        <p className="text-[11px] opacity-60 mt-0.5">
          Apposé avec signature officielle et mention légale &ldquo;Ne Varietur&rdquo;
        </p>
      </div>
    </div>
  );
};

export default OfficialSeal3D;
