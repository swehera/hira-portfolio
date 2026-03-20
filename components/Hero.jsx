"use client";
import { useEffect, useRef } from "react";
import { useAbout } from "../lib/hooks";

export default function Hero() {
  const { about } = useAbout();

  return (
    <section
      id="hero"
      className="min-h-screen flex items-center relative pt-16"
      style={{
        background:
          "radial-gradient(ellipse 70% 60% at 60% 40%, rgba(0,255,231,0.07) 0%, transparent 70%), radial-gradient(ellipse 40% 40% at 20% 80%, rgba(255,107,53,0.05) 0%, transparent 60%)",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full py-16 sm:py-24">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* ── Text side ── */}
          <div className="order-2 lg:order-1">
            {/* Label */}
            <div className="mb-5 flex items-center gap-3">
              <span className="text-xs tracking-widest" style={{ color: "var(--accent)" }}>
                // HELLO, WORLD
              </span>
              <span className="h-px flex-1" style={{ background: "var(--border)" }} />
            </div>

            {/* Name / Title */}
            <h1
              className="font-extrabold leading-tight mb-5 font-syne"
              style={{ fontSize: "clamp(2.4rem, 7vw, 4.5rem)" }}
            >
              <span
                className="block mb-1 font-mono"
                style={{ color: "var(--muted)", fontSize: "clamp(0.7rem, 2vw, 1rem)", letterSpacing: "0.2em" }}
              >
                I&apos;M A
              </span>
              <span className="glitch" data-text={about?.name || "Software Engineer"}>
                {about?.name || "Software Engineer"}
              </span>
            </h1>

            {/* Typewriter */}
            <div className="mb-7 overflow-hidden" style={{ maxWidth: "420px" }}>
              <p className="typewriter text-xs sm:text-sm font-mono" style={{ color: "var(--accent)" }}>
                {about?.tagline || "Building experiences for the digital world."}
              </p>
            </div>

            {/* Bio */}
            <p
              className="text-sm leading-loose mb-8"
              style={{ color: "var(--muted)", maxWidth: "460px", lineHeight: "1.9" }}
            >
              {about?.bio1 || "I craft performant, beautiful web & mobile applications. Passionate about clean code, great UX, and pushing what's possible on the web."}
            </p>

            {/* CTA */}
            <div className="flex flex-wrap gap-3">
              <a href="#projects" className="btn-primary">View My Work ↓</a>
              <a href="#contact" className="btn-outline">Get In Touch</a>
            </div>

            {/* Stats */}
            <div className="flex gap-6 sm:gap-10 mt-10 pt-8" style={{ borderTop: "1px solid var(--border)" }}>
              {[
                { num: about?.years_exp || "3+", label: "Years Coding" },
                { num: about?.projects_count || "20+", label: "Projects Built" },
                { num: about?.technologies || "10+", label: "Technologies" },
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-4">
                  {i > 0 && <div className="h-8 w-px" style={{ background: "var(--border)" }} />}
                  <div>
                    <p className="text-2xl sm:text-3xl font-extrabold font-syne" style={{ color: "var(--accent)" }}>
                      {s.num}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Avatar side ── */}
          <div className="order-1 lg:order-2 flex justify-center">
            <div className="relative">
              <div
                className="absolute inset-0 rounded-full spin-ring"
                style={{
                  background: "conic-gradient(var(--accent), transparent, var(--accent2), transparent, var(--accent))",
                  filter: "blur(2px)",
                  transform: "scale(1.08)",
                }}
              />
              <div
                className="relative rounded-full overflow-hidden glow-box border-2"
                style={{ width: "clamp(200px, 50vw, 280px)", height: "clamp(200px, 50vw, 280px)", borderColor: "var(--border)" }}
              >
                <div
                  className="w-full h-full flex items-center justify-center select-none"
                  style={{ background: "linear-gradient(135deg,#0d1220 0%,#1a2540 100%)", fontSize: "clamp(4rem, 15vw, 6rem)" }}
                >
                  👨‍💻
                </div>
              </div>

              {/* Status badge */}
              <div
                className="absolute -bottom-4 -right-3 sm:-right-5 rounded-xl px-3 py-2 sm:px-4 sm:py-3"
                style={{ background: "var(--card)", border: "1px solid var(--border)", boxShadow: "0 8px 24px rgba(0,0,0,0.4)" }}
              >
                <p className="text-xs" style={{ color: "var(--muted)" }}>Status</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#22c55e" }} />
                  <span className="text-xs font-semibold whitespace-nowrap" style={{ color: "#22c55e" }}>
                    {about?.status || "Available for work"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce hidden sm:flex">
        <span className="text-xs" style={{ color: "var(--muted)" }}>scroll</span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ color: "var(--accent)" }}>
          <path d="M8 3v10M3 8l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
    </section>
  );
}
