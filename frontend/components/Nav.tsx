"use client";
import Link from "next/link";

export default function Nav() {
  return (
    <nav
      style={{
        position: "fixed",
        top: 18,
        left: 0,
        right: 0,
        zIndex: 500,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "min(1000px, 92vw)",
          backdropFilter: "blur(14px)",
          background: "rgba(10,13,22,0.5)",
          border: "1px solid var(--line)",
          borderRadius: 100,
          padding: "10px 10px 10px 22px",
        }}
      >
        <Link href="/" style={{ fontWeight: 700 }}>
          PATHFOLIO
        </Link>
        <div style={{ display: "flex", gap: 24, fontSize: ".78rem", fontWeight: 600 }}>
          <Link href="/discover">DISCOVER</Link>
          <Link href="/vault">VAULT</Link>
          <Link href="/resume">RESUME</Link>
        </div>
      </div>
    </nav>
  );
}
