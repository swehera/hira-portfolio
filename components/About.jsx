"use client";
import { useEffect, useRef } from "react";
import { useAbout } from "../lib/hooks";

const whatIDo = [
  { icon: "🌐", label: "Web Apps" },
  { icon: "📱", label: "Mobile Apps" },
  { icon: "🤖", label: "Android Dev" },
];

const learning = ["Next.js", "TypeScript", "GraphQL", "Docker"];

export default function About() {
  const ref = useRef(null);
  const { about, loading } = useAbout();

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.1 }
    );
    ref.current?.querySelectorAll(".fade-section").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <section id="about" className="py-20 sm:py-28" ref={ref}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">

          {/* Text */}
          <div className="fade-section">
            <p className="text-xs mb-3 tracking-widest font-mono" style={{ color: "var(--accent)" }}>
              // 01. ABOUT ME
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-6 font-syne leading-tight">
              Turning ideas into<br />
              <span style={{ color: "var(--accent)" }}>digital reality</span>
            </h2>
            <div className="space-y-4 text-sm leading-loose font-mono" style={{ color: "var(--muted)" }}>
              <p>{loading ? "Loading..." : (about?.bio1 || "Hi! I'm a passionate web & mobile developer who loves building clean, efficient, and user-friendly applications.")}</p>
              <p>{loading ? "" : (about?.bio2 || "I believe great software is built on solid fundamentals — clean architecture, maintainable code, and thoughtful UX.")}</p>
              <p>When I&apos;m not coding, I&apos;m exploring new technologies, contributing to projects, and leveling up my craft every day.</p>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#contact" className="btn-primary">Let&apos;s work together →</a>
              <a href="#" className="btn-outline">Download CV</a>
            </div>
          </div>

          {/* Info grid */}
          <div className="fade-section grid grid-cols-2 gap-4">
            {/* What I do */}
            <div className="col-span-2 rounded-xl p-5 sm:p-6 glow-box" style={{ background: "var(--card)" }}>
              <p className="text-xs mb-4 tracking-widest font-mono" style={{ color: "var(--muted)" }}>WHAT I DO</p>
              <div className="grid grid-cols-3 gap-3">
                {whatIDo.map((item) => (
                  <div
                    key={item.label}
                    className="text-center p-3 rounded-lg transition-all duration-200 hover:-translate-y-1"
                    style={{ background: "rgba(0,255,231,0.04)", border: "1px solid var(--border)" }}
                  >
                    <div className="text-xl sm:text-2xl mb-2">{item.icon}</div>
                    <p className="text-xs font-mono" style={{ color: "var(--accent)" }}>{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Stat boxes */}
            <div className="rounded-xl p-4 sm:p-5 glow-box text-center" style={{ background: "var(--card)" }}>
              <p className="text-2xl sm:text-3xl font-extrabold mb-1 font-syne" style={{ color: "var(--accent)" }}>100%</p>
              <p className="text-xs font-mono" style={{ color: "var(--muted)" }}>Client Satisfaction</p>
            </div>
            <div className="rounded-xl p-4 sm:p-5 glow-box text-center" style={{ background: "var(--card)" }}>
              <p className="text-2xl sm:text-3xl font-extrabold mb-1 font-syne" style={{ color: "var(--accent)" }}>
                {about?.projects_count || "20+"}
              </p>
              <p className="text-xs font-mono" style={{ color: "var(--muted)" }}>Projects Delivered</p>
            </div>

            {/* Currently learning */}
            <div className="col-span-2 rounded-xl p-5 sm:p-6 glow-box" style={{ background: "var(--card)" }}>
              <p className="text-xs mb-3 tracking-widest font-mono" style={{ color: "var(--muted)" }}>CURRENTLY LEARNING</p>
              <div className="flex flex-wrap gap-2">
                {learning.map((t) => (
                  <span key={t} className="skill-chip">{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
