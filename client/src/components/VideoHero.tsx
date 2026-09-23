import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const POSTER = "/videos/hero-poster.jpg";

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return reduced;
}

/**
 * Full-screen looping brand film behind the home page intro. The bottle sits
 * in the middle of every shot, so the copy lives to its left (top on phones).
 */
export default function VideoHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  // Only play while the hero is on screen and the tab is visible.
  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    let onScreen = true;
    const sync = () => {
      if (onScreen && !document.hidden) {
        // Autoplay can still be refused (e.g. low-power mode); the poster stays.
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    };

    const observer = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      sync();
    });
    observer.observe(section);
    document.addEventListener("visibilitychange", sync);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      className="hero-video relative overflow-hidden bg-[#0b0b0b] bg-cover bg-center text-ivoire"
      style={reducedMotion ? { backgroundImage: `url(${POSTER})` } : undefined}
    >
      {!reducedMotion && (
        <video
          ref={videoRef}
          aria-hidden="true"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={POSTER}
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source
            src="/videos/hero-mobile.mp4"
            type="video/mp4"
            media="(max-aspect-ratio: 3/4)"
          />
          <source src="/videos/hero.webm" type="video/webm" />
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>
      )}

      {/* Readability: dark from the top on phones, from the left on desktop. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-2/3 bg-gradient-to-b from-black/80 via-black/40 to-transparent lg:inset-y-0 lg:right-auto lg:h-full lg:w-3/5 lg:bg-gradient-to-r lg:from-black/65 lg:via-black/25" />

      <div className="relative mx-auto flex h-full max-w-6xl flex-col px-6 pt-24 text-center lg:pt-[24vh] lg:text-left">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 lg:max-w-md">
          <h1 className="font-serif text-5xl font-light tracking-[0.12em] sm:text-6xl lg:text-7xl">
            LAHIST&rsquo;AIR
          </h1>
          <p className="mt-3 text-xs uppercase tracking-[0.45em] text-or sm:text-sm">
            Maison d&rsquo;Air
          </p>
          <div className="mx-auto mt-6 h-px w-14 bg-or/70 lg:mx-0 lg:mt-8" />
          <Link
            to="/boutique"
            className="mt-6 inline-block rounded-full border border-ivoire/40 px-7 py-2.5 text-xs uppercase tracking-[0.25em] text-ivoire/90 backdrop-blur-sm transition-colors duration-300 hover:border-or hover:text-or lg:mt-8"
          >
            Découvrir la collection
          </Link>
        </div>
      </div>
    </section>
  );
}
