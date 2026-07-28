import Lenis from "@studio-freight/lenis";

// Anyone who wants to move the page should go through this instance. Calling
// window.scrollTo() while Lenis is running fights it — Lenis keeps animating
// toward its own target and visibly yanks the page back.
let lenis = null;

const prefersReducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const initSmoothScroll = () => {
  if (lenis || prefersReducedMotion) return lenis;

  lenis = new Lenis({
    duration: 1.05,
    // Exponential ease-out: quick to respond, settles without a bounce.
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.6,
    // Touch devices already scroll smoothly and hijacking it feels laggy.
    syncTouch: false,
  });

  const raf = (time) => {
    lenis.raf(time);
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);

  return lenis;
};

/** Jump to the top with no animation — used on route change. */
export const scrollToTopInstant = () => {
  if (lenis) lenis.scrollTo(0, { immediate: true });
  else window.scrollTo(0, 0);
};

/** Glide to the top — used by the footer's "Back to Top". */
export const scrollToTopSmooth = () => {
  if (lenis) lenis.scrollTo(0, { duration: 1.2 });
  else window.scrollTo({ top: 0, behavior: "smooth" });
};

/** Glide to an element by id, accounting for the fixed navbar. */
export const scrollToElement = (id, offset = -96) => {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset });
  else el.scrollIntoView({ behavior: "smooth" });
};
