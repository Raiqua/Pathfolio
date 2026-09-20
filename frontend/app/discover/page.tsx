"use client";
import Nav from "../../components/Nav";
import DiscoveryFlow from "../../components/DiscoveryFlow";

export default function DiscoverPage() {
  return (
    <>
      <Nav />
      <section style={{ padding: "140px 0" }}>
        <div className="wrap">
          <div className="eyebrow">DISCOVER</div>
          <h2 style={{ fontSize: "clamp(2.2rem,6vw,3.4rem)", fontWeight: 700, marginTop: 14 }}>
            LET&apos;S FIND <span className="grad-text">YOURS.</span>
          </h2>
          <p style={{ color: "var(--ink-dim)", maxWidth: 480, marginTop: 14 }}>
            Tell us what you do. Pathfolio AI only writes resume language grounded in what you actually
            answer — nothing is invented.
          </p>
          <div style={{ marginTop: 40 }}>
            <DiscoveryFlow onDiscovered={() => {}} />
          </div>
        </div>
      </section>
    </>
  );
}
