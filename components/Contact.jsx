"use client";
import { useEffect, useRef, useState } from "react";
import { useContact } from "../lib/hooks";
import { sendMessage } from "../lib/api";

export default function Contact() {
  const ref = useRef(null);
  const { contact } = useContact();
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [errorMsg, setErrorMsg] = useState("");
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.1 }
    );
    ref.current?.querySelectorAll(".fade-section").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");
    try {
      await sendMessage(form);
      setStatus("sent");
      setForm({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setStatus("idle"), 4000);
    } catch (err) {
      setErrorMsg(err.message || "Failed to send. Please try again.");
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  // Use API data with fallbacks
  const email = contact?.email || "hello@yoursite.com";
  const location = contact?.location || "Dhaka, Bangladesh 🇧🇩";
  const github = contact?.github || "https://github.com/swehera";
  const linkedin = contact?.linkedin || "https://www.linkedin.com/in/lutfor-rahman-hera/";

  const contactInfo = [
    { icon: "📧", label: "Email", value: email, href: `mailto:${email}` },
    { icon: "📍", label: "Location", value: location, href: null },
  ];

  const socials = [
    { label: "GitHub", href: github },
    { label: "LinkedIn", href: linkedin },
  ];

  return (
    <section id="contact" className="py-20 sm:py-28" style={{ background: "var(--bg2)" }} ref={ref}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="text-center mb-12 sm:mb-16 fade-section">
          <p className="text-xs mb-3 tracking-widest font-mono" style={{ color: "var(--accent)" }}>
            // 04. CONTACT
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-syne mb-4">
            Let&apos;s Build Something{" "}
            <span style={{ color: "var(--accent)" }}>Together</span>
          </h2>
          <p className="text-sm font-mono mx-auto" style={{ color: "var(--muted)", maxWidth: "440px" }}>
            Have a project in mind? Want to collaborate? Or just want to say hi?
            My inbox is always open.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">

          {/* Info cards */}
          <div className="fade-section space-y-4">
            {contactInfo.map((c) => (
              <div key={c.label} className="glow-box rounded-xl p-5 sm:p-6" style={{ background: "var(--card)" }}>
                <div className="flex items-start gap-4">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-lg shrink-0"
                    style={{ background: "rgba(0,255,231,0.1)" }}
                  >
                    {c.icon}
                  </div>
                  <div>
                    <p className="text-xs mb-1 font-mono" style={{ color: "var(--muted)" }}>{c.label}</p>
                    {c.href ? (
                      <a href={c.href} className="font-semibold font-syne transition-colors hover:text-[var(--accent)]" style={{ wordBreak: "break-all" }}>
                        {c.value}
                      </a>
                    ) : (
                      <p className="font-semibold font-syne">{c.value}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Socials */}
            <div className="glow-box rounded-xl p-5 sm:p-6" style={{ background: "var(--card)" }}>
              <p className="text-xs mb-4 tracking-widest font-mono" style={{ color: "var(--muted)" }}>FIND ME ON</p>
              <div className="flex flex-wrap gap-3">
                {socials.map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="btn-outline" style={{ padding: "8px 16px", fontSize: "0.75rem" }}>
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="fade-section glow-box rounded-xl p-5 sm:p-8" style={{ background: "var(--card)" }}>
            <h3 className="text-lg sm:text-xl font-bold mb-6 font-syne">Send a Message</h3>

            {/* Error banner */}
            {status === "error" && (
              <div style={{
                background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
                borderRadius: 8, padding: "10px 14px", marginBottom: 16,
                color: "#f87171", fontSize: "0.78rem",
              }}>
                ⚠ {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs mb-2 font-mono" style={{ color: "var(--muted)" }}>Name</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    className="form-input"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs mb-2 font-mono" style={{ color: "var(--muted)" }}>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs mb-2 font-mono" style={{ color: "var(--muted)" }}>Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="Project idea / Collaboration"
                  className="form-input"
                />
              </div>

              <div>
                <label className="block text-xs mb-2 font-mono" style={{ color: "var(--muted)" }}>Message</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell me about your project..."
                  rows={5}
                  className="form-input resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={status === "sending" || status === "sent"}
                className="btn-primary w-full justify-center"
                style={{
                  background:
                    status === "sent" ? "#22c55e"
                    : status === "sending" ? "rgba(0,255,231,0.6)"
                    : status === "error" ? "rgba(239,68,68,0.8)"
                    : "var(--accent)",
                  opacity: status === "sending" ? 0.8 : 1,
                  transition: "all 0.3s",
                }}
              >
                {status === "idle" && "Send Message →"}
                {status === "sending" && "Sending..."}
                {status === "sent" && "✓ Message Sent!"}
                {status === "error" && "Try Again →"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
