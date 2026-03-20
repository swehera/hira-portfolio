"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  getAbout, updateAbout,
  createSkill, updateSkill, deleteSkill,
  createProject, updateProject, deleteProject,
  updateContact,
} from "../lib/api";
import { useSkills, useProjects, useMessages, useContact, useAbout } from "../lib/hooks";

// ─── Constants ────────────────────────────────────────────────────────────
const CATS = ["Frontend", "Backend", "Mobile", "DevOps", "Database", "Other"];
const STATUS_OPTS = ["Completed", "Live", "In Progress", "Paused"];

// ─── Reusable UI sub-components ───────────────────────────────────────────
function StatCard({ icon, label, value, sub }) {
  return (
    <div style={{ background: "#101827", border: "1px solid rgba(0,255,231,0.12)", borderRadius: 12, padding: "20px 24px", display: "flex", alignItems: "center", gap: 16 }}>
      <div style={{ width: 44, height: 44, background: "rgba(0,255,231,0.1)", border: "1px solid rgba(0,255,231,0.2)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{icon}</div>
      <div>
        <p style={{ color: "#00ffe7", fontSize: "1.6rem", fontWeight: 800, fontFamily: "'Syne',sans-serif", lineHeight: 1 }}>{value}</p>
        <p style={{ color: "#64748b", fontSize: "0.7rem", marginTop: 3, letterSpacing: "0.06em" }}>{label}</p>
        {sub && <p style={{ color: "#00ffe7", fontSize: "0.65rem", marginTop: 2, opacity: 0.6 }}>{sub}</p>}
      </div>
    </div>
  );
}

function SectionHeader({ title, onAdd }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
      <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.1rem", fontWeight: 700, color: "#fff" }}>{title}</h2>
      {onAdd && (
        <button onClick={onAdd} style={{ background: "#00ffe7", color: "#080c14", border: "none", borderRadius: 7, padding: "8px 16px", fontSize: "0.75rem", fontWeight: 700, fontFamily: "'Syne',sans-serif", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, boxShadow: "0 0 20px rgba(0,255,231,0.2)" }}>
          + ADD NEW
        </button>
      )}
    </div>
  );
}

function Input({ label, value, onChange, type = "text", placeholder, multiline, rows = 3 }) {
  const base = { width: "100%", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(0,255,231,0.15)", borderRadius: 8, padding: "10px 12px", color: "#e2e8f0", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.8rem", outline: "none", boxSizing: "border-box", resize: multiline ? "vertical" : undefined };
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <label style={{ display: "block", fontSize: "0.68rem", color: "#64748b", marginBottom: 5, letterSpacing: "0.08em", textTransform: "uppercase" }}>{label}</label>}
      {multiline
        ? <textarea rows={rows} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={base} onFocus={e => { e.target.style.borderColor = "#00ffe7"; e.target.style.boxShadow = "0 0 0 3px rgba(0,255,231,0.08)"; }} onBlur={e => { e.target.style.borderColor = "rgba(0,255,231,0.15)"; e.target.style.boxShadow = "none"; }} />
        : <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={base} onFocus={e => { e.target.style.borderColor = "#00ffe7"; e.target.style.boxShadow = "0 0 0 3px rgba(0,255,231,0.08)"; }} onBlur={e => { e.target.style.borderColor = "rgba(0,255,231,0.15)"; e.target.style.boxShadow = "none"; }} />
      }
    </div>
  );
}

