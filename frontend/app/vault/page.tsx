"use client";
import { useEffect, useState } from "react";
import Nav from "../../components/Nav";
import { Experience, listExperiences } from "../../lib/api";

const DEMO_USER_ID = process.env.NEXT_PUBLIC_DEMO_USER_ID || "";

export default function VaultPage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listExperiences(DEMO_USER_ID)
      .then(setExperiences)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Nav />
      <section style={{ padding: "140px 0" }}>
        <div className="wrap">
          <div className="eyebrow">EXPERIENCE VAULT</div>
          <h2 style={{ fontSize: "clamp(2.2rem,6vw,3.4rem)", fontWeight: 700, marginTop: 14 }}>
            YOUR EXPERIENCE <span className="grad-text">VAULT.</span>
          </h2>

          {loading && <p style={{ marginTop: 30, color: "var(--ink-dim)" }}>Loading…</p>}
          {error && <p style={{ marginTop: 30, color: "#f66" }}>{error}</p>}
          {!loading && experiences.length === 0 && !error && (
            <p style={{ marginTop: 30, color: "var(--ink-dim)" }}>
              Nothing here yet — head to Discover and add your first experience.
            </p>
          )}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))",
              gap: 18,
              marginTop: 40,
            }}
          >
            {experiences.map((exp) => (
              <div key={exp.id} style={{ border: "1px solid var(--line)", borderRadius: 20, padding: 24 }}>
                <div style={{ fontSize: ".68rem", letterSpacing: ".1em", color: "var(--blue)", fontWeight: 700 }}>
                  {exp.category}
                </div>
                <h4 style={{ marginTop: 8, fontSize: "1.1rem" }}>{exp.title}</h4>
                <p style={{ marginTop: 8, fontSize: ".86rem", color: "var(--ink-dim)" }}>{exp.resume_bullet}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 12 }}>
                  {exp.skills.map((s) => (
                    <span
                      key={s.onet_id}
                      style={{ fontSize: ".68rem", border: "1px solid var(--line)", borderRadius: 100, padding: "4px 10px" }}
                    >
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
