"use client";
import { useEffect, useRef } from "react";
import { useSkills } from "../lib/hooks";

// Static fallback stack categories (always shown)
const stackCategories = [
  {
    icon: "⚡",
    title: "Frontend",
    color: "rgba(0,255,231,0.1)",
    chips: ["React.js", "HTML5", "CSS3", "JavaScript", "Tailwind CSS", "Redux", "Next.js", "Material Ui", "Shadcn"],
  },
  {
    icon: "📱",
    title: "Mobile",
    color: "rgba(255,107,53,0.1)",
    chips: ["React Native"],
  },
  {
    icon: "🛠️",
    title: "Tools & More",
    color: "rgba(0,255,231,0.1)",
    chips: ["Node.js", "Git & GitHub", "Bitbucket", "VS Code", "Figma", "REST APIs", "MongoDB", "PostgreSQL", "Postman"],
  },
];

export default function Skills() {
  const ref = useRef(null);
  const { skills, loading } = useSkills();

  // Proficiency bars — from API if available, else static
  const bars = skills.length > 0
    ? skills.slice(0, 5).map((s, i) => ({ label: s.name, pct: s.level, delay: i * 150 }))
    : [
        { label: "React.js", pct: 92, delay: 0 },
        { label: "React Native", pct: 85, delay: 150 },
        { label: "Android (Java/Kotlin)", pct: 80, delay: 300 },
        { label: "HTML / CSS / Tailwind", pct: 88, delay: 450 },
        { label: "Node.js / Backend", pct: 75, delay: 600 },
      ];

  useEffect(() => {
    const sectionObs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.1 }
    );
    ref.current?.querySelectorAll(".fade-section").forEach((el) => sectionObs.observe(el));

    // Animate bars when section enters viewport
    const barObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            ref.current?.querySelectorAll(".bar-fill").forEach((bar) => {
              const pct = bar.dataset.pct;
              const delay = bar.dataset.delay || 0;
              setTimeout(() => { bar.style.width = pct + "%"; }, Number(delay));
            });
            barObs.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );
    const barsSection = ref.current?.querySelector("#bars-section");
    if (barsSection) barObs.observe(barsSection);

    return () => { sectionObs.disconnect(); barObs.disconnect(); };
  }, [skills]); // re-run when skills load

  return (
    <section id="skills" className="py-20 sm:py-28" style={{ background: "var(--bg2)" }} ref={ref}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16 fade-section">
          <p className="text-xs mb-3 tracking-widest font-mono" style={{ color: "var(--accent)" }}>
            // 02. SKILLS
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-syne">My Tech Stack</h2>
        </div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {stackCategories.map((cat) => (
            <div key={cat.title} className="fade-section glow-box rounded-xl p-5 sm:p-6" style={{ background: "var(--card)" }}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg" style={{ background: cat.color }}>
                  {cat.icon}
                </div>
                <h3 className="font-bold text-base sm:text-lg font-syne">{cat.title}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {cat.chips.map((c) => (
                  <span key={c} className="skill-chip">{c}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bars + Code snippet */}
        <div className="mt-10 sm:mt-12 grid lg:grid-cols-2 gap-8 fade-section" id="bars-section">
          {/* Proficiency bars */}
          <div>
            <h3 className="font-bold mb-6 font-syne" style={{ color: "var(--text)" }}>
              Proficiency Levels
              {loading && <span className="text-xs font-mono ml-2" style={{ color: "var(--muted)" }}>loading...</span>}
            </h3>
            <div className="space-y-5">
              {bars.map((b) => (
                <div key={b.label}>
                  <div className="flex justify-between mb-2">
                    <span className="text-xs font-mono" style={{ color: "var(--text)" }}>{b.label}</span>
                    <span className="text-xs font-mono" style={{ color: "var(--accent)" }}>{b.pct}%</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                    <div
                      className="bar-fill h-full rounded-full"
                      data-pct={b.pct}
                      data-delay={b.delay}
                      style={{
                        width: "0%",
                        background: "linear-gradient(90deg, var(--accent), rgba(0,255,231,0.35))",
                        transition: "width 1.1s ease",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Code card */}
          <div
            className="rounded-xl p-4 sm:p-5 text-xs leading-relaxed font-mono overflow-x-auto"
            style={{ background: "var(--card)", border: "1px solid var(--border)" }}
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="w-3 h-3 rounded-full bg-red-500/70" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <span className="w-3 h-3 rounded-full bg-green-500/70" />
              <span className="ml-2 text-xs font-mono" style={{ color: "var(--muted)" }}>developer.js</span>
            </div>
            <pre style={{ color: "var(--muted)", lineHeight: "1.85", overflowX: "auto" }}>{`const developer = {
  name: `}<span style={{ color: "#a8e6cf" }}>&quot;Lutfor Rahman Hira&quot;</span>{`,
  role: `}<span style={{ color: "#a8e6cf" }}>&quot;Full-Stack Developer&quot;</span>{`,
  location: `}<span style={{ color: "#a8e6cf" }}>&quot;Dhaka, Bangladesh&quot;</span>{`,
  skills: [
    `}<span style={{ color: "#a8e6cf" }}>&quot;React.js&quot;</span>{`,
    `}<span style={{ color: "#a8e6cf" }}>&quot;React Native&quot;</span>{`,
    `}<span style={{ color: "#a8e6cf" }}>&quot;Android Studio&quot;</span>{`,
  ],
  available: `}<span style={{ color: "#ff6b35" }}>true</span>{`,
  coffee: `}<span style={{ color: "#ff6b35" }}>Infinity</span>{`,
};`}</pre>
          </div>
        </div>
      </div>
    </section>
  );
}
