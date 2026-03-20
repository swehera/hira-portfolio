"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const navLinks = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const close = () => setOpen(false);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "shadow-lg" : ""
      }`}
      style={{
        backdropFilter: "blur(20px)",
        background: "rgba(8,12,20,0.9)",
        borderBottom: "1px solid rgba(0,255,231,0.12)",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <a
          href="#hero"
          className="font-bold text-xl font-syne shrink-0"
          style={{ color: "var(--accent)" }}
          onClick={close}
        >
          &lt;Hira/&gt;
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} className="nav-link">
              {l.label}
            </a>
          ))}
        </div>

        {/* Desktop CTA */}
        <a
          href="#contact"
          className="hidden md:inline-flex btn-primary"
          style={{ padding: "8px 20px", fontSize: "0.75rem" }}
        >
          Hire Me →
        </a>

        {/* Hamburger */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5 rounded-lg transition-colors"
          style={{
            background: open ? "rgba(0,255,231,0.08)" : "transparent",
            border: "1px solid rgba(0,255,231,0.15)",
          }}
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <span
            className={`block w-5 h-0.5 transition-all duration-300 ${open ? "rotate-45 translate-y-2" : ""}`}
            style={{ background: "var(--accent)" }}
          />
          <span
            className={`block w-5 h-0.5 transition-all duration-300 ${open ? "opacity-0" : ""}`}
            style={{ background: "var(--accent)" }}
          />
          <span
            className={`block w-5 h-0.5 transition-all duration-300 ${open ? "-rotate-45 -translate-y-2" : ""}`}
            style={{ background: "var(--accent)" }}
          />
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
        style={{
          borderTop: open ? "1px solid rgba(0,255,231,0.1)" : "none",
          background: "rgba(8,12,20,0.98)",
        }}
      >
        <div className="flex flex-col px-4 py-5 gap-1">
          {navLinks.map((l, i) => (
            <a
              key={l.href}
              href={l.href}
              onClick={close}
              className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200"
              style={{
                color: "var(--muted)",
                fontSize: "0.85rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                animationDelay: `${i * 60}ms`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--accent)";
                e.currentTarget.style.background = "rgba(0,255,231,0.06)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--muted)";
                e.currentTarget.style.background = "transparent";
              }}
            >
              <span style={{ color: "var(--accent)", fontSize: "0.7rem" }}>
                //
              </span>
              {l.label}
            </a>
          ))}
          <div className="pt-3 mt-2" style={{ borderTop: "1px solid rgba(0,255,231,0.08)" }}>
            <a
              href="#contact"
              className="btn-primary w-full justify-center"
              onClick={close}
              style={{ padding: "12px 24px" }}
            >
              Hire Me →
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
