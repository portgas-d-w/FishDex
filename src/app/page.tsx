export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <div className="flex flex-col items-center gap-4">
        <h1
          className="text-5xl font-bold"
          style={{ fontFamily: "var(--font-outfit)", color: "#00D9C0" }}
        >
          FishDex 🎣
        </h1>
        <p className="text-lg" style={{ color: "#8B95A8" }}>
          Ton journal de pêche moderne
        </p>
      </div>

      <div
        className="rounded-2xl border p-6 flex flex-col gap-4 w-full max-w-sm"
        style={{ background: "#151B2D", borderColor: "#1F2940" }}
      >
        <p className="text-sm font-semibold" style={{ color: "#8B95A8" }}>
          Palette de couleurs ✅
        </p>
        <div className="flex gap-3 flex-wrap">
          {[
            { label: "Fond", color: "#0A0E1A" },
            { label: "Surface", color: "#151B2D" },
            { label: "Turquoise", color: "#00D9C0" },
            { label: "Corail", color: "#FF6B35" },
            { label: "Texte", color: "#F5F7FA" },
            { label: "Discret", color: "#8B95A8" },
            { label: "Bordure", color: "#1F2940" },
          ].map(({ label, color }) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <div
                className="w-10 h-10 rounded-lg border"
                style={{ background: color, borderColor: "#1F2940" }}
              />
              <span className="text-xs" style={{ color: "#8B95A8" }}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs" style={{ color: "#8B95A8" }}>
        Phase 1 Setup — ✅ Opérationnel
      </p>
    </main>
  );
}