function SelectInput({ label, value, onChange, options }) {
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <label style={{ display: "block", fontSize: "0.68rem", color: "#64748b", marginBottom: 5, letterSpacing: "0.08em", textTransform: "uppercase" }}>{label}</label>}
      <select value={value} onChange={e => onChange(e.target.value)} style={{ width: "100%", background: "#101827", border: "1px solid rgba(0,255,231,0.15)", borderRadius: 8, padding: "10px 12px", color: "#e2e8f0", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.8rem", outline: "none", boxSizing: "border-box" }}>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function Modal({ title, onClose, onSave, saving, children }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(8,12,20,0.85)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ background: "#101827", border: "1px solid rgba(0,255,231,0.2)", borderRadius: 16, width: "100%", maxWidth: 520, maxHeight: "90vh", overflow: "auto", boxShadow: "0 40px 80px rgba(0,0,0,0.6)" }}>
        <div style={{ height: 2, background: "linear-gradient(90deg, transparent, #00ffe7, transparent)" }} />
        <div style={{ padding: "24px 28px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
            <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.05rem", fontWeight: 700, color: "#fff" }}>{title}</h3>
            <button onClick={onClose} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: "1.2rem" }}>✕</button>
          </div>
          {children}
          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
            <button onClick={onSave} disabled={saving} style={{ flex: 1, background: saving ? "rgba(0,255,231,0.5)" : "#00ffe7", color: "#080c14", border: "none", borderRadius: 8, padding: "11px 0", fontWeight: 700, fontFamily: "'Syne',sans-serif", fontSize: "0.82rem", cursor: saving ? "wait" : "pointer" }}>
              {saving ? "SAVING..." : "SAVE CHANGES"}
            </button>
            <button onClick={onClose} style={{ flex: 1, background: "transparent", color: "#e2e8f0", border: "1px solid rgba(0,255,231,0.15)", borderRadius: 8, padding: "11px 0", fontWeight: 600, fontFamily: "'Syne',sans-serif", fontSize: "0.82rem", cursor: "pointer" }}>
              CANCEL
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN DASHBOARD ────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState("overview");
  const [toast, setToast] = useState(null);
  const [saving, setSaving] = useState(false);

  // API hooks
  const { about, loading: aboutLoading } = useAbout();
  const { skills, setSkills, loading: skillsLoading } = useSkills();
  const { projects, setProjects, loading: projectsLoading } = useProjects();
  const { messages, stats, loading: msgLoading, filter, setFilter, toggleRead, toggleStar, markAllRead, removeMessage } = useMessages();
  const { contact, setContact } = useContact();

  // Local editable copies of about & contact (forms)
  const [aboutForm, setAboutForm] = useState(null);
  const [contactForm, setContactForm] = useState(null);
  const [viewMsg, setViewMsg] = useState(null);

  // Skill modal
  const [skillModal, setSkillModal] = useState(false);
  const [editSkill, setEditSkill] = useState(null);
  const [skillForm, setSkillForm] = useState({ name: "", category: "Frontend", level: 75, icon: "⚡" });

  // Project modal
  const [projModal, setProjModal] = useState(false);
  const [editProj, setEditProj] = useState(null);
  const [projForm, setProjForm] = useState({ title: "", description: "", tech: "", github_url: "", live_url: "", status: "Completed", featured: false });

  // ── Auth guard ────────────────────────────────────────────────────────
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!sessionStorage.getItem("admin_token")) router.push("/admin");
    }
  }, []);

  // ── Sync API data into form state ─────────────────────────────────────
  // Always sync when `about` changes — this ensures form shows fresh data
  // after the API polling updates it
  useEffect(() => {
    if (about) {
      setAboutForm({
        name: about.name || "",
        tagline: about.tagline || "",
        bio1: about.bio1 || "",
        bio2: about.bio2 || "",
        years_exp: about.years_exp || "3+",
        projects_count: about.projects_count || "20+",
        technologies: about.technologies || "10+",
        email: about.email || "",
        location: about.location || "",
        github: about.github || "",
        linkedin: about.linkedin || "",
        status: about.status || "Available for work",
      });
    }
  }, [about]); // re-runs every time `about` is updated by the hook

  useEffect(() => {
    if (contact) {
      setContactForm({
        email: contact.email || "",
        location: contact.location || "",
        github: contact.github || "",
        linkedin: contact.linkedin || "",
        twitter: contact.twitter || "",
        status: contact.status || "",
      });
    }
  }, [contact]);

  // ── Toast helper ──────────────────────────────────────────────────────
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  };

  // ── Logout ────────────────────────────────────────────────────────────
  const logout = () => {
    sessionStorage.removeItem("admin_token");
    sessionStorage.removeItem("admin_user");
    router.push("/admin");
  };

  // ── Save About ────────────────────────────────────────────────────────
  const saveAbout = async () => {
    setSaving(true);
    try {
      await updateAbout(aboutForm);
      // Broadcast to all hooks that data changed → triggers re-fetch on public pages
      window.dispatchEvent(new Event("portfolioUpdated"));
      showToast("About section saved!");
    } catch (err) {
      showToast(err.message, "warn");
    } finally {
      setSaving(false);
    }
  };

  // ── Save Contact ──────────────────────────────────────────────────────
  const saveContact = async () => {
    setSaving(true);
    try {
      const res = await updateContact(contactForm);
      setContact(res.data);
      window.dispatchEvent(new Event("portfolioUpdated"));
      showToast("Contact info saved!");
    } catch (err) {
      showToast(err.message, "warn");
    } finally {
      setSaving(false);
    }
  };

  // ── Skill CRUD ────────────────────────────────────────────────────────
  const openAddSkill = () => {
    setEditSkill(null);
    setSkillForm({ name: "", category: "Frontend", level: 75, icon: "⚡" });
    setSkillModal(true);
  };
  const openEditSkill = (sk) => {
    setEditSkill(sk);
    setSkillForm({ name: sk.name, category: sk.category, level: sk.level, icon: sk.icon });
    setSkillModal(true);
  };
  const saveSkill = async () => {
    if (!skillForm.name.trim()) return;
    setSaving(true);
    try {
      if (editSkill) {
        const res = await updateSkill(editSkill.id, skillForm);
        setSkills(s => s.map(x => x.id === editSkill.id ? res.data : x));
        showToast("Skill updated!");
      } else {
        const res = await createSkill(skillForm);
        setSkills(s => [...s, res.data]);
        showToast("Skill added!");
      }
      window.dispatchEvent(new Event("portfolioUpdated"));
      setSkillModal(false);
    } catch (err) {
      showToast(err.message, "warn");
    } finally {
      setSaving(false);
    }
  };
  const handleDeleteSkill = async (id) => {
    try {
      await deleteSkill(id);
      setSkills(s => s.filter(x => x.id !== id));
      window.dispatchEvent(new Event("portfolioUpdated"));
      showToast("Skill removed.", "warn");
    } catch (err) {
      showToast(err.message, "warn");
    }
  };

  // ── Project CRUD ──────────────────────────────────────────────────────
  const openAddProj = () => {
    setEditProj(null);
    setProjForm({ title: "", description: "", tech: "", github_url: "", live_url: "", status: "Completed", featured: false });
    setProjModal(true);
  };
  const openEditProj = (p) => {
    setEditProj(p);
    setProjForm({ title: p.title, description: p.description || "", tech: Array.isArray(p.tech) ? p.tech.join(", ") : "", github_url: p.github_url || "", live_url: p.live_url || "", status: p.status, featured: p.featured });
    setProjModal(true);
  };
  const saveProject = async () => {
    if (!projForm.title.trim()) return;
    setSaving(true);
    const payload = { ...projForm, tech: projForm.tech.split(",").map(t => t.trim()).filter(Boolean) };
    try {
      if (editProj) {
        const res = await updateProject(editProj.id, payload);
        setProjects(p => p.map(x => x.id === editProj.id ? res.data : x));
        showToast("Project updated!");
      } else {
        const res = await createProject(payload);
        setProjects(p => [...p, res.data]);
        showToast("Project added!");
      }
      window.dispatchEvent(new Event("portfolioUpdated"));
      setProjModal(false);
    } catch (err) {
      showToast(err.message, "warn");
    } finally {
      setSaving(false);
    }
  };
  const handleDeleteProject = async (id) => {
    try {
      await deleteProject(id);
      setProjects(p => p.filter(x => x.id !== id));
      window.dispatchEvent(new Event("portfolioUpdated"));
      showToast("Project removed.", "warn");
    } catch (err) {
      showToast(err.message, "warn");
    }
  };

  // ── Sidebar tabs ──────────────────────────────────────────────────────
  const tabs = [
    { id: "overview", icon: "📊", label: "Overview" },
    { id: "about", icon: "👤", label: "About Me" },
    { id: "skills", icon: "⚡", label: "Skills" },
    { id: "projects", icon: "🚀", label: "Projects" },
    { id: "contact", icon: "📬", label: "Contact Info" },
    { id: "messages", icon: "💬", label: "Messages", badge: stats?.unread || 0 },
  ];

  const cardStyle = { background: "#101827", border: "1px solid rgba(0,255,231,0.12)", borderRadius: 12, padding: "24px", marginBottom: 20 };
  const skillLevelColor = (l) => l >= 80 ? "#00ffe7" : l >= 60 ? "#ff6b35" : "#64748b";

  return (
    <div style={{ minHeight: "100vh", background: "#080c14", color: "#e2e8f0", fontFamily: "'JetBrains Mono', monospace", display: "flex" }}>

      {/* ── Toast ──────────────────────────────────────────────────────── */}
      {toast && (
        <div style={{
          position: "fixed", top: 20, right: 20, zIndex: 2000,
          background: toast.type === "warn" ? "rgba(239,68,68,0.15)" : "rgba(0,255,231,0.12)",
          border: `1px solid ${toast.type === "warn" ? "rgba(239,68,68,0.4)" : "rgba(0,255,231,0.4)"}`,
          borderRadius: 10, padding: "12px 20px",
          color: toast.type === "warn" ? "#f87171" : "#00ffe7",
          fontSize: "0.8rem", fontWeight: 600,
          boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
          animation: "slideIn 0.3s ease",
        }}>
          {toast.type === "warn" ? "⚠ " : "✓ "}{toast.msg}
        </div>
      )}

      {/* ── Sidebar ────────────────────────────────────────────────────── */}
      <div style={{ width: 240, minHeight: "100vh", background: "#0d1220", borderRight: "1px solid rgba(0,255,231,0.1)", display: "flex", flexDirection: "column", position: "sticky", top: 0, height: "100vh", flexShrink: 0 }}>
        <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid rgba(0,255,231,0.08)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, background: "rgba(0,255,231,0.12)", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, border: "1px solid rgba(0,255,231,0.2)" }}>🛠</div>
            <div>
              <p style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "0.95rem", color: "#fff", lineHeight: 1 }}>PortfolioOS</p>
              <p style={{ color: "#00ffe7", fontSize: "0.6rem", letterSpacing: "0.1em", marginTop: 2 }}>ADMIN v1.0</p>
            </div>
          </div>
        </div>

        <nav style={{ flex: 1, padding: "16px 12px" }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 8, border: "none", background: tab === t.id ? "rgba(0,255,231,0.1)" : "transparent", color: tab === t.id ? "#00ffe7" : "#64748b", cursor: "pointer", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.78rem", fontWeight: tab === t.id ? 600 : 400, textAlign: "left", marginBottom: 4, borderLeft: tab === t.id ? "2px solid #00ffe7" : "2px solid transparent", transition: "all 0.2s" }}>
              <span style={{ fontSize: 14 }}>{t.icon}</span>
              <span style={{ flex: 1 }}>{t.label}</span>
              {t.badge > 0 && (
                <span style={{ background: "#ff6b35", color: "#fff", borderRadius: "50%", width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.6rem", fontWeight: 700, flexShrink: 0 }}>{t.badge}</span>
              )}
            </button>
          ))}
        </nav>

        <div style={{ padding: "16px 12px", borderTop: "1px solid rgba(0,255,231,0.08)" }}>
          <button onClick={logout} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 8, border: "1px solid rgba(239,68,68,0.2)", background: "rgba(239,68,68,0.06)", color: "#f87171", cursor: "pointer", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.75rem", fontWeight: 600 }}>
            🚪 Logout
          </button>
        </div>
      </div>

      {/* ── Main content ──────────────────────────────────────────────── */}
      <div style={{ flex: 1, padding: "32px 28px", overflowY: "auto", maxWidth: "100%" }}>

        {/* Top bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
          <div>
            <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.5rem", fontWeight: 800, color: "#fff", marginBottom: 2 }}>
              {tabs.find(t => t.id === tab)?.icon} {tabs.find(t => t.id === tab)?.label}
            </h1>
            <p style={{ color: "#64748b", fontSize: "0.72rem", letterSpacing: "0.06em" }}>// PORTFOLIO CONTROL PANEL</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <a href="/" target="_blank" style={{ background: "transparent", border: "1px solid rgba(0,255,231,0.2)", color: "#00ffe7", borderRadius: 7, padding: "8px 14px", fontSize: "0.73rem", fontFamily: "'Syne',sans-serif", fontWeight: 600, textDecoration: "none" }}>↗ VIEW SITE</a>
            <div style={{ display: "flex", alignItems: "center", gap: 7, background: "rgba(0,0,0,0.3)", border: "1px solid rgba(0,255,231,0.12)", borderRadius: 7, padding: "7px 12px" }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />
              <span style={{ fontSize: "0.7rem", color: "#22c55e" }}>Online</span>
            </div>
          </div>
        </div>

        {/* ══ OVERVIEW ══ */}
        {tab === "overview" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 28 }}>
              <StatCard icon="⚡" label="Total Skills" value={skills.length} />
              <StatCard icon="🚀" label="Projects" value={projects.length} sub={`${projects.filter(p => p.featured).length} featured`} />
              <StatCard icon="⭐" label="Featured" value={projects.filter(p => p.featured).length} />
              <StatCard icon="💬" label="Messages" value={stats?.total || 0} sub={`${stats?.unread || 0} unread`} />
            </div>

            <div style={cardStyle}>
              <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, marginBottom: 16, color: "#fff", fontSize: "0.95rem" }}>Quick Actions</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {[
                  { label: "Add Skill", action: () => { setTab("skills"); setTimeout(openAddSkill, 100); }, icon: "⚡" },
                  { label: "Add Project", action: () => { setTab("projects"); setTimeout(openAddProj, 100); }, icon: "🚀" },
                  { label: "Edit About", action: () => setTab("about"), icon: "✏️" },
                  { label: "View Site", action: () => window.open("/", "_blank"), icon: "↗" },
                ].map(q => (
                  <button key={q.label} onClick={q.action} style={{ background: "rgba(0,255,231,0.06)", border: "1px solid rgba(0,255,231,0.2)", borderRadius: 8, padding: "10px 18px", color: "#00ffe7", fontFamily: "'Syne',sans-serif", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 7 }}>
                    {q.icon} {q.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={cardStyle}>
              <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, marginBottom: 16, color: "#fff", fontSize: "0.95rem" }}>Skills Overview</h3>
              {skillsLoading ? <p style={{ color: "#64748b", fontSize: "0.8rem" }}>Loading skills...</p> : (
                <div style={{ display: "grid", gap: 10 }}>
                  {skills.slice(0, 5).map(sk => (
                    <div key={sk.id} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <span style={{ fontSize: 14, width: 22, textAlign: "center" }}>{sk.icon}</span>
                      <span style={{ width: 130, fontSize: "0.78rem", color: "#e2e8f0" }}>{sk.name}</span>
                      <div style={{ flex: 1, height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 4 }}>
                        <div style={{ width: `${sk.level}%`, height: "100%", background: skillLevelColor(sk.level), borderRadius: 4, transition: "width 0.6s ease" }} />
                      </div>
                      <span style={{ fontSize: "0.72rem", color: skillLevelColor(sk.level), width: 32, textAlign: "right" }}>{sk.level}%</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══ ABOUT ══ */}
        {tab === "about" && aboutForm && (
          <div>
            <div style={cardStyle}>
              <SectionHeader title="Personal Info" />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
                <Input label="Display Title" value={aboutForm.name} onChange={v => setAboutForm(a => ({ ...a, name: v }))} />
                <Input label="Tagline" value={aboutForm.tagline} onChange={v => setAboutForm(a => ({ ...a, tagline: v }))} />
                <Input label="Email" value={aboutForm.email} onChange={v => setAboutForm(a => ({ ...a, email: v }))} />
                <Input label="Location" value={aboutForm.location} onChange={v => setAboutForm(a => ({ ...a, location: v }))} />
                <Input label="GitHub URL" value={aboutForm.github} onChange={v => setAboutForm(a => ({ ...a, github: v }))} />
                <Input label="LinkedIn URL" value={aboutForm.linkedin} onChange={v => setAboutForm(a => ({ ...a, linkedin: v }))} />
                <Input label="Status Badge" value={aboutForm.status} onChange={v => setAboutForm(a => ({ ...a, status: v }))} />
              </div>
            </div>
            <div style={cardStyle}>
              <SectionHeader title="Bio Text" />
              <Input label="Bio Paragraph 1" value={aboutForm.bio1} onChange={v => setAboutForm(a => ({ ...a, bio1: v }))} multiline rows={4} />
              <Input label="Bio Paragraph 2" value={aboutForm.bio2} onChange={v => setAboutForm(a => ({ ...a, bio2: v }))} multiline rows={3} />
            </div>
            <div style={cardStyle}>
              <SectionHeader title="Hero Stats" />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0 20px" }}>
                <Input label="Years Experience" value={aboutForm.years_exp} onChange={v => setAboutForm(a => ({ ...a, years_exp: v }))} />
                <Input label="Projects Count" value={aboutForm.projects_count} onChange={v => setAboutForm(a => ({ ...a, projects_count: v }))} />
                <Input label="Technologies" value={aboutForm.technologies} onChange={v => setAboutForm(a => ({ ...a, technologies: v }))} />
              </div>
            </div>
            <button onClick={saveAbout} disabled={saving} style={{ background: saving ? "rgba(0,255,231,0.5)" : "#00ffe7", color: "#080c14", border: "none", borderRadius: 8, padding: "13px 32px", fontWeight: 700, fontFamily: "'Syne',sans-serif", fontSize: "0.85rem", cursor: saving ? "wait" : "pointer", boxShadow: "0 0 30px rgba(0,255,231,0.25)" }}>
              {saving ? "SAVING..." : "SAVE ABOUT SECTION →"}
            </button>
          </div>
        )}
        {tab === "about" && aboutLoading && <p style={{ color: "#64748b" }}>Loading about data...</p>}

        {/* ══ SKILLS ══ */}
        {tab === "skills" && (
          <div>
            <SectionHeader title={`Skills (${skills.length})`} onAdd={openAddSkill} />
            {skillsLoading ? <p style={{ color: "#64748b" }}>Loading skills...</p> : (
              CATS.filter(cat => skills.some(s => s.category === cat)).map(cat => (
                <div key={cat} style={{ marginBottom: 28 }}>
                  <p style={{ color: "#00ffe7", fontSize: "0.68rem", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 12 }}>// {cat}</p>
                  <div style={{ display: "grid", gap: 8 }}>
                    {skills.filter(s => s.category === cat).map(sk => (
                      <div key={sk.id} style={{ background: "#101827", border: "1px solid rgba(0,255,231,0.1)", borderRadius: 10, padding: "14px 18px", display: "flex", alignItems: "center", gap: 14 }}>
                        <span style={{ fontSize: 16, width: 24, textAlign: "center" }}>{sk.icon}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                            <span style={{ fontSize: "0.83rem", fontWeight: 600, color: "#e2e8f0" }}>{sk.name}</span>
                            <span style={{ fontSize: "0.72rem", color: skillLevelColor(sk.level), fontWeight: 700 }}>{sk.level}%</span>
                          </div>
                          <div style={{ height: 5, background: "rgba(255,255,255,0.06)", borderRadius: 4 }}>
                            <div style={{ width: `${sk.level}%`, height: "100%", background: skillLevelColor(sk.level), borderRadius: 4 }} />
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: 6, marginLeft: 8 }}>
                          <button onClick={() => openEditSkill(sk)} style={{ background: "rgba(0,255,231,0.08)", border: "1px solid rgba(0,255,231,0.2)", borderRadius: 6, padding: "5px 10px", color: "#00ffe7", cursor: "pointer", fontSize: "0.7rem", fontFamily: "inherit" }}>Edit</button>
                          <button onClick={() => handleDeleteSkill(sk.id)} style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 6, padding: "5px 10px", color: "#f87171", cursor: "pointer", fontSize: "0.7rem", fontFamily: "inherit" }}>Del</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
            {!skillsLoading && skills.length === 0 && (
              <div style={{ textAlign: "center", padding: "48px 0", color: "#64748b" }}>
                <p style={{ fontSize: "2rem", marginBottom: 12 }}>⚡</p>
                <p>No skills yet. Click &quot;Add New&quot; to add your first skill.</p>
              </div>
            )}
          </div>
        )}

        {/* ══ PROJECTS ══ */}
        {tab === "projects" && (
          <div>
            <SectionHeader title={`Projects (${projects.length})`} onAdd={openAddProj} />
            {projectsLoading ? <p style={{ color: "#64748b" }}>Loading projects...</p> : (
              <div style={{ display: "grid", gap: 14 }}>
                {projects.map(p => (
                  <div key={p.id} style={{ background: "#101827", border: "1px solid rgba(0,255,231,0.1)", borderRadius: 12, padding: "20px 22px", position: "relative" }}>
                    {p.featured && (
                      <span style={{ position: "absolute", top: 14, right: 14, background: "rgba(255,107,53,0.15)", border: "1px solid rgba(255,107,53,0.35)", borderRadius: 5, padding: "2px 8px", color: "#ff6b35", fontSize: "0.62rem", fontWeight: 700 }}>FEATURED</span>
                    )}
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                      <div style={{ width: 44, height: 44, background: "rgba(0,255,231,0.08)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0, border: "1px solid rgba(0,255,231,0.15)" }}>🚀</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
                          <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "1rem", color: "#fff" }}>{p.title}</h3>
                          <span style={{ background: p.status === "Live" ? "rgba(34,197,94,0.12)" : "rgba(0,255,231,0.08)", border: `1px solid ${p.status === "Live" ? "rgba(34,197,94,0.3)" : "rgba(0,255,231,0.2)"}`, color: p.status === "Live" ? "#4ade80" : "#00ffe7", borderRadius: 5, padding: "2px 8px", fontSize: "0.62rem", fontWeight: 700 }}>{p.status}</span>
                        </div>
                        <p style={{ color: "#64748b", fontSize: "0.78rem", marginBottom: 10 }}>{p.description}</p>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
                          {(Array.isArray(p.tech) ? p.tech : []).map(t => (
                            <span key={t} style={{ background: "rgba(0,255,231,0.06)", border: "1px solid rgba(0,255,231,0.15)", borderRadius: 4, padding: "2px 8px", color: "#00ffe7", fontSize: "0.68rem" }}>{t}</span>
                          ))}
                        </div>
                        <div style={{ display: "flex", gap: 8 }}>
                          <button onClick={() => openEditProj(p)} style={{ background: "rgba(0,255,231,0.08)", border: "1px solid rgba(0,255,231,0.2)", borderRadius: 6, padding: "6px 14px", color: "#00ffe7", cursor: "pointer", fontSize: "0.72rem", fontFamily: "inherit", fontWeight: 600 }}>✏ Edit</button>
                          <button onClick={() => handleDeleteProject(p.id)} style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 6, padding: "6px 14px", color: "#f87171", cursor: "pointer", fontSize: "0.72rem", fontFamily: "inherit", fontWeight: 600 }}>🗑 Remove</button>
                          {p.github_url && <a href={p.github_url} target="_blank" rel="noreferrer" style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: "6px 14px", color: "#94a3b8", textDecoration: "none", fontSize: "0.72rem", fontFamily: "inherit" }}>↗ GitHub</a>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {!projectsLoading && projects.length === 0 && (
                  <div style={{ textAlign: "center", padding: "48px 0", color: "#64748b" }}>
                    <p style={{ fontSize: "2rem", marginBottom: 12 }}>🚀</p>
                    <p>No projects yet. Click &quot;Add New&quot; to add your first project.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ══ MESSAGES ══ */}
        {tab === "messages" && (
          <div>
            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 24 }}>
              {[
                { label: "Total Messages", value: stats?.total || 0, icon: "💬", color: "#00ffe7" },
                { label: "Unread", value: stats?.unread || 0, icon: "🔴", color: "#f87171" },
                { label: "Starred", value: stats?.starred || 0, icon: "⭐", color: "#fbbf24" },
              ].map(s => (
                <div key={s.label} style={{ background: "#101827", border: "1px solid rgba(0,255,231,0.1)", borderRadius: 10, padding: "16px 18px", display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 18 }}>{s.icon}</span>
                  <div>
                    <p style={{ color: s.color, fontSize: "1.4rem", fontWeight: 800, fontFamily: "'Syne',sans-serif", lineHeight: 1 }}>{s.value}</p>
                    <p style={{ color: "#64748b", fontSize: "0.68rem", marginTop: 2 }}>{s.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Filter chips */}
            <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" }}>
              {["all", "unread", "starred"].map(f => (
                <button key={f} onClick={() => setFilter(f)} style={{ background: filter === f ? "rgba(0,255,231,0.12)" : "transparent", border: `1px solid ${filter === f ? "rgba(0,255,231,0.4)" : "rgba(0,255,231,0.1)"}`, borderRadius: 7, padding: "6px 14px", color: filter === f ? "#00ffe7" : "#64748b", cursor: "pointer", fontFamily: "'JetBrains Mono',monospace", fontSize: "0.72rem", fontWeight: filter === f ? 700 : 400, textTransform: "uppercase" }}>
                  {f === "all" ? `All (${stats?.total || 0})` : f === "unread" ? `Unread (${stats?.unread || 0})` : `Starred (${stats?.starred || 0})`}
                </button>
              ))}
              <button onClick={async () => { await markAllRead(); showToast("All marked as read!"); }} style={{ marginLeft: "auto", background: "transparent", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 7, padding: "6px 14px", color: "#94a3b8", cursor: "pointer", fontFamily: "'JetBrains Mono',monospace", fontSize: "0.7rem" }}>
                ✓ Mark all read
              </button>
            </div>

            {/* Message list */}
            {msgLoading ? <p style={{ color: "#64748b" }}>Loading messages...</p> : (
              <div style={{ display: "grid", gap: 10 }}>
                {messages.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "60px 0", color: "#64748b" }}>
                    <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
                    No messages in this filter.
                  </div>
                ) : messages.map(msg => (
                  <div key={msg.id} style={{ background: msg.is_read ? "#101827" : "rgba(0,255,231,0.04)", border: `1px solid ${msg.is_read ? "rgba(0,255,231,0.08)" : "rgba(0,255,231,0.2)"}`, borderRadius: 12, padding: "16px 20px", position: "relative", transition: "all 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(0,255,231,0.35)"}
                    onMouseLeave={e => e.currentTarget.style.borderColor = msg.is_read ? "rgba(0,255,231,0.08)" : "rgba(0,255,231,0.2)"}
                  >
                    {!msg.is_read && <span style={{ position: "absolute", top: 18, left: -5, width: 8, height: 8, borderRadius: "50%", background: "#00ffe7", boxShadow: "0 0 8px #00ffe7", display: "block" }} />}
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                      <div style={{ width: 42, height: 42, borderRadius: "50%", background: `hsl(${(msg.name.charCodeAt(0) * 17) % 360},40%,25%)`, border: "1px solid rgba(0,255,231,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", fontWeight: 700, color: "#00ffe7", flexShrink: 0, fontFamily: "'Syne',sans-serif" }}>
                        {msg.name.charAt(0).toUpperCase()}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 3, flexWrap: "wrap", gap: 6 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ fontWeight: msg.is_read ? 500 : 700, color: "#e2e8f0", fontSize: "0.85rem", fontFamily: "'Syne',sans-serif" }}>{msg.name}</span>
                            {!msg.is_read && <span style={{ background: "rgba(0,255,231,0.12)", border: "1px solid rgba(0,255,231,0.3)", borderRadius: 4, padding: "1px 6px", color: "#00ffe7", fontSize: "0.58rem", fontWeight: 700 }}>NEW</span>}
                          </div>
                          <span style={{ color: "#64748b", fontSize: "0.68rem" }}>{new Date(msg.created_at).toLocaleDateString("en-BD", { day: "numeric", month: "short", year: "numeric" })}</span>
                        </div>
                        <p style={{ color: "#64748b", fontSize: "0.7rem", marginBottom: 3 }}>{msg.email}</p>
                        <p style={{ color: "#00ffe7", fontSize: "0.75rem", marginBottom: 4, fontWeight: 600 }}>{msg.subject}</p>
                        <p style={{ color: "#64748b", fontSize: "0.75rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{msg.message}</p>
                        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                          <button onClick={() => { setViewMsg(msg); toggleRead(msg.id, true); }} style={{ background: "rgba(0,255,231,0.08)", border: "1px solid rgba(0,255,231,0.2)", borderRadius: 6, padding: "5px 12px", color: "#00ffe7", cursor: "pointer", fontSize: "0.7rem", fontFamily: "inherit", fontWeight: 600 }}>👁 Read</button>
                          <a href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject || "")}`} style={{ background: "rgba(255,107,53,0.08)", border: "1px solid rgba(255,107,53,0.2)", borderRadius: 6, padding: "5px 12px", color: "#ff6b35", textDecoration: "none", fontSize: "0.7rem", fontFamily: "inherit", fontWeight: 600 }}>↩ Reply</a>
                          <button onClick={() => toggleStar(msg.id, !msg.is_starred)} style={{ background: msg.is_starred ? "rgba(251,191,36,0.1)" : "transparent", border: `1px solid ${msg.is_starred ? "rgba(251,191,36,0.3)" : "rgba(255,255,255,0.08)"}`, borderRadius: 6, padding: "5px 10px", color: msg.is_starred ? "#fbbf24" : "#64748b", cursor: "pointer", fontSize: "0.75rem", fontFamily: "inherit" }}>{msg.is_starred ? "★" : "☆"}</button>
                          {!msg.is_read && <button onClick={() => toggleRead(msg.id, true)} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6, padding: "5px 12px", color: "#94a3b8", cursor: "pointer", fontSize: "0.7rem", fontFamily: "inherit" }}>✓ Mark read</button>}
                          <button onClick={() => removeMessage(msg.id)} style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: 6, padding: "5px 10px", color: "#f87171", cursor: "pointer", fontSize: "0.7rem", fontFamily: "inherit", marginLeft: "auto" }}>🗑</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Message detail modal */}
            {viewMsg && (
              <div style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(8,12,20,0.88)", backdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} onClick={() => setViewMsg(null)}>
                <div style={{ background: "#101827", border: "1px solid rgba(0,255,231,0.2)", borderRadius: 16, width: "100%", maxWidth: 580, boxShadow: "0 40px 80px rgba(0,0,0,0.6)", overflow: "hidden" }} onClick={e => e.stopPropagation()}>
                  <div style={{ height: 2, background: "linear-gradient(90deg, transparent, #00ffe7, #ff6b35, transparent)" }} />
                  <div style={{ padding: "28px 32px" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                        <div style={{ width: 48, height: 48, borderRadius: "50%", background: `hsl(${(viewMsg.name.charCodeAt(0) * 17) % 360},40%,25%)`, border: "1px solid rgba(0,255,231,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", fontWeight: 700, color: "#00ffe7", fontFamily: "'Syne',sans-serif" }}>
                          {viewMsg.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: "#fff", fontSize: "1rem" }}>{viewMsg.name}</p>
                          <a href={`mailto:${viewMsg.email}`} style={{ color: "#64748b", fontSize: "0.73rem", textDecoration: "none" }}>{viewMsg.email}</a>
                        </div>
                      </div>
                      <button onClick={() => setViewMsg(null)} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: "1.2rem" }}>✕</button>
                    </div>
                    <div style={{ background: "rgba(0,255,231,0.04)", border: "1px solid rgba(0,255,231,0.1)", borderRadius: 8, padding: "12px 16px", marginBottom: 18 }}>
                      <p style={{ color: "#64748b", fontSize: "0.65rem", letterSpacing: "0.1em", marginBottom: 4 }}>SUBJECT</p>
                      <p style={{ color: "#00ffe7", fontWeight: 700, fontSize: "0.9rem", fontFamily: "'Syne',sans-serif" }}>{viewMsg.subject}</p>
                    </div>
                    <p style={{ color: "#64748b", fontSize: "0.68rem", marginBottom: 14 }}>📅 {new Date(viewMsg.created_at).toLocaleString("en-BD", { dateStyle: "long", timeStyle: "short" })}</p>
                    <div style={{ background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: "18px 20px", marginBottom: 24, color: "#cbd5e1", fontSize: "0.83rem", lineHeight: 1.8, minHeight: 100 }}>
                      {viewMsg.message}
                    </div>
                    <div style={{ display: "flex", gap: 10 }}>
                      <a href={`mailto:${viewMsg.email}?subject=Re: ${encodeURIComponent(viewMsg.subject || "")}`} style={{ flex: 1, background: "#ff6b35", color: "#fff", border: "none", borderRadius: 8, padding: "11px 0", fontWeight: 700, fontFamily: "'Syne',sans-serif", fontSize: "0.82rem", cursor: "pointer", textDecoration: "none", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>↩ Reply via Email</a>
                      <button onClick={() => { toggleStar(viewMsg.id, !viewMsg.is_starred); setViewMsg(v => ({ ...v, is_starred: !v.is_starred })); }} style={{ background: viewMsg.is_starred ? "rgba(251,191,36,0.12)" : "rgba(255,255,255,0.04)", border: `1px solid ${viewMsg.is_starred ? "rgba(251,191,36,0.35)" : "rgba(255,255,255,0.1)"}`, borderRadius: 8, padding: "11px 18px", color: viewMsg.is_starred ? "#fbbf24" : "#94a3b8", cursor: "pointer", fontFamily: "'Syne',sans-serif", fontSize: "0.82rem", fontWeight: 600 }}>{viewMsg.is_starred ? "★ Starred" : "☆ Star"}</button>
                      <button onClick={() => { removeMessage(viewMsg.id); setViewMsg(null); showToast("Message deleted.", "warn"); }} style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, padding: "11px 16px", color: "#f87171", cursor: "pointer", fontFamily: "'Syne',sans-serif", fontSize: "0.82rem" }}>🗑 Delete</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══ CONTACT ══ */}
        {tab === "contact" && contactForm && (
          <div>
            <div style={cardStyle}>
              <SectionHeader title="Contact Details" />
              <Input label="Email Address" value={contactForm.email} onChange={v => setContactForm(f => ({ ...f, email: v }))} />
              <Input label="Location" value={contactForm.location} onChange={v => setContactForm(f => ({ ...f, location: v }))} />
              <Input label="Availability Status" value={contactForm.status} onChange={v => setContactForm(f => ({ ...f, status: v }))} />
            </div>
            <div style={cardStyle}>
              <SectionHeader title="Social Links" />
              <Input label="GitHub" value={contactForm.github} onChange={v => setContactForm(f => ({ ...f, github: v }))} placeholder="https://github.com/..." />
              <Input label="LinkedIn" value={contactForm.linkedin} onChange={v => setContactForm(f => ({ ...f, linkedin: v }))} placeholder="https://linkedin.com/in/..." />
              <Input label="Twitter" value={contactForm.twitter} onChange={v => setContactForm(f => ({ ...f, twitter: v }))} placeholder="https://twitter.com/..." />
            </div>
            <button onClick={saveContact} disabled={saving} style={{ background: saving ? "rgba(0,255,231,0.5)" : "#00ffe7", color: "#080c14", border: "none", borderRadius: 8, padding: "13px 32px", fontWeight: 700, fontFamily: "'Syne',sans-serif", fontSize: "0.85rem", cursor: saving ? "wait" : "pointer", boxShadow: "0 0 30px rgba(0,255,231,0.25)" }}>
              {saving ? "SAVING..." : "SAVE CONTACT INFO →"}
            </button>
          </div>
        )}
      </div>

      {/* ══ SKILL MODAL ══ */}
      {skillModal && (
        <Modal title={editSkill ? "Edit Skill" : "Add New Skill"} onClose={() => setSkillModal(false)} onSave={saveSkill} saving={saving}>
          <Input label="Skill Name" value={skillForm.name} onChange={v => setSkillForm(f => ({ ...f, name: v }))} placeholder="e.g. React.js" />
          <Input label="Icon (emoji)" value={skillForm.icon} onChange={v => setSkillForm(f => ({ ...f, icon: v }))} placeholder="⚡" />
          <SelectInput label="Category" value={skillForm.category} onChange={v => setSkillForm(f => ({ ...f, category: v }))} options={CATS} />
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: "0.68rem", color: "#64748b", marginBottom: 6, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Proficiency Level: <span style={{ color: "#00ffe7" }}>{skillForm.level}%</span>
            </label>
            <input type="range" min={10} max={100} value={skillForm.level} onChange={e => setSkillForm(f => ({ ...f, level: +e.target.value }))} style={{ width: "100%", accentColor: "#00ffe7" }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.65rem", color: "#64748b", marginTop: 4 }}>
              <span>Beginner</span><span>Intermediate</span><span>Expert</span>
            </div>
          </div>
        </Modal>
      )}

      {/* ══ PROJECT MODAL ══ */}
      {projModal && (
        <Modal title={editProj ? "Edit Project" : "Add New Project"} onClose={() => setProjModal(false)} onSave={saveProject} saving={saving}>
          <Input label="Project Title" value={projForm.title} onChange={v => setProjForm(f => ({ ...f, title: v }))} placeholder="My Awesome App" />
          <Input label="Description" value={projForm.description} onChange={v => setProjForm(f => ({ ...f, description: v }))} multiline rows={3} placeholder="What does this project do?" />
          <Input label="Tech Stack (comma separated)" value={projForm.tech} onChange={v => setProjForm(f => ({ ...f, tech: v }))} placeholder="React, Node.js, MongoDB" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 14px" }}>
            <Input label="GitHub URL" value={projForm.github_url} onChange={v => setProjForm(f => ({ ...f, github_url: v }))} placeholder="https://github.com/..." />
            <Input label="Live URL" value={projForm.live_url} onChange={v => setProjForm(f => ({ ...f, live_url: v }))} placeholder="https://..." />
          </div>
          <SelectInput label="Status" value={projForm.status} onChange={v => setProjForm(f => ({ ...f, status: v }))} options={STATUS_OPTS} />
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <input type="checkbox" id="featured" checked={projForm.featured} onChange={e => setProjForm(f => ({ ...f, featured: e.target.checked }))} style={{ accentColor: "#00ffe7" }} />
            <label htmlFor="featured" style={{ fontSize: "0.78rem", color: "#e2e8f0", cursor: "pointer" }}>Mark as Featured Project</label>
          </div>
        </Modal>
      )}

      <style>{`
        @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #080c14; }
        ::-webkit-scrollbar-thumb { background: rgba(0,255,231,0.3); border-radius: 2px; }
      `}</style>
    </div>
  );
}
