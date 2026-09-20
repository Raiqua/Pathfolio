"use client";
import { useEffect, useState } from "react";
import Nav from "../../components/Nav";
import { Experience, listExperiences, saveResume } from "../../lib/api";

const DEMO_USER_ID = process.env.NEXT_PUBLIC_DEMO_USER_ID || "";
const COLORS: Record<string, string> = { indigo: "#6a5cff", ocean: "#2450e8", emerald: "#1fae7a" };
const TEMPLATES = ["PATH", "NEXUS", "AURA", "MINIMAL"];

export default function ResumePage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [color, setColor] = useState("indigo");
  const [template, setTemplate] = useState("PATH");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    listExperiences(DEMO_USER_ID).then(setExperiences).catch(() => {});
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      await saveResume({
        user_id: DEMO_USER_ID,
        template,
        color,
        font: "Space Grotesk",
        experience_ids: experiences.map((e) => e.id),
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Nav />
      <section style={{ padding: "140px 0" }}>
        <div className="wrap">
          <div className="eyebrow">RESUME STUDIO</div>
          <h2 style={{ fontSize: "clamp(2.2rem,6vw,3.4rem)", fontWeight: 700, marginTop: 14 }}>
            BUILD SOMETHING <span className="grad-text">WITH IT.</span>
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 30, marginTop: 40 }}>
            <div style={{ border: "1px solid var(--line)", borderRadius: 20, padding: 24 }}>
              <label style={{ fontSize: ".8rem", color: "var(--ink-dim)" }}>Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ width: "100%", background: "none", border: "1px solid var(--line)", borderRadius: 10, padding: 10, color: "var(--ink)", marginTop: 6, marginBottom: 20 }}
              />
              <label style={{ fontSize: ".8rem", color: "var(--ink-dim)" }}>Target role</label>
              <input
                value={role}
                onChange={(e) => setRole(e.target.value)}
                style={{ width: "100%", background: "none", border: "1px solid var(--line)", borderRadius: 10, padding: 10, color: "var(--ink)", marginTop: 6, marginBottom: 20 }}
              />
              <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
                {Object.entries(COLORS).map(([n, hex]) => (
                  <button
                    key={n}
                    onClick={() => setColor(n)}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      background: hex,
                      border: color === n ? "2px solid #fff" : "2px solid transparent",
                    }}
                  />
                ))}
              </div>
              {TEMPLATES.map((t) => (
                <button
                  key={t}
                  onClick={() => setTemplate(t)}
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "left",
                    padding: "10px 14px",
                    borderRadius: 10,
                    border: template === t ? "1px solid var(--blue)" : "1px solid var(--line)",
                    marginBottom: 8,
                    background: "none",
                    color: "var(--ink)",
                  }}
                >
                  {t}
                </button>
              ))}
              <button className="btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: 12 }} onClick={handleSave} disabled={saving}>
                {saving ? "SAVING…" : "SAVE RESUME"}
              </button>
            </div>

            <div style={{ background: "#fff", color: "#111", borderRadius: 16, padding: 40, borderTop: `6px solid ${COLORS[color]}` }}>
              <div style={{ fontSize: "2rem", fontWeight: 800 }}>{name || "Your Name"}</div>
              <div style={{ color: "#555", marginBottom: 24 }}>{role || "Aspiring — role goes here"} · {template} template</div>
              {experiences.length === 0 ? (
                <p style={{ color: "#999" }}>Discover an experience to see it appear here.</p>
              ) : (
                experiences.map((exp) => (
                  <div key={exp.id} style={{ marginBottom: 14 }}>
                    <b style={{ display: "block", color: COLORS[color] }}>{exp.title}</b>
                    <span style={{ fontSize: ".9rem" }}>{exp.resume_bullet}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
