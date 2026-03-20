"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { loginAdmin } from "../lib/api";

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | error | success
  const [errorMsg, setErrorMsg] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [glitchActive, setGlitchActive] = useState(false);
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  // ── Redirect if already logged in ──────────────────────────────────────
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = sessionStorage.getItem("admin_token");
      if (token) router.push("/admin/dashboard");
    }
  }, []);

  // ── Matrix rain background ──────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const cols = Math.floor(canvas.width / 20);
    const drops = Array(cols).fill(1);
    const chars = "01アイウエオカキクケコ</>{}[];=>+-*";

    const draw = () => {
      ctx.fillStyle = "rgba(8,12,20,0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(0,255,231,0.12)";
      ctx.font = "13px JetBrains Mono, monospace";
      drops.forEach((y, i) => {
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(char, i * 20, y * 20);
        if (y * 20 > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      });
    };

    animRef.current = setInterval(draw, 55);
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener("resize", resize);
    return () => { clearInterval(animRef.current); window.removeEventListener("resize", resize); };
  }, []);

  // ── Glitch pulse ────────────────────────────────────────────────────────
  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 400);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // ── Submit — calls real API ─────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await loginAdmin(username, password);
      // Save token + admin info to sessionStorage
      sessionStorage.setItem("admin_token", res.data.token);
      sessionStorage.setItem("admin_user", JSON.stringify(res.data.admin));
      setStatus("success");
      setTimeout(() => router.push("/admin/dashboard"), 800);
    } catch (err) {
      setErrorMsg(err.message || "Invalid credentials. Access denied.");
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  console.log(process.env.NEXT_PUBLIC_API_URL)
// Should print: http://localhost:5000/api

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--bg, #080c14)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'JetBrains Mono', monospace",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Matrix rain */}
      <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }} />

      {/* Radial glow */}
      <div style={{
        position: "fixed", inset: 0,
        background: "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(0,255,231,0.05) 0%, transparent 70%)",
        zIndex: 1, pointerEvents: "none",
      }} />

      {/* Login card */}
      <div style={{ position: "relative", zIndex: 10, width: "100%", maxWidth: 420, margin: "0 16px" }}>
        {/* Top accent bar */}
        <div style={{
          height: 3,
          background: "linear-gradient(90deg, transparent, #00ffe7, #ff6b35, transparent)",
          borderRadius: "2px 2px 0 0",
        }} />

        <div style={{
          background: "rgba(13,18,32,0.92)",
          border: "1px solid rgba(0,255,231,0.15)",
          borderTop: "none",
          borderRadius: "0 0 16px 16px",
          padding: "36px 32px 40px",
          backdropFilter: "blur(20px)",
          boxShadow: "0 0 0 1px rgba(0,255,231,0.06), 0 40px 80px rgba(0,0,0,0.6)",
        }}>
          {/* Brand */}
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              width: 52, height: 52, borderRadius: 12,
              background: "rgba(0,255,231,0.1)", border: "1px solid rgba(0,255,231,0.25)",
              fontSize: 22, marginBottom: 16,
            }}>🔐</div>
            <h1 style={{
              fontFamily: "'Syne', sans-serif", fontSize: "1.6rem", fontWeight: 800,
              color: glitchActive ? "#00ffe7" : "#fff", marginBottom: 4,
              transition: "color 0.1s", letterSpacing: "-0.02em",
            }}>Admin Access</h1>
            <p style={{ color: "rgba(100,116,139,1)", fontSize: "0.72rem", letterSpacing: "0.15em" }}>
              // PORTFOLIO CONTROL PANEL
            </p>
          </div>

          {/* Error banner */}
          {status === "error" && (
            <div style={{
              background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
              borderRadius: 8, padding: "10px 14px", marginBottom: 20,
              color: "#f87171", fontSize: "0.75rem",
              display: "flex", alignItems: "center", gap: 8,
              animation: "shake 0.4s ease",
            }}>
              <span>⚠</span> {errorMsg}
            </div>
          )}

          {/* Success banner */}
          {status === "success" && (
            <div style={{
              background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)",
              borderRadius: 8, padding: "10px 14px", marginBottom: 20,
              color: "#4ade80", fontSize: "0.75rem",
              display: "flex", alignItems: "center", gap: 8,
            }}>
              <span>✓</span> Access granted. Redirecting...
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Username */}
            <div style={{ marginBottom: 16 }}>
              <label style={{
                display: "block", fontSize: "0.7rem", color: "rgba(100,116,139,1)",
                marginBottom: 6, letterSpacing: "0.08em", textTransform: "uppercase",
              }}>Username</label>
              <div style={{ position: "relative" }}>
                <span style={{
                  position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
                  color: "rgba(0,255,231,0.5)", fontSize: "0.8rem", pointerEvents: "none",
                }}>&gt;_</span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  required
                  autoComplete="username"
                  style={{
                    width: "100%", background: "rgba(0,0,0,0.3)",
                    border: `1px solid ${status === "error" ? "rgba(239,68,68,0.5)" : "rgba(0,255,231,0.15)"}`,
                    borderRadius: 8, padding: "11px 14px 11px 40px",
                    color: "#e2e8f0", fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.83rem", outline: "none", boxSizing: "border-box",
                    transition: "border-color 0.25s, box-shadow 0.25s",
                  }}
                  onFocus={(e) => { e.target.style.borderColor = "#00ffe7"; e.target.style.boxShadow = "0 0 0 3px rgba(0,255,231,0.1)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "rgba(0,255,231,0.15)"; e.target.style.boxShadow = "none"; }}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: 24 }}>
              <label style={{
                display: "block", fontSize: "0.7rem", color: "rgba(100,116,139,1)",
                marginBottom: 6, letterSpacing: "0.08em", textTransform: "uppercase",
              }}>Password</label>
              <div style={{ position: "relative" }}>
                <span style={{
                  position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
                  color: "rgba(0,255,231,0.5)", fontSize: "0.85rem", pointerEvents: "none",
                }}>🔑</span>
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  style={{
                    width: "100%", background: "rgba(0,0,0,0.3)",
                    border: `1px solid ${status === "error" ? "rgba(239,68,68,0.5)" : "rgba(0,255,231,0.15)"}`,
                    borderRadius: 8, padding: "11px 44px 11px 40px",
                    color: "#e2e8f0", fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.83rem", outline: "none", boxSizing: "border-box",
                    transition: "border-color 0.25s, box-shadow 0.25s",
                  }}
                  onFocus={(e) => { e.target.style.borderColor = "#00ffe7"; e.target.style.boxShadow = "0 0 0 3px rgba(0,255,231,0.1)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "rgba(0,255,231,0.15)"; e.target.style.boxShadow = "none"; }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{
                    position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", color: "rgba(100,116,139,1)",
                    cursor: "pointer", fontSize: "0.75rem", padding: 0,
                  }}
                >
                  {showPass ? "HIDE" : "SHOW"}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={status === "loading" || status === "success"}
              style={{
                width: "100%",
                background:
                  status === "success" ? "#22c55e"
                  : status === "error" ? "rgba(239,68,68,0.8)"
                  : "#00ffe7",
                color: "#080c14",
                fontFamily: "'Syne', sans-serif", fontWeight: 700,
                fontSize: "0.85rem", letterSpacing: "0.08em",
                padding: "13px 0", borderRadius: 8, border: "none",
                cursor: status === "loading" ? "wait" : "pointer",
                transition: "all 0.25s",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                boxShadow: status !== "error" ? "0 0 30px rgba(0,255,231,0.25)" : "0 0 20px rgba(239,68,68,0.25)",
              }}
            >
              {status === "loading" && (
                <span style={{
                  display: "inline-block", width: 14, height: 14,
                  border: "2px solid rgba(8,12,20,0.3)", borderTop: "2px solid #080c14",
                  borderRadius: "50%", animation: "spin 0.8s linear infinite",
                }} />
              )}
              {status === "idle" && "ACCESS CONTROL PANEL →"}
              {status === "loading" && "AUTHENTICATING..."}
              {status === "success" && "✓ ACCESS GRANTED"}
              {status === "error" && "⚠ TRY AGAIN"}
            </button>
          </form>

          <p style={{
            textAlign: "center", marginTop: 24,
            color: "rgba(100,116,139,0.5)", fontSize: "0.65rem", letterSpacing: "0.1em",
          }}>
            AUTHORIZED PERSONNEL ONLY
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          20%,60% { transform: translateX(-6px); }
          40%,80% { transform: translateX(6px); }
        }
      `}</style>
    </div>
  );
}
