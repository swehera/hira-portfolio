export default function Footer() {
  return (
    <footer
      className="py-7 sm:py-8"
      style={{ borderTop: "1px solid var(--border)" }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs font-mono text-center sm:text-left" style={{ color: "var(--muted)" }}>
          © {new Date().getFullYear()}{" "}
          <span style={{ color: "var(--accent)" }}>&lt;Lutfor Rahman Hira/&gt;</span>.
          Built with ❤️ and ☕
        </p>
       
         <div className="flex items-center gap-6">
          {[
            {
              id: 1,
              name: "GitHub",
              link: "https://github.com/swehera/",
            },
            {
              id: 2,
              name: "Linkdin",
              link: "https://www.linkedin.com/in/lutfor-rahman-hera/",
            }
          ].map((s) => (
            <a key={s.id} href={`${s.link}`} target="_blank" className="nav-link font-mono">
              {s.name}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
