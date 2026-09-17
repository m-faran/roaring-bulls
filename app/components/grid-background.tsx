"use client";

export function GridBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {/* Ambient Cyber Nebulae */}
      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{
          background: [
            "radial-gradient(ellipse 60% 40% at 50% -10%, rgba(0, 255, 136, 0.09) 0%, transparent 70%)",
            "radial-gradient(ellipse 50% 35% at 85% 25%, rgba(0, 240, 255, 0.07) 0%, transparent 60%)",
            "radial-gradient(ellipse 45% 40% at 15% 75%, rgba(255, 27, 107, 0.05) 0%, transparent 60%)",
            "radial-gradient(ellipse 60% 30% at 50% 100%, rgba(0, 240, 255, 0.06) 0%, transparent 70%)",
          ].join(", "),
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

      {/* Cyber Vignette edges */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle at center, transparent 40%, rgba(5, 8, 14, 0.8) 100%)",
        }}
      />
    </div>
  );
}
