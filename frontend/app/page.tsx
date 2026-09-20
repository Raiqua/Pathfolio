import Link from "next/link";
import Nav from "../components/Nav";

export default function Home() {
  return (
    <>
      <Nav />
      <section style={{ minHeight: "100svh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div className="wrap">
          <div className="eyebrow">PATHFOLIO / EXPERIENCE DISCOVERY</div>
          <h1 style={{ fontSize: "clamp(2.6rem,8.6vw,6.6rem)", fontWeight: 700, lineHeight: 1, marginTop: 18 }}>
            YOU HAVE MORE <span className="grad-text">EXPERIENCE</span> THAN YOU THINK.
          </h1>
          <p style={{ maxWidth: 520, marginTop: 26, color: "var(--ink-dim)", fontSize: "1.05rem" }}>
            Projects. Communities. Side hustles. Competitions. Hobbies. Things you&apos;ve built. Pathfolio maps
            them onto real O*NET skill categories with AI that never invents what you didn&apos;t tell it.
          </p>
          <div style={{ display: "flex", gap: 18, marginTop: 42, flexWrap: "wrap" }}>
            <Link className="btn-primary" href="/discover">
              DISCOVER YOUR EXPERIENCE →
            </Link>
            <Link className="btn-ghost" href="/resume">
              BUILD MY RESUME
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
