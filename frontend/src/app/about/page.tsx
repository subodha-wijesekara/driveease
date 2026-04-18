"use client";

import { Shield, Settings2, Users, History, Trophy, Globe } from "lucide-react";

export default function AboutPage() {
  return (
    <div style={{ background: "white" }}>
      {/* ═══ HERO SECTION ═══ */}
      <section style={{ padding: "100px 0", borderBottom: "1.5px solid black", background: "black", color: "white" }}>
        <div className="page-container" style={{ textAlign: "center" }}>
          <div className="divider-red" style={{ margin: "0 auto 24px" }} />
          <h1 className="font-display" style={{ fontSize: "clamp(32px, 8vw, 72px)", fontWeight: 900, textTransform: "uppercase", marginBottom: 24 }}>
            Engineered for <span className="text-toyota-red">Performance</span>
          </h1>
          <p style={{ maxWidth: 700, margin: "0 auto", fontSize: 18, color: "#aaa", lineHeight: 1.6 }}>
            DriveEase was founded on a single principle: providing the most reliable, high-performance vehicle rental experience in the world.
          </p>
        </div>
      </section>

      {/* ═══ MISSION SECTION ═══ */}
      <section style={{ padding: "100px 0" }}>
        <div className="page-container" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 80, alignItems: "center" }}>
          <div>
            <h2 className="font-display" style={{ fontSize: 42, marginBottom: 32 }}>Our <span className="text-toyota-red">Mission</span></h2>
            <p style={{ fontSize: 16, lineHeight: 1.8, color: "#444", marginBottom: 24 }}>
              We set out to eliminate the uncertainty of vehicle rentals. By focusing exclusively on precision-engineered fleets and rigorous maintenance schedules, we ensure that every client receives a vehicle that feels brand new, every single time.
            </p>
            <p style={{ fontSize: 16, lineHeight: 1.8, color: "#444" }}>
              Whether it's a corporate flagship SUV for a high-stakes meeting or a performance sedan for a weekend getaway, our mission is to deliver excellence through engineering.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <ValueCard icon={<Shield size={32} />} title="Safety" desc="Military-grade inspection standards." />
            <ValueCard icon={<Settings2 size={32} />} title="Precision" desc="Tuned for optimal performance." />
            <ValueCard icon={<Users size={32} />} title="Exclusivity" desc="Reserved for the discerning driver." />
            <ValueCard icon={<Globe size={32} />} title="Reach" desc="Premium service across 50+ hubs." />
          </div>
        </div>
      </section>

      {/* ═══ STATS BAR ═══ */}
      <section style={{ background: "#f8f8f8", padding: "80px 0", borderTop: "1.5px solid black", borderBottom: "1.5px solid black" }}>
        <div className="page-container" style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 40 }}>
          <StatBox count="15+" label="Years of Excellence" />
          <StatBox count="250k+" label="Successful Journeys" />
          <StatBox count="100%" label="Client Satisfaction" />
          <StatBox count="0" label="Mechanical Failures" />
        </div>
      </section>

      {/* ═══ COMMITMENT SECTION ═══ */}
      <section style={{ padding: "100px 0", background: "black", color: "white" }}>
        <div className="page-container" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 60, alignItems: "center" }}>
          <div style={{ border: "2px solid #333", padding: 60 }}>
            <h3 className="font-display" style={{ fontSize: 32, marginBottom: 20 }}>THE GOLD STANDARD</h3>
            <p style={{ color: "#888", lineHeight: 1.6 }}> Every vehicle in the DriveEase fleet undergoes a mandatory 150-point diagnostic check between every single rental. We don't just rent cars; we manage a fleet of high-performance assets.</p>
          </div>
          <div>
            <h2 className="font-display" style={{ fontSize: 42, marginBottom: 32 }}>Our <span className="text-toyota-red">Commitment</span></h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <div style={{ borderLeft: "4px solid var(--color-primary)", paddingLeft: 24 }}>
                <h4 style={{ fontWeight: 900, marginBottom: 8, textTransform: "uppercase" }}>Zero Hassle Guarantee</h4>
                <p style={{ color: "#aaa", fontSize: 14 }}>Transparent pricing, no hidden fees, and instant availability.</p>
              </div>
              <div style={{ borderLeft: "4px solid var(--color-primary)", paddingLeft: 24 }}>
                <h4 style={{ fontWeight: 900, marginBottom: 8, textTransform: "uppercase" }}>Platinum Support</h4>
                <p style={{ color: "#aaa", fontSize: 14 }}>24/7 priority assistance for all DriveEase members.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ValueCard({ icon, title, desc }: { icon: any; title: string; desc: string }) {
  return (
    <div style={{ border: "1.5px solid black", padding: 24, textAlign: "center" }}>
      <div style={{ color: "var(--color-primary)", marginBottom: 16 }}>{icon}</div>
      <h4 style={{ fontWeight: 900, fontSize: 14, textTransform: "uppercase", marginBottom: 8 }}>{title}</h4>
      <p style={{ fontSize: 12, color: "#666" }}>{desc}</p>
    </div>
  );
}

function StatBox({ count, label }: { count: string; label: string }) {
  return (
    <div>
      <div className="font-display" style={{ fontSize: 42, fontWeight: 900, marginBottom: 4 }}>{count}</div>
      <div style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", color: "#888", letterSpacing: 2 }}>{label}</div>
    </div>
  );
}
