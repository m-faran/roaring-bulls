"use client";

import { useBasket } from "../lib/store/basket-context";

/* Ambient background for the whole site (paper design system).
   Always the warm paper layer so no gap ever shows dark space.
   The cyber aurora treatment below is kept for reference if the
   cyber theme is ever restored. */
export function GridBackground() {
  return (
    <div
      className="paper-texture pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    />
  );
}

/* --- Cyber aurora variant (unused, kept for reference) --- */
// const CYBER = (
//   <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
//     <div
//       className="absolute inset-0"
//       style={{
//         background: [
//           "radial-gradient(ellipse 60% 40% at 50% -10%, rgba(0, 255, 136, 0.18) 0%, transparent 70%)",
//           "radial-gradient(ellipse 50% 35% at 85% 25%, rgba(0, 240, 255, 0.14) 0%, transparent 60%)",
//           "radial-gradient(ellipse 45% 40% at 15% 75%, rgba(255, 27, 107, 0.10) 0%, transparent 60%)",
//           "radial-gradient(ellipse 55% 40% at 70% 80%, rgba(168, 85, 247, 0.09) 0%, transparent 60%)",
//           "radial-gradient(ellipse 60% 30% at 50% 100%, rgba(0, 240, 255, 0.12) 0%, transparent 70%)",
//         ].join(", "),
//       }}
//     />
//     <div className="bg-blob absolute -top-[15%] -left-[10%] h-[60vmax] w-[60vmax] rounded-full opacity-50 blur-[120px] bg-blob-lime" />
//     <div className="bg-blob bg-blob-cyan absolute top-[30%] -right-[20%] h-[55vmax] w-[55vmax] rounded-full opacity-40 blur-[130px]" />
//     <div className="bg-blob bg-blob-rose absolute -bottom-[25%] left-[15%] h-[50vmax] w-[50vmax] rounded-full opacity-30 blur-[140px]" />
//     <div className="bg-blob bg-blob-violet absolute top-[5%] left-[45%] h-[40vmax] w-[40vmax] rounded-full opacity-25 blur-[130px]" />
//   </div>
// );
