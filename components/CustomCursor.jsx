"use client";
import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const move = (e) => {
      dot.style.left = e.clientX + "px";
      dot.style.top = e.clientY + "px";
      ring.style.left = e.clientX + "px";
      ring.style.top = e.clientY + "px";
    };

    const grow = () => {
      ring.style.width = "60px";
      ring.style.height = "60px";
      ring.style.opacity = "0.5";
    };
    const shrink = () => {
      ring.style.width = "36px";
      ring.style.height = "36px";
      ring.style.opacity = "1";
    };

    document.addEventListener("mousemove", move);
    document.querySelectorAll("a,button,input,textarea").forEach((el) => {
      el.addEventListener("mouseenter", grow);
      el.addEventListener("mouseleave", shrink);
    });

    return () => {
      document.removeEventListener("mousemove", move);
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className="hidden md:block"
        style={{
          width: 8,
          height: 8,
          background: "var(--accent)",
          borderRadius: "50%",
          position: "fixed",
          pointerEvents: "none",
          zIndex: 9999,
          transform: "translate(-50%,-50%)",
          mixBlendMode: "difference",
          transition: "transform 0.1s",
        }}
      />
      <div
        ref={ringRef}
        className="hidden md:block"
        style={{
          width: 36,
          height: 36,
          border: "1px solid rgba(0,255,231,0.4)",
          borderRadius: "50%",
          position: "fixed",
          pointerEvents: "none",
          zIndex: 9998,
          transform: "translate(-50%,-50%)",
          transition: "transform 0.18s, width 0.3s, height 0.3s, opacity 0.3s",
        }}
      />
    </>
  );
}
