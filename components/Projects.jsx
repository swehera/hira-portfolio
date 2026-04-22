"use client";
import { useEffect, useRef } from "react";
import { useProjects } from "../lib/hooks";

// Static fallback projects (shown while loading or if API has none)
const STATIC_PROJECTS = [
  {
    emoji: "🛫", title: "Tour Management System",
    desc: "This is enterprise-level software with multiple role-based access and dashboards, a beautiful design with Tailwind CSS, and many more things.",
    tags: ["React", "NextJS", "NodeJS", "ExpressJs", "PostGreSql"], badge: "PERN STACT",
    bg: "linear-gradient(135deg,#0d1a2d,#1a2f4a)", live: "https://tour-master-pro.vercel.app/", github: "https://github.com/swehera/tour-master",
  },
  {
    emoji: "🤖", title: "Pharmacy Management System",
    desc: "This is a management software for local pharmacy",
    tags: ["React", "NextJS", "NodeJS", "ExpressJs", "MongoDB"], badge: "MERN STACT",
    bg: "linear-gradient(135deg,#1a0d2d,#2d1a4a)", badgeColor: "var(--accent2)", live: "https://pharmacy-management-system-hera.vercel.app/", github: "https://github.com/swehera/pharmacy-management-system",
  }
  
];

const BG_GRADIENTS = [
  "linear-gradient(135deg,#0d1a2d,#1a2f4a)",
  "linear-gradient(135deg,#1a0d2d,#2d1a4a)",
  "linear-gradient(135deg,#0d2d1a,#1a4a2d)",
  "linear-gradient(135deg,#2d1a0d,#4a2d1a)",
  "linear-gradient(135deg,#0d1f2d,#1a3545)",
  "linear-gradient(135deg,#1a0d1a,#2d1a3a)",
];

export default function Projects() {
  const ref = useRef(null);
  const { projects, loading } = useProjects();

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.08 }
    );
    ref.current?.querySelectorAll(".fade-section").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [projects]);

  // Use API data if available, otherwise show static fallback
  const displayProjects = projects.length > 0
    ? projects.map((p, i) => ({
        emoji: "🚀",
        title: p.title,
        desc: p.description,
        tags: Array.isArray(p.tech) ? p.tech : [],
        badge: p.status,
        bg: BG_GRADIENTS[i % BG_GRADIENTS.length],
        badgeColor: p.status === "Live" ? "#22c55e" : null,
        live: p.live_url || "#",
        github: p.github_url || "#",
      }))
    : STATIC_PROJECTS;

  return (
    <section id="projects" className="py-20 sm:py-28" ref={ref}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-4 mb-12 sm:mb-16 fade-section">
          <div>
            <p className="text-xs mb-3 tracking-widest font-mono" style={{ color: "var(--accent)" }}>
              // 03. PROJECTS
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-syne">
              Featured Work
              {loading && <span className="text-sm font-mono ml-3" style={{ color: "var(--muted)" }}>loading...</span>}
            </h2>
          </div>
          <a href="#" className="btn-outline text-sm">View all projects →</a>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {displayProjects.map((p, idx) => (
            <div key={p.title + idx} className="project-card fade-section">
              {/* Thumbnail */}
              <div
                className="w-full flex items-center justify-center relative"
                style={{ height: "180px", background: p.bg, fontSize: "3.5rem" }}
              >
                <span>{p.emoji}</span>
                <div className="absolute top-3 right-3">
                  <span
                    className="skill-chip"
                    style={{
                      fontSize: "0.65rem",
                      padding: "3px 8px",
                      color: p.badgeColor || "var(--accent)",
                      borderColor: p.badgeBorder || "var(--border)",
                    }}
                  >
                    {p.badge}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 sm:p-5">
                <h3 className="font-bold text-base sm:text-lg mb-2 font-syne">{p.title}</h3>
                <p className="text-xs mb-4 leading-relaxed font-mono" style={{ color: "var(--muted)" }}>
                  {p.desc}
                </p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {p.tags.map((t) => (
                    <span key={t} className="skill-chip" style={{ fontSize: "0.62rem", padding: "2px 8px" }}>{t}</span>
                  ))}
                </div>
                <div className="flex gap-2.5">
                  <a href={p.live} target="_blank" className="btn-primary flex-1 justify-center" style={{ padding: "8px 12px", fontSize: "0.72rem" }}>
                    Live Demo ↗
                  </a>
                  <a href={p.github} target="_blank" className="btn-outline flex-1 justify-center" style={{ padding: "8px 12px", fontSize: "0.72rem" }}>
                    GitHub
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
