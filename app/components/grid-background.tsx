"use client";

import { usePathname } from "next/navigation";
import { useBasket } from "../lib/store/basket-context";

/* Route-aware ambient background:
   - Landing view (paper design): fixed paper layer so no gap ever shows
     dark space.
   - Swipe Deck view: layered cyber aurora. Motion is transform-only and
     disabled via prefers-reduced-motion (.bg-blob). */
export function GridBackground() {
  const pathname = usePathname();
  const { activeTab } = useBasket();
  const paper = pathname === "/" && activeTab === "landing";

  if (paper) {
    return (
      <div
        className="paper-texture pointer-events-none fixed inset-0 z-0 overflow-hidden"
        aria-hidden="true"
      />
    );
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {/* Ambient Cyber Nebulae */}
      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{
          background: [
            "radial-gradient(ellipse 60% 40% at 50% -10%, rgba(0, 255, 136, 0.18) 0%, transparent 70%)",
            "radial-gradient(ellipse 50% 35% at 85% 25%, rgba(0, 240, 255, 0.14) 0%, transparent 60%)",
            "radial-gradient(ellipse 45% 40% at 15% 75%, rgba(255, 27, 107, 0.10) 0%, transparent 60%)",
            "radial-gradient(ellipse 55% 40% at 70% 80%, rgba(168, 85, 247, 0.09) 0%, transparent 60%)",
            "radial-gradient(ellipse 60% 30% at 50% 100%, rgba(0, 240, 255, 0.12) 0%, transparent 70%)",
          ].join(", "),
        }}
      />

      {/* Drifting aurora blobs (slow, transform-only loops) */}
      <div className="bg-blob absolute -top-[15%] -left-[10%] h-[60vmax] w-[60vmax] rounded-full opacity-50 blur-[120px] bg-blob-lime" />
      <div className="bg-blob bg-blob-cyan absolute top-[30%] -right-[20%] h-[55vmax] w-[55vmax] rounded-full opacity-40 blur-[130px]" />
      <div className="bg-blob bg-blob-rose absolute -bottom-[25%] left-[15%] h-[50vmax] w-[50vmax] rounded-full opacity-30 blur-[140px]" />
      <div className="bg-blob bg-blob-violet absolute top-[5%] left-[45%] h-[40vmax] w-[40vmax] rounded-full opacity-25 blur-[130px]" />

      {/* Film grain: gives large dark areas texture instead of flat black */}
      <div
        className="absolute inset-0 opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Cyber Horizon Floor Grid (Tilted 3D perspective) */}
      <div
        className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[200vw] h-[65vh] opacity-35"
        style={{
          transform: "perspective(450px) rotateX(68deg)",
          transformOrigin: "bottom center",
          backgroundImage: `
            linear-gradient(to right, rgba(0, 240, 255, 0.22) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 255, 136, 0.22) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          maskImage: "linear-gradient(to top, rgba(0,0,0,1) 10%, rgba(0,0,0,0.4) 60%, transparent 95%)",
          WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,1) 10%, rgba(0,0,0,0.4) 60%, transparent 95%)",
        }}
      />

      {/* Subtle Ceiling Cyber Grid */}
      <div
        className="absolute -top-24 left-1/2 -translate-x-1/2 w-[200vw] h-[45vh] opacity-20"
        style={{
          transform: "perspective(450px) rotateX(-68deg)",
          transformOrigin: "top center",
          backgroundImage: `
            linear-gradient(to right, rgba(0, 240, 255, 0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 240, 255, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.8) 10%, transparent 90%)",
          WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.8) 10%, transparent 90%)",
        }}
      />

      {/* Retro Horizontal Scanline Overlay */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, #000, #000 2px, transparent 2px, transparent 4px)",
        }}
      />

      {/* Soft vignette: keeps focus centered without killing the ambience */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle at center, transparent 55%, rgba(5, 8, 14, 0.45) 100%)",
        }}
      />
    </div>
  );
}
